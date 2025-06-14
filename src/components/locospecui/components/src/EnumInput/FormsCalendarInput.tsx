import { Calendar } from "@/components/locospecui/base/calendar";
import { Input } from "@/components/locospecui/base/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/locospecui/base/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import React, { useState } from "react";

export interface FormsCalendarInputInteface {
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

const FormsCalendarInput: React.FC<FormsCalendarInputInteface> = ({
  onChangeCallback,
  values,
  setValues,
  placeholder = "Select option",
  errors,
  required = false,
  title,
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date(values));
  const [open, setOpen] = useState(false);

  const showDateFormat = (dateValue: string | Date | undefined) => {
    if (!dateValue) return "";

    const dateObj =
      typeof dateValue === "string" ? new Date(dateValue) : dateValue;

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(dateObj);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`; // 'YYYY-MM-DD'

    onChangeCallback?.(formattedDate);
    setDate(selectedDate);
    setValues?.(formattedDate);
    setOpen(false);
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={
              "font-openSans text-web-body-sm text-brand-textLightGrey h-[50px] w-full rounded-none leading-4 font-normal"
            }
          >
            <div className="flex w-full items-center justify-between">
              <div className="relative w-full">
                <Input
                  id="calendar-component"
                  value={showDateFormat(values)}
                  onChange={() => {}}
                  required
                  focusBorderClasses="shadow-none"
                  className="peer focus:border-brand-orange font-openSans text-web-body-sm text-brand-textLightGrey pointer-events-none h-[50px] w-full rounded-none border border-none bg-transparent !px-0 py-4 pb-[6px] leading-4 font-normal outline-none autofill:bg-white hover:cursor-pointer"
                />
                <label
                  htmlFor="name"
                  className={`font-openSans text-brand-borderGrey pointer-events-none absolute top-1.5 left-0 text-[10px] leading-[13px] font-normal text-wrap transition-all duration-300`}
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
                </label>
              </div>
              <CalendarIcon className="ml-auto h-6 w-6" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            classNames={{
              nav_button_previous: "absolute left-1 border-none",
              nav_button_next: "absolute right-1 border-none",
            }}
            selected={date}
            onSelect={e => handleDateSelect(e)}
            disabled={date => date < new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
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

export { FormsCalendarInput };
