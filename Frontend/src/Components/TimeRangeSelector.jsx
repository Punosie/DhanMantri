import { Button } from "./ui/button.jsx"
import { Flex } from "@chakra-ui/react";

const TimeRangeSelector = ({ onTimeRangeChange }) => {
  const ranges = [
    { label: "1 Month", value: "1m" },
    { label: "3 Months", value: "3m" },
    { label: "6 Months", value: "6m" },
    { label: "1 Year", value: "1y" },
    { label: "3 Years", value: "3yr" },
    { label: "5 Years", value: "5yr" },
    { label: "All Time", value: "all" },
  ];

  return (
    <Flex justify="center" wrap="wrap" gap={2}>
      {ranges.map((range) => (
        <Button
          key={range.value}
          onClick={() => onTimeRangeChange(range.value)}
          colorPalette="teal"
          variant="outline"
          p="5"
          mx="2"
        >
          {range.label}
        </Button>
      ))}  
    </Flex>
  );
};

export default TimeRangeSelector;
