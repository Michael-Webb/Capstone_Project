import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TruncatedTextProps {
  text: string;
  length?: number;
  type?: "default" | "primary" | "secondary" | "accent";
  textClassName?: string;
  tooltipClassName?: string;
  capability?: "default" | "withUpdate";
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  text = "",
  length = 50,
  textClassName = "",
  tooltipClassName = "",
  capability = "default",
}) => {
  const truncatedText = text && length !== null && text.length > length ? `${text.slice(0, length)}...` : text;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className={`inline-block whitespace-nowrap overflow-hidden text-ellipsis max-w-full ${textClassName}`}>
          {truncatedText}
        </span>
      </PopoverTrigger>
      <PopoverContent>
        <span className="flex w-full gap-2">
          {capability === "default" ? (
            <Textarea className={`h-12 ${tooltipClassName}`} value={text} readOnly />
          ) : (
            <>
              <Textarea className={`h-12 ${tooltipClassName}`} value={text} />
              <Button variant="outline">Update</Button>
            </>
          )}
        </span>
      </PopoverContent>
    </Popover>
  );
};

export default TruncatedText;
