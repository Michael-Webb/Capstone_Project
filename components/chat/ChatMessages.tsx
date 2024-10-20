// @/components/chat/ChatMessages.tsx
"use client";
import { useRef, useEffect, useCallback } from "react";
import { Message } from "@ai-sdk/react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus as dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { Bot, User } from "lucide-react";
import mayskie from "@/assets/mayskie.svg";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Button } from "../ui/button";
import { useSearchParams } from "next/navigation";
import { updateListing } from "@/app/actions/updateListings";
import CopyButton from "../CopyButton";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import TruncatedText from "../table/TruncatedText";
import { createClient } from "@/utils/supabase/client";
import { ImageData } from "@/types/image_types";
import {fetchProductImages } from "@/app/actions/getInventory"

interface ChatMessagesProps {
  messages: Message[];
  status: string;
  imageData: ImageData[];
}

type DataStream = {
  role: string;
  data: ListingData;
};

type ListingOutput = {
  tool_call_name: string;
  params: string;
  file_id: string;
  image_id: string;
  messageValue: string;
  image_url: string;
  old_filename: string;
  supabaseFileName: string;
  db_id: string;
};

type paramsObject = {
  [key: string]: string;
};

type Params = {
  title: string | null;
  description: string | null;
  condition: string | null;
  keywords: string | null;
  colors: string | null;
  materials: string | null;
  department: string | null;
  category: string | null;
  subcategory: string | null;
  brand: string | null;
  size: string | null;
  all_style_tags: string | null;
  uploadedImages?: string | null;
};

