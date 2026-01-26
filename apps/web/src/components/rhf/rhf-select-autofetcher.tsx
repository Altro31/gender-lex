"use client";

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
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);
  const { data } = useInfiniteQuery({
    initialData: { pageParams: [0], pages: [initialData] },
    queryKey: [name],
    queryFn: ({ pageParam }) => fetcherFunc({ page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: T[], _, lasPageParam) =>
      lastPage.length ? lasPageParam + 1 : undefined,
  });

  const grouped = Object.groupBy(
    data.pages.flat(),
    (item) => getGroup?.(item) ?? ""
  );

  type Group = {
    value: string;
    items: T[];
  };

  const groups = Object.entries(grouped).map<Group>(([value, items]) => ({
    value,
    items: items!,
  }));

  const handleOpen = (open: boolean) => {
    if (!open) setOpen(open);
    setTimeout(() => setOpen(open), 100);
  };

  const getItem = (itemToFind: T) => {
    const items = data.pages.flat();
    return items.find((i) => getKey(i) === getKey(itemToFind)) ?? null;
  };

  return (
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
            value={field.value ? getItem(field.value) : null}
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
              {groups.length > 0 && <ComboboxSeparator />}
              {renderLastItem && <div className="p-1">{renderLastItem}</div>}
            </ComboboxContent>
          </Combobox>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
