import { useState } from "react";
import { HStack, VStack, Heading } from "@chakra-ui/react";
import DatePickerComponent from "./ui/Datepicker.jsx";
import { Field } from "./ui/field.jsx";
import { Button } from "./ui/button.jsx"
import { toaster } from "./ui/toaster.jsx";

const DateRangeSelector = ({ onApply }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleApply = () => {
    if (startDate && endDate) {
      if (startDate > endDate) {

        toaster.create({
          title: "Invalid Date Range",
          description: "Start date cannot be after end date.",
          type: "error",
        });
        return;
      }
      onApply(startDate, endDate);
    } else {
      toaster.create({
        title: "Invalid Date Range",
        description: "Please select both start and end dates.",
        type: "warning",
      });
      return;
    }
  };


  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
  };



  return (
    <>
        <VStack gap="6" >
            <Heading size="lg">Select Date Range</Heading>
            <HStack gap="6">
                <Field label="Start Date">
                    <DatePickerComponent selectedDate={startDate} onChange={setStartDate} />
                </Field>
                <Field label="End Date">
                    <DatePickerComponent selectedDate={endDate} onChange={setEndDate} />
                </Field>
            </HStack>
            <HStack width="100%">
              <Button onClick={handleApply} colorPalette="teal" variant="outline" flex="1">  
                Apply
              </Button>
              <Button onClick={handleClear} colorPalette="red" variant="outline" flex="1">  
                Clear
              </Button>
            </HStack>

        </VStack>
    </>
  );
};

export default DateRangeSelector;
