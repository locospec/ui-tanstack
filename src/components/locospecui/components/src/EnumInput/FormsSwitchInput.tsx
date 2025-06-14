import { Switch } from "@/components/locospecui/base/switch";
import React from "react";

export interface FormsSwitchInputInteface {
  onChangeCallback?: any;
  values?: any;
  setValues?: any;
  placeholder?: string;
  isLoading?: any;
  setIsLoading?: any;
  errors?: any;
  required?: boolean;
  title?: string;
}

const FormsSwitchInput: React.FC<FormsSwitchInputInteface> = ({
  onChangeCallback,
  values,
  setValues,
  placeholder = "Select option",
  errors,
  required = false,
  title,
}) => {
  const handleSwitchChange = (checked: boolean) => {
    setValues(checked);
    onChangeCallback && onChangeCallback(checked);
  };

  return (
    <div className="flex h-full items-center gap-x-4">
      <Switch
        thumbClassName="h-6 w-6 data-[state=unchecked]:bg-brand-textGrey"
        checked={values !== "" ? values : false}
        onCheckedChange={checked => {
          handleSwitchChange(checked);
        }}
        className="data-[state=unchecked]:border-brand-textGrey data-[state=unchecked]:text-brand-textGrey hidden h-8 w-[52px] p-1 data-[state=unchecked]:border-2 data-[state=unchecked]:bg-transparent lg:flex"
      />
      <p className="font-openSans text-web-body-sm text-brand-textGrey leading-[14px] font-normal">
        {required
          ? title
            ? title + "*"
            : placeholder + "*"
          : title
            ? title
            : placeholder}
      </p>
      {errors && (
        <label
          htmlFor="name"
          className={"text-brand-textRed text-web-body-sm ml-2"}
        >
          {errors}
        </label>
      )}
    </div>
  );
};

export { FormsSwitchInput };
