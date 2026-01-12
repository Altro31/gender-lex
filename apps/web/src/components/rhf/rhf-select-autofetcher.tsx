import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInfiniteQuery } from "@tanstack/react-query";
import { find } from "effect/Stream";
import { useState, type ComponentProps } from "react";

interface Props<T> {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  size?: ComponentProps<typeof SelectTrigger>["size"];
  initialData?: T[];
  fetcherFunc: (params: { page: number }) => Promise<T[]>;
  getKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  renderValue: (item: T) => React.ReactNode;
  renderLastItem?: React.ReactNode;
  getDisabled?: (item: T) => boolean;
  getGroup?: (item: T) => string;
}

export default function RHFSelectAutofetcher<T>({
  name,
  label,
  required,
  placeholder,
  size,
  initialData = [],
  fetcherFunc,
  getKey,
  renderItem,
  renderValue,
  getDisabled,
  getGroup,
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

  const groups = Object.entries(grouped);

  const handleOpen = (open: boolean) => {
    if (!open) setOpen(open);
    setTimeout(() => setOpen(open), 100);
  };

  const findItem = (key: string) =>
    data.pages.flat().find((i) => getKey(i) === key);

  return (
    <FormField
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            {label && (
              <FormLabel>
                {label} {required && "*"}
              </FormLabel>
            )}
            <Select
              value={field.value}
              onValueChange={field.onChange}
              open={open}
              onOpenChange={handleOpen}
            >
              <FormControl>
                <SelectTrigger size={size}>
                  <SelectValue>
                    {(value) => {
                      const item = findItem(value);
                      return item ? renderValue(item) : placeholder;
                    }}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent className="w-min">
                {groups.map(
                  ([key, value]) =>
                    value && (
                      <SelectGroup key={key}>
                        {key && <SelectLabel>{key}</SelectLabel>}
                        {value.map((item) => {
                          const itemKey = getKey(item);

                          const itemDisabled = getDisabled?.(item) ?? false;

                          return (
                            <SelectItem
                              key={itemKey + ""}
                              value={itemKey}
                              disabled={itemDisabled}
                            >
                              {renderItem(item)}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    )
                )}
                {renderLastItem && (
                  <>
                    {groups.length > 0 && <SelectSeparator />}
                    <SelectGroup>{renderLastItem}</SelectGroup>
                  </>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
