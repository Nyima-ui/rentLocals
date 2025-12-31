import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SearchBox } from "../page";
import { SelectContent } from "@radix-ui/react-select";

export function CreateListingForm() {
  return (
    <div className="my-14">
      <h1 className="text-3xl mt-5">Post your listing</h1>
      <form className="w-full max-w-xl py-5 rounded-md mt-5 px-5 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
        <FieldGroup className="mt-5">
          <Field className="">
            <FieldLabel className="text-base" htmlFor="select-category">
              Choose category
            </FieldLabel>
            <Select required>
              <SelectTrigger defaultValue="" id="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white rounded-sm max-w-lg max-md:max-w-md">
                <SelectItem value="Party items"> Party items</SelectItem>
                <SelectItem value="Electronics"> Electronics</SelectItem>
                <SelectItem value="Car accessories">Car accessories</SelectItem>
                <SelectItem value="Sports equipments">
                  Sports equipments
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="title" className="text-base">
              Title
            </FieldLabel>
            <Input id="title" placeholder="Listing name" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="description" className="text-base">
              Description
            </FieldLabel>
            <Textarea
              id="description"
              className="h-38 resize-none"
              placeholder="Describe your listing.."
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="pictures" className="text-base">
              Pictures
            </FieldLabel>
            <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-2">
              <Input type="file" accept="image/*" required />
              <Input type="file" accept="image/*" />
              <Input type="file" accept="image/*" />
              <Input type="file" accept="image/*" />
              <Input type="file" accept="image/*" />
              <Input type="file" accept="image/*" />
            </div>
          </Field>
          <FieldGroup>
            <p className="text-base font-medium">Prices</p>
            <div className="flex gap-5 max-[400px]:flex-wrap">
              <Field>
                <FieldLabel htmlFor="price-1-day">Price for 1 day</FieldLabel>
                <Input id="price-1-day" placeholder="$" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="price-1-week">Price for 1 week</FieldLabel>
                <Input id="price-1-week" placeholder="$" />
              </Field>
              <Field>
                <FieldLabel htmlFor="price-1-month">
                  Price for 1 month
                </FieldLabel>
                <Input id="price-1-month" placeholder="$" />
              </Field>
            </div>
          </FieldGroup>
          <Field>
            <FieldLabel htmlFor="location" className="text-base">
              Pickup location
            </FieldLabel>
            <Input id="location" placeholder="12 xyz ave.." required />
            <Button variant="outline" className="max-w-xs">
              Use my location
            </Button>
          </Field>
          <Field>
            <Button type="submit" className="max-w-xs cursor-pointer">
              Post listing
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}

const CreateListing = () => {
  return (
    <div className="max-w-6xl mx-auto max-xl:px-5">
      <SearchBox />
      <CreateListingForm />
    </div>
  );
};

export default CreateListing;