type ListingDataItem = {
  tool_call_id: string;
  output: string;
}; 
type ListingData = ListingDataItem[];

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, status, imageData }) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const imageId = searchParams.get("db_id");

  //console.log(messages, status, imageData);

  const printParams = (outputString: string) => {
    try {
      const outputObject = JSON.parse(outputString);
      const paramsObject = JSON.parse(outputObject.params);
      return "```json\n" + JSON.stringify(paramsObject, null, 2) + "\n```";
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return "```\nError: Invalid JSON\n```";
    }
  };

  const handleCreateListing = async (data: ListingData, specificImageId: string) => {
    //console.log(data, specificImageId,imageIdParam);
    if (data[0].output && specificImageId) {
      try {
        const outputData = JSON.parse(data[0].output) || null;
        //console.log("outputData", outputData);
        const defaultParams: Params = {
          title: null,
          description: null,
          condition: null,
          keywords: null,
          colors: null,
          materials: null,
          department: null,
          category: null,
          subcategory: null,
          brand: null,
          size: null,
          all_style_tags: null,
        };
        const params = outputData?.params ? (JSON.parse(outputData.params) as Params) : defaultParams;
        // const supabase = createClient();
        // Fetch the current row to get the existing uploadedImages
        // const { data: currentListing, error: fetchError } = await supabase
        //   .from("products")
        //   .select("uploadedImages")
        //   .eq("id", specificImageId)
        //   .single();

        // if (fetchError) {
        //   console.error("Error fetching current listing:", fetchError);
        //   return;
        // }

        let currentListing = await fetchProductImages(specificImageId)
        // Define a type for the image filename
        type ImageFilename = string;

        // Filter out nulls and undefined, and create a Set from the existing uploadedImages
        const uniqueUploadedImages = new Set<ImageFilename>(
          (currentListing.uploadedImages || []).filter(
            (img: unknown): img is ImageFilename => typeof img === "string" && img !== ""
          )
        );

        // Add the new image if it's a non-empty string
        if (typeof outputData.supabaseFileName === "string" && outputData.supabaseFileName !== "") {
          uniqueUploadedImages.add(outputData.supabaseFileName);
        }

        // Convert the Set back to an array and filter out any remaining invalid values
        const updatedUploadedImages = Array.from(uniqueUploadedImages).filter(
          (img): img is ImageFilename => img !== "" && img != null
        );

        const paramWithImage = specificImageId ? { ...params, uploadedImages: updatedUploadedImages } : params;

        //console.log("paramWithImage", paramWithImage);
        const result = await updateListing(specificImageId, paramWithImage);
        //console.log(result);
        if (result.error) {
          console.error("Error updating listing:", result.error);
        } else if (result.updatedListing) {
          window.open(`/home/listings/${result.updatedListing.id}`, "_blank");
        }
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    } else {
      console.error("No image_id found in the data or invalid data");
    }
  };

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      const scrollElement = chatContainerRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const renderMessageContent = (m: Message, associatedImage?: ImageData) => {
    //console.log("associatedImage", associatedImage);
    switch (m.role) {
      case "user":
        return (
          <>
            <div className="flex-1 max-w-[70%]">
              <div className="prose dark:prose-invert ml-2 bg-blue-200 dark:bg-blue-700 p-2 rounded-[20px] text-right">
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    code(props) {
                      const { children, className, node, ...rest } = props;
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <SyntaxHighlighter
                          PreTag="div"
                          children={String(children).replace(/\n$/, "")}
                          language={match[1]}
                          style={dark}
                          wrapLines={true}
                          wrapLongLines={true}
                        />
                      ) : (
                        <code {...rest} className={className}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {m.content}
                </Markdown>
                {associatedImage && (
                  <Image
                    src={associatedImage.url}
                    alt="Uploaded image"
                    width={200}
                    height={200}
                    className="mt-2 rounded-md max-w-full h-auto"
                  />
                )}
              </div>
            </div>
            <User width={24} height={24} className="h-[24] w-[24] ml-2 flex-shrink-0" />
          </>
        );
      case "data":
        return (
          <>
            <Bot width={24} height={24} className="h-[24] w-[24] mr-2 flex-shrink-0" />
            <div className="flex-1 max-w-[80%]">
              <div className="prose dark:prose-invert p-2 rounded-[20px] break-words">
                {(() => {
                  if (!m.data || !Array.isArray(m.data) || m.data.length === 0) {
                    return <p>No data available</p>;
                  }
                  const dataItem = m.data[0] as ListingDataItem;

                  let output: ListingOutput;
                  let params: paramsObject;
                  try {
                    output = JSON.parse(dataItem.output) as ListingOutput;
                    //console.log("outputjsonparse", output);
                    params = (JSON.parse(output.params) as paramsObject) || null;
                    //console.log("paramsjsonparse", params);
                  } catch (error) {
                    //console.error("Error parsing output:", error);
                    return <p>Error parsing data</p>;
                  }

                  if (dataItem.tool_call_id === "image") {
                    return (
                      <Card>
                        <CardHeader>
                          <CardTitle>Uploaded Image</CardTitle>
                          <CardDescription>{output.old_filename}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Image
                            src={output.image_url}
                            alt="Display Image"
                            width={200}
                            height={200}
                            className="mt-2 rounded-md max-w-full h-auto"
                          />
                        </CardContent>
                        <CardFooter>
                          <Button
                            onClick={() => handleCreateListing(m.data as ListingData, associatedImage?.db_id || "")}
                          >
                            Create Listing
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  } else {
                    return (
                      <div className="mt-2 p-2 rounded-[20px] bg-gray-200 dark:bg-gray-700">
                        <div className="flex w-full justify-between items-center text-lg font-semibold">
                          Listing Details
                          <CopyButton text={printParams(dataItem.output)} />
                        </div>
                        <Markdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                          components={{
                            code(props) {
                              const { children, className, node, ...rest } = props;
                              const match = /language-(\w+)/.exec(className || "");
                              return match ? (
                                <SyntaxHighlighter
                                  PreTag="div"
                                  children={String(children).replace(/\n$/, "")}
                                  language={match[1]}
                                  style={dark}
                                  wrapLines={true}
                                  wrapLongLines={true}
                                />
                              ) : (
                                <code {...rest} className={className}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {printParams(dataItem.output)}
                        </Markdown>
                        <Button onClick={() => handleCreateListing(m.data as ListingData, imageId || "")}>
                          Create Listing
                        </Button>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          </>
        );
      case "assistant":
        return (
          <>
            <Image
              priority
              src={mayskie}
              alt="MaykiseBot"
              width={24}
              height={24}
              className="h-[24] w-[24] mr-2 flex-shrink-0"
            />
            <div className="flex-1 max-w-[80%]">
              <div className="prose dark:prose-invert bg-gray-200 dark:bg-gray-700 p-2 rounded-[20px] text-left break-words">
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    code(props) {
                      const { children, className, node, ...rest } = props;
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <SyntaxHighlighter
                          PreTag="div"
                          children={String(children).replace(/\n$/, "")}
                          language={match[1]}
                          style={dark}
                          wrapLines={true}
                          wrapLongLines={true}
                        />
                      ) : (
                        <code {...rest} className={className}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {m.content.replace(/\【.*?】/g, "")}
                </Markdown>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <ScrollArea ref={chatContainerRef} className="max-w-3xl h-[60vh] rounded-md flex flex-col-reverse p-2">
      <div className="flex flex-col-reverse">
        {[...messages].reverse().map((m) => {
          //console.log("Processing message:", m);
          const associatedImage = imageData?.find((img) => img.messageId === m.id);

          let parsedOutput = null;
          try {
            if (m.data && Array.isArray(m.data) && m.data.length > 0) {
              const data = m.data as ListingData;
              if (data[0] && typeof data[0].output === "string") {
                parsedOutput = JSON.parse(data[0].output);
              }
            }
          } catch (error) {
            console.error("Error parsing message output:", error);
          }
          //console.log("parsedOutput:", parsedOutput, "associatedImage:", associatedImage);

          const nonNullId = associatedImage?.db_id !== undefined ? parsedOutput?.db_id || null : null;
          //console.log("nonNullId:", nonNullId);

          return (
            <div
              key={m.id}
              className={`flex items-start mb-4 ${
                m.role === "user" ? "justify-end" : m.role === "data" ? "justify-start" : "justify-start"
              }`}
            >
              {renderMessageContent(m, parsedOutput)}
            </div>
          );
        })}
      </div>
      <ScrollBar orientation="vertical" />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default ChatMessages;
