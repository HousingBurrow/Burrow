import { Select, DatePicker, Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import z from "zod";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocationEnum } from "@/lib/schemas";
import { startCase } from "lodash";
import { Location } from "@prisma/client";

const { RangePicker } = DatePicker;

const priceRangeSchema = z
  .object({
    lower: z.number().min(0, "Lower price must be non-negative").optional(),
    upper: z.number().min(0, "Upper price must be non-negative").optional(),
  })
  .refine((data) => !data.lower || !data.upper || data.lower <= data.upper, {
    message: "Lower price must be less than or equal to upper price",
    path: ["upper"],
  });

export const searchFormSchema = z.object({
  location: z
    .enum(["Midtown", "WestMidtown", "HomePark", "NorthAvenue"])
    .optional(),
  range: z
    .object({
      start: z.date(),
      end: z.date(),
    })
    .refine(
      (data) => {
        const startDate = dayjs(data.start);
        const endDate = dayjs(data.end);
        return startDate.isBefore(endDate) || startDate.isSame(endDate, "day");
      },
      {
        message: "Start date must be before or same as end date",
        path: ["end"],
      }
    )
    .optional(),
  rooms: z.number().int().min(1, "Must have at least 1 room").optional(),
  price: priceRangeSchema.optional(),
});

const priceOptions = ["500", "1000", "1500", "2000", "2500", "3000"];

interface SearchBarProps {
  onSearchClicked: (params: z.infer<typeof searchFormSchema>) => void;
}

export const SearchBar = ({ onSearchClicked }: SearchBarProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    // No defaultValues - form starts empty
  });

  const onSubmit = (data: z.infer<typeof searchFormSchema>) => {
    onSearchClicked(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#fff",
          borderRadius: 999,
          padding: "8px 12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          gap: 8,
          minWidth: 600,
        }}
      >
        {/* Location */}
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Where"
              allowClear
              style={{
                minWidth: 150,
                borderRadius: 999,
                ...(errors.location && { borderColor: "#ff4d4f" }),
              }}
              status={errors.location ? "error" : undefined}
            >
              {Object.keys(Location).map((loc) => (
                <Select.Option key={loc} value={loc}>
                  {startCase(loc)}
                </Select.Option>
              ))}
            </Select>
          )}
        />

        {/* Date Range */}
        <Controller
          name="range"
          control={control}
          render={({ field: { onChange, value } }) => (
            <RangePicker
              value={value ? [dayjs(value.start), dayjs(value.end)] : undefined}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  onChange({
                    start: dates[0].toDate(),
                    end: dates[1].toDate(),
                  });
                } else {
                  onChange(undefined);
                }
              }}
              style={{
                borderRadius: 999,
                ...(errors.range && { borderColor: "#ff4d4f" }),
              }}
              status={errors.range ? "error" : undefined}
            />
          )}
        />

        {/* Rooms */}
        <Controller
          name="rooms"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              type="number"
              min={1}
              placeholder="Rooms"
              value={value || ""}
              onChange={(e) => {
                const val = e.target.value;
                onChange(val ? Number(val) : undefined);
              }}
              style={{
                width: 100,
                borderRadius: 999,
                ...(errors.rooms && { borderColor: "#ff4d4f" }),
              }}
              status={errors.rooms ? "error" : undefined}
            />
          )}
        />

        {/* Price Range - Upper */}
        <Controller
          name="price.upper"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Price Max"
              allowClear
              style={{
                minWidth: 150,
                borderRadius: 999,
                ...(errors.price?.upper && { borderColor: "#ff4d4f" }),
              }}
              status={errors.price?.upper ? "error" : undefined}
            >
              {priceOptions.map((price) => (
                <Select.Option key={price} value={Number(price)}>
                  ${price}
                </Select.Option>
              ))}
            </Select>
          )}
        />

        {/* Search Button */}
        <Button
          type="primary"
          icon={<SearchOutlined />}
          htmlType="submit"
          style={{ borderRadius: 999 }}
        >
          Search
        </Button>
      </div>

      {/* Error Display */}
      {Object.keys(errors).length > 0 && (
        <div style={{ marginTop: 8, color: "#ff4d4f", fontSize: 12 }}>
          {errors.location && <div>{errors.location.message}</div>}
          {errors.range && (
            <div>{errors.range.message || "Date range is required"}</div>
          )}
          {errors.rooms && <div>{errors.rooms.message}</div>}
          {errors.price?.upper && <div>{errors.price.upper.message}</div>}
          {errors.price?.lower && <div>{errors.price.lower.message}</div>}
        </div>
      )}
    </form>
  );
};
