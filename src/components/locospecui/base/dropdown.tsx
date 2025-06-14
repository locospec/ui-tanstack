import { Dot } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface OptionProps {
  title?: string; // Display name
  const?: string; // Unique identifier
}

interface DropdownProps {
  dataSource: () => Promise<OptionProps[]>; // Function to fetch data
  defaultSelected?: any; // Default selected values
  onChange: (value: OptionProps) => void; // Callback for selected value
  valueKey?: string; // Key for value if needed
  placeholder?: string; // Placeholder for the dropdown
  selectIdentifier?: boolean;
  sortOptions?: boolean;
  disabled?: boolean;
  styles?: {
    outerContainer?: string;
    dropdownItemsClass?: string;
    hoverBgColor?: string;
    hoverTextColor?: string;
    hideDot?: Boolean;
  };
}

export function Dropdown({
  dataSource,
  defaultSelected,
  sortOptions,
  selectIdentifier = false,
  onChange,
  disabled,
  valueKey = "value",
  placeholder,
  styles,
}: DropdownProps) {
  const [options, setOptions] = useState<OptionProps[]>([]);
  const [selectedValue, setSelectedValue] = useState<OptionProps | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await dataSource();

      if (sortOptions === false) {
        setOptions(data);
      } else {
        const sortedData = (data || []).sort((a, b) =>
          (a.title || "").localeCompare(b.title || "")
        );
        setOptions(sortedData);
      }
    };

    fetchData();
  }, [dataSource]);

  useEffect(() => {
    // Only set selected value and trigger onChange if defaultSelected changes and is different from the current selected value
    if (defaultSelected && selectedValue?.const !== defaultSelected.value) {
      setSelectedValue(defaultSelected); // Set the first default selected value
      onChange(defaultSelected); // Call onChange with the default value
    }

    if (defaultSelected === undefined) {
      setSelectedValue(defaultSelected); // Set the first default selected value
    }
  }, [defaultSelected, selectedValue, onChange]);

  const handleSelect = (value: string) => {
    const selectedOption = options.find((opt: any) => opt[valueKey] === value);
    setSelectedValue(selectedOption);
    if (selectedOption) {
      onChange(selectedOption); // Pass the entire option object
    }
  };

  return (
    <Select
      disabled={disabled}
      value={selectedValue ? selectedValue[valueKey as keyof OptionProps] : ""}
      onValueChange={handleSelect}
    >
      <SelectTrigger className={`capitalize ${styles?.outerContainer}`}>
        {selectIdentifier &&
          selectedValue &&
          (styles?.hideDot ? (
            <></>
          ) : (
            <span className="h-[5px] w-[8px]">
              <Dot className={`${styles?.hideDot ? "hidden" : ""}`} />
            </span>
          ))}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options?.map((option: any) => (
            <SelectItem
              className={`text-brand-textLightGrey tracking-wider capitalize ${styles?.dropdownItemsClass} ${styles?.hoverTextColor} ${styles?.hoverBgColor}`}
              key={option[valueKey]}
              value={option[valueKey]}
            >
              {option.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
