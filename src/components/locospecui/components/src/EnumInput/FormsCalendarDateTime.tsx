import { Calendar } from "@/components/locospecui/base/calendar";
import { Input } from "@/components/locospecui/base/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/locospecui/base/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

export interface FormsCalendarDateTimeInterface {
  onChangeCallback?: (val: string) => void;
  values?: string;
  setValues?: (val: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  setIsLoading?: (val: boolean) => void;
  errors?: string;
  required?: boolean;
  title?: string;
}

const FormsCalendarDateTime: React.FC<FormsCalendarDateTimeInterface> = ({
  onChangeCallback,
  values,
  setValues,
  placeholder = "Select option",
  errors,
  required = false,
  title,
}) => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | undefined>(
    values ? new Date(values) : undefined
  );

  useEffect(() => {
    if (values) {
      const parsed = new Date(values);
      if (!isNaN(parsed.getTime())) setSelectedDateTime(parsed);
    }
  }, [values]);

  const generateTimes = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        const formattedHour = String(hour).padStart(2, "0");
        const formattedMinute = String(minute).padStart(2, "0");
        times.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return times;
  };

  const times = generateTimes();

  const updateParent = (date: Date) => {
    const isoString = date.toISOString();
    setValues?.(isoString);
    onChangeCallback?.(isoString);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    const currentTime = selectedDateTime ?? new Date();
    const combinedDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      currentTime.getHours(),
      currentTime.getMinutes()
    );
    setSelectedDateTime(combinedDateTime);
    updateParent(combinedDateTime);
  };

  const handleTimeSelect = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const currentDate = selectedDateTime ?? new Date();
    const combinedDateTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      hours,
      minutes
    );
    setSelectedDateTime(combinedDateTime);
    updateParent(combinedDateTime);
  };

  return (
    <div className="w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className="font-openSans text-web-body-sm text-brand-textLightGrey h-[50px] w-full rounded-none leading-4 font-normal"
          >
            <div className="flex w-full items-center justify-between">
              <div className="relative w-full">
                <Input
                  id="name"
                  focusBorderClasses="shadow-none"
                  value={
                    selectedDateTime
                      ? `${selectedDateTime.toLocaleDateString()} ${selectedDateTime.toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}`
                      : ""
                  }
                  onChange={() => {}}
                  required
                  className="peer focus:border-brand-orange font-openSans text-web-body-sm text-brand-textLightGrey pointer-events-none h-[50px] w-full border border-none bg-transparent !px-0 pt-4 pb-[6px] leading-4 font-normal outline-none autofill:bg-white hover:cursor-pointer"
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
          <div className="mobile:flex">
            <Calendar
              mode="single"
              classNames={{
                nav_button_previous: "absolute left-1 border-none",
                nav_button_next: "absolute right-1 border-none",
              }}
              selected={selectedDateTime}
              onSelect={e => handleDateSelect(e)}
              disabled={date => date < new Date()}
              initialFocus
            />
            <div className="mobile:py-3 mobile:pl-6 mobile:flex-col flex items-center rounded-lg border px-6 py-1 pl-16">
              <p className="mobile:mb-0 mb-2">Time</p>
              <ul className="mobile:mt-3 mobile:ml-0 mobile:h-[230px] ml-5 h-[90px] space-y-1 overflow-y-auto">
                {times.map((time, index) => {
                  const [h, m] = time.split(":").map(Number);
                  const isSelected =
                    selectedDateTime &&
                    selectedDateTime.getHours() === h &&
                    selectedDateTime.getMinutes() === m;
                  return (
                    <li
                      key={index}
                      onClick={() => handleTimeSelect(time)}
                      className={`mobile:w-auto font-openSans text-web-body-md hover:bg-brand-bgBlack w-[100px] p-0.5 text-center leading-5 font-normal hover:cursor-pointer hover:text-white ${
                        isSelected ? "bg-brand-bgBlack text-white" : "bg-white"
                      } rounded`}
                    >
                      {time}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {errors && (
        <label
          htmlFor="name"
          className="text-brand-textRed text-web-body-sm ml-2"
        >
          {errors}
        </label>
      )}
    </div>
  );
};

export { FormsCalendarDateTime };
