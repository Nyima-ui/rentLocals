import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
  FieldDescription,
} from "@/components/ui/field";

export function ListingInfo({ listing, prices }: ListingSectionProps) {
  const supabase = createClient();
  const { user } = useAuth();
  const router = useRouter();
  const isOwnerOfTheListing = listing.user_id === user?.id;

  return (
    <div className="grow space-y-3 w-1/2 max-md:w-full">
      <h1 className="text-4xl font-medium leading-tighter">{listing?.title}</h1>
      <form onSubmit={requestBooking}>
        <FieldGroup className="flex-row">
          <Field>
            <FieldLabel htmlFor="start-date" className="text-nowrap">
              Start date:
            </FieldLabel>
            <Input
              type="date"
              id="start-date"
              name="start-date"
              required
              className="max-w-50 cursor-pointer"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="end-date" className="text-nowrap">
              End date:
            </FieldLabel>
            <Input
              type="date"
              id="end-date"
              name="end-date"
              required
              className="max-w-50 cursor-pointer"
            />
          </Field>
        </FieldGroup>
        <div className="mt-10">
          <FieldTitle className="text-2xl">{`$${prices?.price_day}`}</FieldTitle>
          <FieldDescription className="text-gray-500">
            Price for 1 day
          </FieldDescription>
        </div>
        <Button
          className="mt-5 cursor-pointer"
          type="submit"
          disabled={isOwnerOfTheListing}
        >
          Request Booking
        </Button>
      </form>
      <div className="mt-10">
        <p className="text-lg">Price for all periods</p>
        <div className="flex gap-5 mt-3">
          <div className="border grow text-center rounded-md py-1.5">
            <p className="text-xl font-medium">{`$${prices?.price_day}`}</p>
            <p className="text-gray-500">/day</p>
          </div>
          <div className="border grow text-center rounded-md py-1.5">
            <p className="text-xl font-medium">
              {prices?.price_week ? `$${prices.price_week}` : `Not set`}
            </p>
            <p className="text-gray-500">/week</p>
          </div>
          <div className="border grow text-center rounded-md py-1.5">
            <p className="text-xl font-medium">
              {prices?.price_month ? `$${prices.price_month}` : `Not set`}
            </p>
            <p className="text-gray-500">/month</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingInfo;
