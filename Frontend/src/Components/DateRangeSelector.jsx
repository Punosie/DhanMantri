import { useState } from "react";
import { HStack, VStack } from "@chakra-ui/react";
import DatePickerComponent from "./ui/Datepicker.jsx";
import { Field } from "./ui/field.jsx";
import { Button } from "./ui/button.jsx"

const DateRangeSelector = ({ onApply }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleApply = () => {
    if (startDate && endDate) {
      onApply(startDate, endDate);
    } else {
      alert("Please select both start and end dates.");
    }
  };

  return (
    <>
        <VStack gap="6">
            <HStack gap="6">
                <Field label="Start Date">
                    <DatePickerComponent selectedDate={startDate} onChange={setStartDate} />
                </Field>
                <Field label="End Date">
                    <DatePickerComponent selectedDate={endDate} onChange={setEndDate} />
                </Field>
            </HStack>
            <Button onClick={handleApply} colorPalette="teal" variant="outline" w="100% ">  
                Apply
            </Button>
        </VStack>
    </>
  );
};

export default DateRangeSelector;
