import { cn } from "@/lib/utils";
import React from "react";
import JSONForm from "./JSONForm";

export interface FormRendererInterface {
  wrapperClasses?: string;
  onChangeCallback?: any;
}

const FormRenderer: React.FC<FormRendererInterface> = ({
  wrapperClasses = "",
  onChangeCallback,
}) => {
  return (
    <div className={cn("flex flex-col px-4", wrapperClasses)}>
      <JSONForm onChangeCallback={onChangeCallback} />
    </div>
  );
};

export { FormRenderer };
