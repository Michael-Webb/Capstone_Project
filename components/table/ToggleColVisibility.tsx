import { Button } from "../ui/button";
import { EyeNoneIcon } from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";

interface DataTableColumnVisibilityProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
}

export default function ColumnHeaderVisibility<TData, TValue>({
  column,
}: DataTableColumnVisibilityProps<TData, TValue>) {
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => column.toggleVisibility(false)}
        size="sm"
        className="h-8 data-[state=open]:bg-accent"
      >
        <EyeNoneIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
      </Button>
    </>
  );
}
