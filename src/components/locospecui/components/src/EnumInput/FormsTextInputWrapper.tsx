import React from "react";
import { FormsTextInput } from "./FormsTextInput";
import { generateTitleName } from "./utils";

export interface FormsTextInputWrapperInterface {
  placeholder?: string;
  emptyLabel?: string;
  callback?: (values: string | string[]) => void;
  defaultValues?: string[];
  selectedAttribute: any;
  condition: any;
  path: number[];
  resetInput?: string;
  multiple?: boolean;
  filterContainerRef: any;
  className?: any;
  schema?: any;
  handleChange?: any;
  errors?: any;
  required?: boolean;
  data?: string | number;
}

const FormsTextInputWrapper: React.FC<
  FormsTextInputWrapperInterface
> = props => {
  const { schema, path, handleChange, errors = null, required, data } = props;
  const { type = "string", minvalue = 0, stepsize = 1, title = "" } = schema;
  const [values, setValues] = React.useState<any>(
    data === undefined ? "" : data
  );

  React.useEffect(() => {
    setValues(data);
  }, [data]);

  const placeholder = generateTitleName(path as unknown as string);

  const filterContainerRef = React.useRef<HTMLDivElement>(null);

  const handleValueChange = (value: string) => {
    handleChange(path, value);
  };

  return (
    <div className="TEXT-WRAPPER h-full" ref={filterContainerRef}>
      <FormsTextInput
        title={title}
        minvalue={minvalue}
        stepsize={stepsize}
        contentType={type}
        onChangeCallback={handleValueChange}
        values={values ?? ""}
        setValues={setValues}
        placeholder={placeholder}
        errors={errors}
        required={required}
      />
    </div>
  );
};

export { FormsTextInputWrapper };
