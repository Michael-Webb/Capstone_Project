//components/chat/ChatInput.tsx

import { Mic, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutosizeTextarea } from "../ui/autosize-textarea";
import { LoadingSpinner } from "@/components/LoadingIcon";
import ImageUploadButton from "./ImageUploadButton";
import { ProcessedImageData } from "@/types/image_types";
import AudioRecordButton from "@/components/chat/AudioRecordButton";

interface ChatInputProps {
  input: string;
  status: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  submitMessage: () => Promise<void>;
  onImageProcessed: (data: ProcessedImageData) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  status,
  handleInputChange,
  handleKeyDown,
  submitMessage,
  onImageProcessed,
}) => {
  const handleImageProcessed = (data: ProcessedImageData) => {
    onImageProcessed(data);
  };

  const handleTranscriptionAdd = (text: string) => {
    // Append the transcription to the existing input
    const updatedInput = input + (input ? " " : "") + text;
    handleInputChange({ target: { value: updatedInput } } as React.ChangeEvent<HTMLTextAreaElement>);
  };
  const isInProgress = status === "in_progress";
  return (
    <div id="ChatBottomBar">
  <form
    id="ChatForm"
    onSubmit={(e) => {
      e.preventDefault();
      submitMessage();
    }}
    className="flex w-full items-center"
  >
    <div className="flex items-center gap-2 flex-shrink-0">
      <ImageUploadButton onImageProcessed={handleImageProcessed} disabled={isInProgress} />
      <AudioRecordButton onTranscriptionAdd={handleTranscriptionAdd} disabled={isInProgress} />
    </div>
    <div className="flex-grow mx-2">
      <AutosizeTextarea
        placeholder="Message MayskieBot ..."
        className="w-full text-base scrollbar-content overflow-y-auto overflow-x-hidden rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        id="maintext"
      />
    </div>
    <div id="buttonParent" className="flex-shrink-0">
      {status === "in_progress" ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:duration-0"
        >
          <LoadingSpinner id="loadingSpinner" className="h-10 w-10 align-middle" />
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={status !== "awaiting_message" || !input}
          variant="ghost"
          size="icon"
          className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-300 hover:duration-0"
        >
          <SendHorizontal className="h-10 w-10 align-middle" />
        </Button>
      )}
    </div>
  </form>
</div>
  );
};

export default ChatInput;
