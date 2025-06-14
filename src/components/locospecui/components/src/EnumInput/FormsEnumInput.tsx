import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/locospecui/base/popover";
import { useFetchMoreOnScroll } from "@/components/locospecui/hooks";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Search, X } from "lucide-react";
import React from "react";

export interface FormsEnumInputInteface {
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
  title?: string;
}

const FormsEnumInput: React.FC<FormsEnumInputInteface> = ({
  options,
  filterContainerRef,
  model_name,
  title,
  searchQuery,
  setSearchQuery,
  onChangeCallback,
  fetchNextPage,
  isFetching,
  hasNextPage,
  values,
  setValues,
  placeholder = "Select option",
  open,
  setOpen,
  isLoading,
  errors,
  required = false,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { fetchMoreOnBottomReached } = useFetchMoreOnScroll({
    containerRef: containerRef,
    fetchNextPage,
    isFetching,
    hasNextPage,
  });

  const handleInputClear = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setValues("");
    onChangeCallback && onChangeCallback("");
  };

  const handleValueChange = (value: string) => {
    setValues(value);
    onChangeCallback && onChangeCallback(value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "font-openSans text-web-body-sm text-brand-textLightGrey focus-visible:ring-ring relative flex w-full items-center justify-start gap-2 rounded-none px-2 leading-4 font-normal whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
            "bg-[#EEEEEE] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
            "hover:bg-accent hover:text-brand-borderGrey h-14 border px-4 py-2",
            errors
              ? "border-red-500 text-[#d32f2f] focus-visible:ring-red-500"
              : "border-border bg-background hover:text-accent-foreground"
          )}
          aria-expanded={open}
        >
          <div className="max-w-[150px] truncate">
            {values && values.length > 0
              ? options
                  .filter(option => values.includes(option?.const))
                  .map(option => option.title)
                  .join(",")
              : `${placeholder} ${required ? "*" : ""}`}
          </div>
          {values && values.length > 0 ? (
            <div
              className="hover:bg-aaccent absolute right-2 h-4 w-4"
              onClick={handleInputClear}
            >
              <X className="shrink-0 opacity-50" />
            </div>
          ) : (
            <div className="absolute right-2 h-4 w-4">
              <ChevronDown className="hover:bg-accent shrink-0 opacity-50" />
            </div>
          )}
          <div
            className={`font-openSans text-brand-borderGrey absolute top-1.5 left-4 text-[10px] leading-[13px] font-normal text-wrap ${
              !values ? "text-transparent" : ""
            } pointer-events-none transition-all duration-300`}
          >
            <p className="py-auto flex h-full flex-col justify-center">
              {required
                ? title
                  ? title + "*"
                  : placeholder + "*"
                : title
                  ? title
                  : placeholder}
            </p>
          </div>
        </div>
      </PopoverTrigger>
      {errors && (
        <label className="ml-[14px] text-xs text-[#d32f2f]">{errors}</label>
      )}
      <PopoverContent
        className="w-[280px] max-w-[300px] p-0"
        containerRef={filterContainerRef}
      >
        <Command>
          <div
            className="flex items-center border-b px-3"
            cmdk-input-wrapper=""
          >
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className={cn(
                "placeholder:text-muted-foreground flex h-8 w-full border-0 bg-transparent py-1 text-sm outline-none hover:bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
              )}
              value={searchQuery}
              placeholder={placeholder}
              onChange={e => {
                setSearchQuery(e.target.value);
              }}
            />
          </div>
          <CommandSeparator />
          <CommandList
            ref={containerRef}
            key={model_name}
            onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
          >
            <CommandEmpty>
              {isLoading ? "Loading options" : "NO options found"}
            </CommandEmpty>
            <CommandGroup>
              {!isLoading &&
                options.map(option => {
                  return (
                    <CommandItem
                      key={option?.const}
                      value={option?.const}
                      onSelect={handleValueChange}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          values && values.includes(option?.const)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option?.title}
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { FormsEnumInput };
