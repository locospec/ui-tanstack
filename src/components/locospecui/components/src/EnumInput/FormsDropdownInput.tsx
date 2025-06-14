import { Dropdown } from "@/components/locospecui/base/dropdown";
import React from "react";

export interface FormsDropdownInputInteface {
  options: { title: string; const: string }[];
  filterContainerRef: any;
  model_name: string;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  onChangeCallback?: any;
  fetchNextPage?: any;
  isFetching?: any;
  hasNextPage?: any;
  values?: any;
  setValues?: any;
  placeholder?: string;
  open?: any;
  setOpen?: any;
  isLoading?: any;
  setIsLoading?: any;
  errors?: any;
  required?: boolean;
}

const FormsDropdownInput: React.FC<FormsDropdownInputInteface> = ({
  options,
  onChangeCallback,
  values,
  setValues,
  placeholder = "Select option",
  errors,
  required = false,
}) => {
  const handleValueChange = (value: string) => {
    setValues(value);
    onChangeCallback && onChangeCallback(value);
  };

  return (
    <div className="relative w-full">
      <Dropdown
        dataSource={() => {
          return Promise.resolve(options);
        }}
        defaultSelected={
          values !== ""
            ? options.find((item: any) => values === item.const)
            : undefined
        }
        selectIdentifier={true}
        onChange={(value: any) => handleValueChange(value?.const)}
        valueKey="const"
        placeholder={placeholder}
        styles={{
          dropdownItemsClass: "text-brand-borderGrey",
          hoverBgColor: "focus:bg-brand-lightOrange",
          hoverTextColor: "focus:text-brand-borderGrey",
          hideDot: true,
          outerContainer: `border-[1px] !shadow-none min-w-[130px] w-full rounded-l-none rounded-r-none !h-[50px] font-openSans font-normal text-web-body-sm  mid:text-web-body-lg ${
            values
              ? "items-end text-brand-textLightGrey"
              : "text-brand-borderGrey"
          } leading-5 `,
        }}
      />

      <div
        className={`absolute top-1 left-3 text-[10px] transition-all duration-300 ${
          values ? "text-brand-borderGrey" : "text-transparent"
        }`}
      >
        {required ? placeholder + "*" : placeholder}
      </div>
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

export { FormsDropdownInput };
