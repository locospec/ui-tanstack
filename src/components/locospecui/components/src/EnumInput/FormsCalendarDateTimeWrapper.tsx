import React from "react";
import { FormsCalendarDateTime } from "./FormsCalendarDateTime";
import { generateTitleName } from "./utils";

export interface FormsCalendarDateTimeWrapperInterface {
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

const FormsCalendarDateTimeWrapper: React.FC<
  FormsCalendarDateTimeWrapperInterface
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
    <div className="ENUM-WRAPPER" ref={filterContainerRef}>
      <FormsCalendarDateTime
        title={title}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        onChangeCallback={handleValueChange}
        values={values}
        setValues={setValues}
        placeholder={placeholder}
        errors={errors}
        required={required}
      />
    </div>
  );
};

export { FormsCalendarDateTimeWrapper };
