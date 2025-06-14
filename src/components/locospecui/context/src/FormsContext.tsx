import { useFetchConfig } from "@/components/locospecui/hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { createContext } from "react";

const queryClient = new QueryClient();

export interface FormsContextType {
  schema: any;
  uischema: any;
  initialData: any;
  makeActionRequest: any;
  isFetched: boolean;
  isError: boolean;
  formErrors: any;
  formData: any;
  setFormData: any;
  setFormErrors: React.Dispatch<any>;
  baseEndpoint: string;
  permissionHeaders: any;
  handleFormsValuesChange: any;
  clearFormsData: any;
  context: Record<string, any>;
}

export const FormsContext = createContext<FormsContextType | undefined>(
  undefined
);

interface FormsConfigInterface {
  configCallback?: () => Promise<any>;
  endpoint?: string;
  permissionHeaders?: Record<string, string>;
  primaryKey?: string;
  context?: Record<string, any>;
}

interface FormsProviderBaseInterface {
  children: React.ReactNode;
  formsConfig: FormsConfigInterface;
  onChangeCallback?: any;
}

const FormsProviderBase: React.FC<FormsProviderBaseInterface> = ({
  children,
  formsConfig,
  onChangeCallback,
}) => {
  const {
    configCallback,
    endpoint,
    permissionHeaders,
    context = {},
    primaryKey,
  } = formsConfig;
  const configEndpoint = endpoint + "/_config";

  const {
    data: config,
    isFetched,
    isError,
    error,
  }: any = useFetchConfig({
    configEndpoint,
    configCallback,
    permissionHeaders,
    ...(primaryKey && { body: { primaryKey } }),
  });

  const configData = config?.data || {};

  const {
    model = "",
    dbOp = "",
    schema = {},
    uiSchema = {},
    initialData,
  } = configData || {};

  if (isFetched && (!model || !dbOp) && !isError) {
    throw new Error(
      "Missing required config: 'model' and 'dbOp' must be present."
    );
  }

  const actionEndpoint = `${endpoint}/_${dbOp}`;

  const [formErrors, setFormErrors] = React.useState([]);
  const [formData, setFormData] =
    React.useState<Record<string, any>>(initialData);

  const makeActionRequest = React.useCallback(
    async (data: Record<string, any>) => {
      try {
        const response = await fetch(actionEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...permissionHeaders,
          },
          body: JSON.stringify(data),
        });
        const responseData = await response.json();

        return await responseData;
      } catch (error) {
        console.error("Error in makeActionRequest:", error);
        throw error;
      }
    },
    [actionEndpoint, formErrors, permissionHeaders]
  );

  const handleFormsValuesChange = (data: Record<string, any>) => {
    setFormData(data);
    onChangeCallback && onChangeCallback(data);
  };

  React.useEffect(() => {
    if (isFetched && initialData) {
      handleFormsValuesChange(initialData);
    }
  }, [isFetched, initialData]);

  const clearFormsData = () => {
    handleFormsValuesChange({});
  };

  const contextValue = React.useMemo(
    () => ({
      schema,
      uischema: uiSchema,
      initialData,
      makeActionRequest,
      isFetched,
      isError,
      formErrors,
      setFormErrors,
      baseEndpoint: endpoint || "",
      formData,
      setFormData,
      permissionHeaders,
      handleFormsValuesChange,
      clearFormsData,
      context,
    }),
    [
      schema,
      uiSchema,
      initialData,
      makeActionRequest,
      isFetched,
      isError,
      formErrors,
      endpoint,
      formData,
      setFormData,
      permissionHeaders,
      context,
    ]
  );

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="mt-4 text-4xl font-bold">
          {error?.code} {error?.name}
        </h1>
        <p className="mt-2 max-w-md text-sm text-gray-600">{error?.message}</p>
      </div>
    );
  }

  return (
    <FormsContext.Provider value={contextValue}>
      {!isFetched ? <>Loading....</> : children}
    </FormsContext.Provider>
  );
};
FormsProviderBase.displayName = "FormsProviderBase";

interface FormsProviderInterface extends FormsProviderBaseInterface {
  showDevTools?: boolean;
}

const FormsProvider: React.FC<FormsProviderInterface> = ({
  showDevTools = false,
  ...props
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      {showDevTools && <ReactQueryDevtools />}
      <FormsProviderBase {...props} />
    </QueryClientProvider>
  );
};

export { FormsProvider, FormsProviderBase };
