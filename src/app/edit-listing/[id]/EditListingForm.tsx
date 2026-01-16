import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PriceField from "./PriceField";
import { Button } from "@/components/ui/button";
import EditImage from "./EditImage";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { IncomingListing, ImageSlot } from "./types";
import {
  getListing,
  uploadNewImages,
  getOldImageUrls,
  removeOldImageUrls,
  updateListing,
  updateListingPrices,
} from "./action";

const EditListingForm = ({ id }: { id: string }) => {
  const [listing, setListing] = useState<IncomingListing | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(
    Array(6).fill({ type: "empty" })
  );
  const [isLoading, setIsLoading] = useState(false);
  const imageSlotsRef = useRef<ImageSlot[]>(imageSlots);

  const { user } = useAuth();
  const router = useRouter();

  // to load the data
  useEffect(() => {
    async function fetchlisting() {
      if (!id) return;
      try {
        const data = await getListing(id);
        setListing(data);

        const initialSlots: ImageSlot[] = Array(6)
          .fill(null)
          .map((_, idx) => {
            if (data.images[idx]) {
              return {
                type: "existing",
                url: data.images[idx],
              };
            }
            return { type: "empty" };
          });

        setImageSlots(initialSlots);
      } catch (err) {
        console.error(
          `Error fetching a listing in while editing:`,
          (err as Error).message
        );
      }
    }
    fetchlisting();
  }, [id]);
  // to update the imageSlots reference
  useEffect(() => {
    imageSlotsRef.current = imageSlots;
  }, [imageSlots]);
  // to revoke the stale image urls
  useEffect(() => {
    return () => {
      imageSlotsRef.current.forEach((slot) => {
        if (slot.type === "new" && slot.url) {
          URL.revokeObjectURL(slot.url);
        }
      });
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!listing || !user) return;

    try {
      setIsLoading(true);
      const oldImageUrls = await getOldImageUrls(listing.listing_id);
      const finalImageUrls = await uploadNewImages(
        imageSlots,
        user?.id,
        listing?.listing_id
      );
      await removeOldImageUrls(oldImageUrls, finalImageUrls);
      await updateListing(
        {
          title: listing.title,
          description: listing.description,
          category: listing.category,
          pickup_location: listing.pickup_location,
          images: finalImageUrls,
          updated_at: new Date().toISOString(),
        },
        listing.listing_id
      );
      await updateListingPrices(
        {
          listing_id: listing?.listing_id,
          price_day: listing?.prices.price_day,
          price_week: listing?.prices.price_week,
          price_month: listing?.prices.price_month,
        },
        listing.listing_id
      );

      formRef.current?.reset();
      router.push(`/listings/${user?.id}`);
      setListing(null);
      setImageSlots(Array(6).fill({ type: "empty" }));
    } catch (error) {
      console.error(`Error updating listing:`, (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }
  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    const previousSlot = imageSlots[index];
    if (previousSlot.type === "new" && previousSlot.url) {
      URL.revokeObjectURL(previousSlot.url);
    }

    const previewUrl = URL.createObjectURL(file);

    setImageSlots((prev) => {
      const updated = [...prev];
      updated[index] = {
        type: "new",
        url: previewUrl,
        file: file,
      };
      return updated;
    });
  }
  function handleRemoveImage(idx: number) {
    setImageSlots((prev) => {
      const updated = [...prev];
      if (updated[idx].type === "new" && updated[idx].url) {
        URL.revokeObjectURL(updated[idx].url);
      }
      updated[idx] = { type: "empty" };
      return updated;
    });
  }
  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setListing((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        prices: {
          ...prev.prices,
          [name]: value === "" ? null : Number(value),
        },
      };
    });
  }

  if (!listing)
    return (
      <p className="max-w-6xl mx-auto max-xl:px-5 text-2xl mt-10">Loading...</p>
    );
  return (
    <div className="my-14">
      <h1 className="text-3xl mt-5">{listing?.title}</h1>
      <form
        className="w-full max-w-xl py-5 rounded-md mt-5 px-5 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <FieldGroup className="mt-5">
          {/* category  */}
          <Field>
            <FieldLabel className="text-base" htmlFor="select-category">
              Choose category
            </FieldLabel>
            <Select
              required
              value={listing?.category[0] ?? ""}
              onValueChange={(value) =>
                setListing((prev) =>
                  prev ? { ...prev, category: [value] } : prev
                )
              }
            >
              <SelectTrigger id="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white rounded-sm max-w-lg max-md:max-w-md">
                <SelectItem value="Party items">Party items</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Car accessories">Car accessories</SelectItem>
                <SelectItem value="Sports equipments">
                  Sports equipments
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {/* title  */}
          <Field>
            <FieldLabel htmlFor="title" className="text-base">
              Title
            </FieldLabel>
            <Input
              id="title"
              placeholder="Listing name"
              required
              value={listing?.title}
              onChange={(e) =>
                setListing({ ...listing, title: e.target.value })
              }
            />
          </Field>
          {/* description  */}
          <Field>
            <FieldLabel htmlFor="description" className="text-base">
              Description
            </FieldLabel>
            <Textarea
              id="description"
              className="h-38 resize-none"
              placeholder="Describe your listing.."
              required
              value={listing?.description}
              onChange={(e) =>
                setListing({
                  ...listing,
                  description: e.target.value,
                })
              }
            />
          </Field>
          {/* listing images  */}
          <Field>
            <FieldLabel htmlFor="pictures" className="text-base">
              Pictures
            </FieldLabel>
            <EditImage
              imageSlots={imageSlots}
              handleImageChange={handleImageChange}
              handleRemoveImage={handleRemoveImage}
            />
          </Field>
          {/* listing prices  */}
          <PriceField
            prices={listing.prices}
            handlePriceChange={handlePriceChange}
          />
          {/* pickup location  */}
          <Field>
            <FieldLabel htmlFor="location" className="text-base">
              Pickup location
            </FieldLabel>
            <Input
              id="location"
              placeholder="12 xyz ave.."
              required
              value={listing?.pickup_location}
              onChange={(e) =>
                setListing({
                  ...listing,
                  pickup_location: e.target.value,
                })
              }
            />
            {/* <Button type="button" variant="outline" className="max-w-xs">
                Use my location
              </Button> */}
          </Field>
          {/* form submit button  */}
          <Field>
            <Button
              type="submit"
              className="max-w-xs cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update listing"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default EditListingForm;
