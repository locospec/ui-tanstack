import { useFormsContext } from "@/components/locospecui/context";
import {
  useDebouncedEffectAfterMount,
  useEffectAfterMount,
} from "@/components/locospecui/hooks";
import { useInfiniteFetch } from "@/components/locospecui/hooks/src/useInfiniteFetch";
import React from "react";
import { FormsEnumInput } from "./FormsEnumInput";
import { capitaliseFirstLetter, generateFilter } from "./utils";

export interface FormsEnumInputWrapperInterface {
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
  data: any;
}

const FormsEnumInputWrapper: React.FC<
  FormsEnumInputWrapperInterface
> = props => {
  const { baseEndpoint, formData, permissionHeaders, context } =
    useFormsContext();
  const { schema, path, handleChange, errors = null, required, data } = props;
  const {
    modelName,
    title = "",
    dependsOn = [],
    options = [],
    allowedScopes = [],
  } = schema;
  const [values, setValues] = React.useState<string>(data ?? "");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const shouldFetch = modelName && options.length === 0;

  const placeholder = capitaliseFirstLetter(path as unknown as string);

  const query_key = `${modelName}&options`;

  const filterContainerRef = React.useRef<HTMLDivElement>(null);
  const relationQueryEndpoint = `${baseEndpoint}/_read_relation_options`;

  const handleValueChange = (value: string) => {
    handleChange(path, value);
  };
  const previousSameGroupRef = React.useRef(
    JSON.stringify(generateFilter(formData, dependsOn))
  );

  const {
    flatData: apiOptions,
    fetchNextPage,
    isFetching,
    hasNextPage,
    refetch,
  } = shouldFetch
    ? useInfiniteFetch({
        queryKey: query_key,
        searchQuery: searchQuery,
        endpoint: relationQueryEndpoint,
        keepPreviousData: true,
        body: {
          relation: modelName,
          filters: generateFilter(formData, dependsOn),
          ...(context &&
            (Object.keys(context).length > 0 || searchQuery !== "") && {
              globalContext: { ...context, search: searchQuery },
            }),
          ...(allowedScopes &&
            allowedScopes.length > 0 && {
              scopes: allowedScopes,
            }),
        },
        refreshDep: [query_key, searchQuery],
        headers: permissionHeaders,
      })
    : {
        flatData: [],
        fetchNextPage: () => {},
        isFetching: false,
        hasNextPage: false,
        refetch: async () => {},
      };

  const enum_options: any[] = [];
  let areOptionsStatic = false;
  if (options.length > 0) {
    areOptionsStatic = true;
    enum_options.push(...options);
  } else {
    areOptionsStatic = false;
    enum_options.push(...apiOptions);
  }

  useDebouncedEffectAfterMount(
    () => {
      setValues("");
      refetch && refetch();
    },
    [JSON.stringify(generateFilter(formData, dependsOn))],
    500
  );

  useEffectAfterMount(() => {
    if (open && !areOptionsStatic) {
      const currentSameGroup = JSON.stringify(
        generateFilter(formData, dependsOn)
      );

      if (previousSameGroupRef.current !== currentSameGroup) {
        setIsLoading(true);
        refetch()
          .then(() => {
            previousSameGroupRef.current = currentSameGroup;
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  }, [open, areOptionsStatic]);

  React.useEffect(() => {
    setValues(data);
  }, [data]);

  return (
    <div className="ENUM-WRAPPER" ref={filterContainerRef}>
      <FormsEnumInput
        open={open}
        title={title}
        setOpen={setOpen}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        options={enum_options}
        filterContainerRef={filterContainerRef}
        model_name={modelName}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onChangeCallback={handleValueChange}
        fetchNextPage={fetchNextPage}
        isFetching={isFetching}
        hasNextPage={hasNextPage}
        values={values}
        setValues={setValues}
        placeholder={placeholder}
        errors={errors}
        required={required}
      />
    </div>
  );
};

export { FormsEnumInputWrapper };
