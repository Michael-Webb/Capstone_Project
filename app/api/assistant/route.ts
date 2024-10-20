// app/api/assistant/route.ts
import { AssistantResponse } from "ai";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export const maxDuration = 60;

async function pollFileStatus(fileId: string, maxAttempts = 10, interval = 2000): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const file = await openai.files.retrieve(fileId);
      if (file.status === "processed") {
        return file.status;
      } else if (file.status === "error") {
        throw new Error("File processing failed");
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    } catch (error) {
      if (attempt === maxAttempts - 1) {
        throw error;
      }
    }
  }
  throw new Error("Polling timed out: File not ready");
}

export async function POST(req: Request) {
  const input: {
    threadId: string | null;
    message: string;
    pendingImage?: {
      db_id: string;
      url: string;
      file_id: string;
      fileName: string;
      supabaseFileName: string;
      old_filename: string;
    };
  } = await req.json();

  const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;
  console.log("Created thread:", threadId);

  const messageContent: any[] = [{ type: "text", text: input.message }];
  if (input?.pendingImage) {console.log("pending",input.pendingImage)}
console.log("pending",input.pendingImage)
  if (input.pendingImage?.file_id) {
    console.log("Waiting for file to be processed...");
    try {
      const fileStatus = await pollFileStatus(input.pendingImage.file_id);
      console.log("File is ready. Status:", fileStatus);

      messageContent.push({
        type: "image_file",
        image_file: { file_id: input.pendingImage.file_id, detail: "auto" },
      });
    } catch (error) {
      console.error("Error while polling file status:", error);
      messageContent.push({
        type: "image_file",
        image_file: { file_id: input.pendingImage.file_id, detail: "auto" },
      });
      throw new Error("Failed to prepare file for message");
    }
  }

  //console.log("Final messageContent:", JSON.stringify(messageContent, null, 2));

  try {
    const createdMessage = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: messageContent,
    });
    //console.log("Created message:", JSON.stringify(createdMessage, null, 2));

    return AssistantResponse({ threadId, messageId: createdMessage.id }, async ({ forwardStream, sendDataMessage }) => {
      const runStream = openai.beta.threads.runs.stream(threadId, {
        assistant_id:
          process.env.OPENAI_ASSISTANT_ID ??
          (() => {
            throw new Error("ASSISTANT_ID is not set");
          })(),
      });

      if (input.pendingImage?.url !== undefined && input.pendingImage?.url !== null) {
        console.log("now");
        let ImageDataObject = {
          tool_call_name: "display_image",
          params: null,
          file_id: input.pendingImage.file_id,
          messageValue: input.pendingImage.fileName,
          image_url: input.pendingImage.url,
          old_filename: input.pendingImage.old_filename,
          supabaseFileName: input.pendingImage.supabaseFileName,
          db_id:input.pendingImage.db_id,
        }
        sendDataMessage({
          role: "data",
          data: [
            {
              tool_call_id: "image",
              output: JSON.stringify(ImageDataObject),
            },
          ],
        });
        console.log(input)
      }

      let runResult = await forwardStream(runStream);
      console.log(runResult);

      while (runResult?.status === "requires_action" && runResult.required_action?.type === "submit_tool_outputs") {
        const toolCall_outputs = runResult.required_action.submit_tool_outputs.tool_calls.map((toolCall: any) => {
          const parameters = JSON.parse(toolCall.function.arguments);
          switch (toolCall.function.name) {
            case "create_listing":
              const fileIdContent = createdMessage.content.find((item) => item.type === "image_file") as
                | { type: "image_file"; image_file: { file_id: string } }
                | undefined;

              const textContent = createdMessage.content.find((item) => item.type === "text") as
                | { type: "text"; text: { value: string } }
                | undefined;

              return {
                tool_call_id: toolCall.id,
                output: JSON.stringify({
                  tool_call_name: "create_listing",
                  params: JSON.stringify(parameters),
                  imageInfo:input.pendingImage || null,
                  file_id: fileIdContent?.image_file?.file_id || null,
                  image_id: input.pendingImage?.db_id || null,
                  messageValue: textContent?.text?.value || null,
                  image_url: input.pendingImage?.url || null,
                  old_filename: input.pendingImage?.old_filename || null,
                  db_id:input.pendingImage?.db_id || null,
                }),
              };

            default:
              throw new Error(`Unknown tool call function: ${toolCall.function.name}`);
          }
        });

        //console.log("tooloutputstream", toolCall_outputs);
        runResult = await forwardStream(
          openai.beta.threads.runs.submitToolOutputsStream(threadId, runResult.id, { tool_outputs: toolCall_outputs })
        );
        sendDataMessage({ role: "data", data: toolCall_outputs });
      }
    });
  } catch (error) {
    console.error("Error creating message:", error);
    console.error("Thread ID:", threadId);
    console.error("Message Content:", JSON.stringify(messageContent, null, 2));
    throw error;
  }
}
