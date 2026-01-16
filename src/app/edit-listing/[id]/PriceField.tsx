import { FieldGroup, FieldLabel, Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface PriceFieldProps {
  prices: {
    price_day: number;
    price_week: number | null;
    price_month: number | null;
  };
  handlePriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PriceField = ({ prices, handlePriceChange }: PriceFieldProps) => {
  return (
    <FieldGroup>
      <p className="text-base font-medium">Prices</p>
      <div className="flex gap-5 max-[400px]:flex-wrap">
        <Field>
          <FieldLabel htmlFor="price-1-day">Price for 1 day</FieldLabel>
          <Input
            id="price-1-day"
            placeholder="$"
            required
            value={prices?.price_day ?? ""}
            name="price_day"
            onChange={handlePriceChange}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="price-1-week">Price for 1 week</FieldLabel>
          <Input
            id="price-1-week"
            placeholder="$"
            name="price_week"
            value={prices?.price_week ?? ""}
            onChange={handlePriceChange}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="price-1-month">Price for 1 month</FieldLabel>
          <Input
            id="price-1-month"
            placeholder="$"
            name="price_month"
            value={prices?.price_month ?? ""}
            onChange={handlePriceChange}
          />
        </Field>
      </div>
    </FieldGroup>
  );
};

export default PriceField;
