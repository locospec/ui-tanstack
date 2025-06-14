import { Input } from "@/components/locospecui/base/input";
import React from "react";

export interface FormsTextInputInteface {
  contentType: string;
  onChangeCallback?: any;
  values?: string | number;
  setValues?: any;
  placeholder?: string;
  errors?: any;
  minvalue?: number;
  stepsize?: number;
  required?: boolean;
  title?: string;
}

const FormsTextInput: React.FC<FormsTextInputInteface> = ({
  onChangeCallback,
  values,
  setValues,
  placeholder = "Enter value..",
  errors,
  contentType,
  minvalue,
  stepsize,
  title,
  required = false,
}) => {
  const handleValueChange = (value: string) => {
    setValues(value);
    onChangeCallback && onChangeCallback(value);
  };

  return (
    <div className={`relative w-full`}>
      <Input
        type={contentType}
        {...(contentType === "number" ? { stepsize, min: minvalue } : {})}
        id="name"
        value={values}
        onChange={e => {
          handleValueChange(e.target.value);
        }}
        onWheel={(e: any) => e.target.blur()}
        onKeyDown={e => {
          if (contentType === "number" && (e.key === "-" || e.key === "e")) {
            e.preventDefault();
          }
        }}
        focusBorderClasses="focus-visible:border-brand-orange"
        className={`peer font-openSans text-web-body-sm text-brand-textLightGrey h-[50px] w-full rounded-none border bg-white py-4 pb-[6px] pl-4 leading-4 font-normal autofill:bg-white`}
      />
      <label
        htmlFor="name"
        className={`font-openSans text-web-body-sm mid:text-web-body-lg mid:leading-5 absolute leading-3 font-normal ${
          !values ? "text-brand-borderGrey" : "text-transparent"
        } peer-focus:text-brand-orange peer-valid:text-brand-borderGrey pointer-events-none top-4 left-4 transition-all duration-300 peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-[10px] peer-placeholder-shown:text-gray-400 peer-valid:top-1.5 peer-valid:text-[10px] peer-valid:leading-[13px] peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:leading-[13px]`}
      >
        {required
          ? title
            ? title + "*"
            : placeholder + "*"
          : title
            ? title
            : placeholder}
      </label>
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

export { FormsTextInput };
