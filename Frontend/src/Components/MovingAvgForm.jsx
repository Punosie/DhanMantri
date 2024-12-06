import { Heading, VStack, Button, HStack } from "@chakra-ui/react";
import { Field } from "./ui/field";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "./ui/select";
import { Controller, useForm } from "react-hook-form";
import { createListCollection } from "@chakra-ui/react";

const MovingAvgForm = ({ onApply }) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur", // Optional: Trigger validation on blur
  });

  const handleClear = () => {
    reset();
    console.log("Clearing Form");
  };

  const onSubmit = (data) => {
    console.log(data);
    onApply(data);
  };

  return (
    <VStack gap="6" align="center" w="100%">
      <Heading size="lg">Moving Average</Heading>
      <form onSubmit={handleSubmit(onSubmit)} className="MA-form">
        <HStack gap="4" w="100%">
          {/* Period Field */}
          <Field
            label="Period"
            invalid={!!errors.period}
            errorText={errors.period && "Period is required"}
          >
            <Controller
              name="period"
              control={control}
              rules={{ required: true }} // Validation rule
              render={({ field }) => (
                <SelectRoot
                  name={field.name}
                  value={field.value}
                  onValueChange={({ value }) => field.onChange(value)}
                  onInteractOutside={() => field.onBlur()}
                  collection={periodOptions}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodOptions.items.map((option) => (
                      <SelectItem item={option} key={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              )}
            />
          </Field>

          {/* Type Field */}
          <Field
            label="Type"
            invalid={!!errors.type}
            errorText={errors.type && "Type is required"}
          >
            <Controller
              name="type"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <SelectRoot
                  name={field.name}
                  value={field.value}
                  onValueChange={({ value }) => field.onChange(value)}
                  onInteractOutside={() => field.onBlur()}
                  collection={typeOptions}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.items.map((option) => (
                      <SelectItem item={option} key={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              )}
            />
          </Field>

          {/* Parameter Field */}
          <Field
            label="Parameter"
            invalid={!!errors.parameter}
            errorText={errors.parameter && "Parameter is required"}
          >
            <Controller
              name="parameter"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <SelectRoot
                  name={field.name}
                  value={field.value}
                  onValueChange={({ value }) => field.onChange(value)}
                  onInteractOutside={() => field.onBlur()}
                  collection={parameterOptions}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder="Parameter" />
                  </SelectTrigger>
                  <SelectContent>
                    {parameterOptions.items.map((option) => (
                      <SelectItem item={option} key={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              )}
            />
          </Field>
        </HStack>
        <HStack gap="4" w="100%" mt="5">
          <Button
            size="sm"
            type="submit"
            colorPalette="teal"
            variant="outline"
            flex="1"
          >
            Apply
          </Button>
          <Button
            size="sm"
            onClick={handleClear}
            colorPalette="red"
            variant="outline"
            flex="1"
          >
            Clear
          </Button>
        </HStack>
      </form>
    </VStack>
  );
};

// Options for Period Field
const periodOptions = createListCollection({
  items: [
    { label: "50", value: "50" },
    { label: "100", value: "100" },
    { label: "200", value: "200" },
  ],
});

// Options for Type Field
const typeOptions = createListCollection({
  items: [
    { label: "SMA", value: "sma" },
    { label: "EMA", value: "ema" },
  ],
});

// Options for Parameter Field
const parameterOptions = createListCollection({
  items: [
    { label: "Open", value: "Open" },
    { label: "Close", value: "Close" },
    { label: "High", value: "High" },
    { label: "Low", value: "Low" },
  ],
});

export default MovingAvgForm;
