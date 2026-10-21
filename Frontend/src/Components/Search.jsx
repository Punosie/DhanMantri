import { Combobox, Portal, useFilter, useListCollection } from "@chakra-ui/react";
import { stockOptions, symbolLabel } from "../Utils/stocks";

export default function StockSelector({ selectedSymbol, onSymbolChange }) {
  const { contains } = useFilter({ sensitivity: "base" });
  const { collection, filter } = useListCollection({ initialItems: stockOptions, filter: contains });

  return (
    <Combobox.Root
      collection={collection}
      value={[selectedSymbol]}
      defaultInputValue={symbolLabel(selectedSymbol)}
      onValueChange={({ value }) => value[0] && onSymbolChange(value[0])}
      onInputValueChange={({ inputValue, reason }) => filter(reason === "input-change" ? inputValue : "")}
      openOnClick
      inputBehavior="autohighlight"
      width="100%"
    >
      <Combobox.Label>Stock</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Search a stock" />
        <Combobox.IndicatorGroup>
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No matching stock</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
}
