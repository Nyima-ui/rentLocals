import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const PriceFields = () => {
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
            name="price-day"
            type="number"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="price-1-week">Price for 1 week</FieldLabel>
          <Input
            id="price-1-week"
            placeholder="$"
            name="price-week"
            type="number"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="price-1-month">Price for 1 month</FieldLabel>
          <Input
            id="price-1-month"
            placeholder="$"
            name="price-month"
            type="number"
          />
        </Field>
      </div>
    </FieldGroup>
  );
};

export default PriceFields;
