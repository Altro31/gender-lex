import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
} from "@/components/ui/combobox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { HomeSchema } from "@/sections/home/form/home-schema";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useEffectEvent, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

interface Props<T> {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  initialData?: T[];
  fetcherFunc: (params: { page: number }) => Promise<T[]>;
  getKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  renderValue: (item: T) => React.ReactNode;
  getValue?: (item: T | null) => any;
  getLabel?: (item: T) => string;
  renderLastItem?: React.ReactNode;
  getDisabled?: (item: T) => boolean;
  getGroup?: (item: T) => string;
}

export default function RHFComboboxAutofetcher<T>({
  name,
  label,
  required,
  placeholder,
  initialData = [],
  fetcherFunc,
  getKey,
  renderItem,
  renderValue,
  getDisabled,
  getLabel = (item) => (item as any).label,
  getGroup,
  getValue = (item) => item,
  renderLastItem,
}: Props<T>) {
  const { setValue } = useFormContext();
  const value = useWatch({ name });
  const [open, setOpen] = useState(false);
  const { data, isPending } = useInfiniteQuery({
    initialData: { pageParams: [0], pages: [initialData] },
    queryKey: [name],
    queryFn: ({ pageParam }) => fetcherFunc({ page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: T[], _, lasPageParam) =>
      lastPage.length ? lasPageParam + 1 : undefined,
  });
  const setDefaultValueEvent = useEffectEvent(() => {
    const items = data.pages.flat();
    const item = items.find((i) => getKey(i) === getKey(value));
    if (item) setValue(name, item);
  });
  useEffect(() => setDefaultValueEvent(), [data]);

  const grouped = Object.groupBy(
    data.pages.flat(),
    (item) => getGroup?.(item) ?? ""
  );

  type Group = {
    value: string;
    items: T[];
  };

  const groups = Object.entries(grouped).map(
    ([value, items]) =>
      ({
        value,
        items,
      } as Group)
  );

  const handleOpen = (open: boolean) => {
    if (!open) setOpen(open);
    setTimeout(() => setOpen(open), 100);
  };

  return (
    isPending || (
      <FormField
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && (
              <FormLabel>
                {label} {required && "*"}
              </FormLabel>
            )}
            <Combobox
              items={groups}
              value={field.value}
              onValueChange={(item) => {
                field.onChange(getValue(item));
              }}
              autoHighlight
              filter={(item, query) =>
                getLabel(item)
                  .toLowerCase()
                  .trim()
                  .includes(query.toLowerCase().trim())
              }
              itemToStringValue={getKey}
              itemToStringLabel={getLabel}
              open={open}
              onOpenChange={handleOpen}
              isItemEqualToValue={(a, b) => getKey(a) === getKey(b)}
            >
              <FormControl>
                {/* <ComboboxTrigger size={size}>
                  <ComboboxValue>
                    {(item?: T) => {
                      return item ? renderValue(item) : placeholder;
                    }}
                  </ComboboxValue>
                </ComboboxTrigger> */}
                <ComboboxInput placeholder={placeholder} />
              </FormControl>
              <ComboboxContent onScrollEnd={() => alert("End")}>
                <ComboboxList>
                  {(group: Group) => (
                    <ComboboxGroup key={group.value} items={group.items}>
                      {group.value && (
                        <ComboboxLabel>{group.value}</ComboboxLabel>
                      )}
                      <ComboboxCollection>
                        {(item: T) => {
                          const itemKey = getKey(item);

                          const itemDisabled = getDisabled?.(item) ?? false;
                          return (
                            <ComboboxItem
                              key={itemKey}
                              value={item}
                              disabled={itemDisabled}
                            >
                              {renderItem(item)}
                            </ComboboxItem>
                          );
                        }}
                      </ComboboxCollection>
                    </ComboboxGroup>
                  )}
                </ComboboxList>
                {renderLastItem && (
                  <div className="p-1">
                    {groups.length > 0 && <ComboboxSeparator />}
                    {renderLastItem}
                  </div>
                )}
              </ComboboxContent>
            </Combobox>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  );
}
