import { useState, useEffect } from "react";
import { useAssistant } from "ai/react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProcessedImageData, ImageData } from "@/types/image_types";
export default function Chat() {
  const [pendingImage, setPendingImage] = useState<Omit<ProcessedImageData, "messageId"> | null>(null);
  const [imageData, setImageData] = useState<ImageData[]>([]);

  const { status, messages, input, handleInputChange, submitMessage } = useAssistant({
    api: "/api/assistant",
    body: { pendingImage },
  });

  useEffect(() => {
    if (pendingImage && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "user") {
        setImageData((prev) => [...prev, { messageId: lastMessage.id, ...pendingImage }]);
        setPendingImage(null);
      }
    }
  }, [messages, pendingImage]);

  const handleImageProcessed = (data: ProcessedImageData) => {
    console.log("handleImageProcessed", data);
    setPendingImage(data);
    console.log("Processed image:", data.fileName);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  };

  return (
    <div id="chat-container" className="flex flex-col items-center justify-center w-full max-w-4xl">
      <Card className="bg-secondary w-full">
        <CardHeader>
          <CardTitle>Chat with Mayskie</CardTitle>
        </CardHeader>
        <CardContent>
          <ChatMessages messages={messages} status={status} imageData={imageData} />
        </CardContent>
        <CardFooter className="grow p-2 pt-0 items-stretch flex-col justify-end">
          <ChatInput
            input={input}
            status={status}
            handleInputChange={handleInputChange}
            handleKeyDown={handleKeyDown}
            submitMessage={submitMessage}
            onImageProcessed={handleImageProcessed}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
