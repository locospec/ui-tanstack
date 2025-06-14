import React from "react";
import { FormsSwitchInput } from "./FormsSwitchInput";
import { generateTitleName } from "./utils";

export interface FormsSwitchInputWrapperInterface {
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
  data?: any;
}

const FormsSwitchInputWrapper: React.FC<
  FormsSwitchInputWrapperInterface
> = props => {
  const { schema, path, handleChange, errors = null, required, data } = props;
  const { title = "" } = schema;
  const [values, setValues] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState(false);

  const placeholder = generateTitleName(path as unknown as string);

  const filterContainerRef = React.useRef<HTMLDivElement>(null);

  const handleValueChange = (value: string) => {
    handleChange(path, value);
  };

  React.useEffect(() => {
    setValues(data);
  }, [data]);

  return (
    <div className="h-full" ref={filterContainerRef}>
      <FormsSwitchInput
        title={title}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        onChangeCallback={handleValueChange}
        values={values ?? false}
        setValues={setValues}
        placeholder={placeholder}
        errors={errors}
        required={required}
      />
    </div>
  );
};

export { FormsSwitchInputWrapper };
