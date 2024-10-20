"use client";

import { useFormStatus } from "react-dom";
import { type ComponentProps, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

type Props = Omit<ComponentProps<typeof Button>, "ref"> & {
  pendingText?: string;
};

export const SubmitButton = forwardRef<HTMLButtonElement, Props>(
  ({ children, pendingText, ...props }, ref) => {
    const { pending, action } = useFormStatus();

    const isPending = pending && action === props.formAction;

    return isPending ? (
      <Button disabled ref={ref}>
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        {pendingText || "Please wait"}
      </Button>
    ) : (
      <Button {...props} type="submit"  ref={ref}>
        {children}
      </Button>
    );
  }
);

SubmitButton.displayName = "SubmitButton";