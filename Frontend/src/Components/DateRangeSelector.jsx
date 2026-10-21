import { useState } from "react";
import { HStack, VStack, Heading, Input } from "@chakra-ui/react";
import { Field } from "./ui/field.jsx";
import { Button } from "./ui/button.jsx"
import { toaster } from "./ui/toaster.jsx";

const today = () => new Date().toISOString().split("T")[0];

const DateRangeSelector = ({ onApply }) => {
  // YYYY-MM-DD strings from the native date inputs
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleApply = () => {
    if (!startDate || !endDate) {
      toaster.create({
        title: "Invalid Date Range",
        description: "Please select both start and end dates.",
        type: "warning",
      });
      return;
    }
    if (startDate > endDate) {
      toaster.create({
        title: "Invalid Date Range",
        description: "Start date cannot be after end date.",
        type: "error",
      });
      return;
    }
    onApply(startDate, endDate);
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <VStack gap="6" px="8">
        <Heading as="h2" fontSize="2xl" fontWeight="bold" color="gray.200">Select Date Range</Heading>
        <HStack gap="6">
            <Field label="Start Date">
                <Input type="date" value={startDate} max={endDate || today()} onChange={(e) => setStartDate(e.target.value)} css={{ colorScheme: "dark" }} />
            </Field>
            <Field label="End Date">
                <Input type="date" value={endDate} min={startDate || undefined} max={today()} onChange={(e) => setEndDate(e.target.value)} css={{ colorScheme: "dark" }} />
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
  );
};

export default DateRangeSelector;
