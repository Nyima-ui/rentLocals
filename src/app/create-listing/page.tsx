"use client";
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
import { SearchBox } from "@/app/page";
import { SelectContent } from "@radix-ui/react-select";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ListingPrices {
  price_day: number;
  price_week: number;
  price_month: number;
}

export function CreateListingForm() {
  const supabase = createClient();
  const { user } = useAuth();
  const router = useRouter();

  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>(
    Array(6).fill(null)
  );
  const [listingImages, setListingImages] = useState<(File | null)[]>(
    Array(6).fill(null)
  );

  async function uploadListingImages(listingId: string) {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < listingImages.length; i++) {
      const imageFile = listingImages[i];
      if (!imageFile) continue;

      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${i}-${Date.now()}.${fileExt}`;

      const filePath = `${user?.id}/${listingId}/${fileName}`;

      const { error } = await supabase.storage
        .from("listing-images")
        .upload(filePath, imageFile, { cacheControl: "3600", upsert: false });

      if (error) {
        console.error(`Failed to upload a listing image: ${error.message}`);
        return;
      }

      const { data } = supabase.storage
        .from("listing-images")
        .getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);
    }
    return uploadedUrls;
  }

  function handleChangeinListingImage(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid imaeg file.");
      return;
    }
    const previewUrl = URL.createObjectURL(file);

    setImagePreviews((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        URL.revokeObjectURL(updated[index]);
      }
      updated[index] = previewUrl;
      return updated;
    });

    setListingImages((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!user) throw new Error("User not authenticated");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = [formData.get("listing-category") as string];
    const pickup_location = formData.get("pickup-location") as string;
    const user_id = user?.id;

    const { data, error: insertError } = await supabase
      .from("listings")
      .insert({ user_id, title, description, category, pickup_location })
      .select()
      .single();

    if (insertError) {
      console.error(
        `Error inserting listing data to listings table: ${insertError.message}`
      );
      return;
    }

    const imageUrls = await uploadListingImages(data.listing_id);

    const { error: updateError } = await supabase
      .from("listings")
      .update({ images: imageUrls })
      .eq("listing_id", data.listing_id);

    if (updateError) {
      console.error(`Error updating listing row: ${updateError.message}`);
      return;
    }

    imagePreviews.forEach((preview) => {
      if (preview) URL.revokeObjectURL(preview);
    });

    router.push(`listings/${user?.id}`);

    setImagePreviews(Array(6).fill(null));
    setListingImages(Array(6).fill(null));

    form.reset();
  }

  return (
    <div className="my-14">
      <h1 className="text-3xl mt-5">Post your listing</h1>
      <form
        className="w-full max-w-xl py-5 rounded-md mt-5 px-5 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
        onSubmit={handleSubmit}
      >
        <FieldGroup className="mt-5">
          <Field>
            <FieldLabel className="text-base" htmlFor="select-category">
              Choose category
            </FieldLabel>
            <Select required name="listing-category">
              <SelectTrigger defaultValue="" id="select-category">
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
          <Field>
            <FieldLabel htmlFor="title" className="text-base">
              Title
            </FieldLabel>
            <Input
              id="title"
              placeholder="Listing name"
              name="title"
              required
            />
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
              name="description"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="pictures" className="text-base">
              Pictures
            </FieldLabel>
            <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, idx) => {
                const inputId = `listing-image-${idx}`;
                return (
                  <div key={idx} className="shadow-sm">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={inputId}
                      onChange={(e) => handleChangeinListingImage(e, idx)}
                    />
                    <label
                      htmlFor={inputId}
                      className="h-40 bg-gray-400 rounded-md flex items-center justify-center cursor-pointer bg-cover bg-no-repeat bg-center"
                      style={{
                        backgroundImage: imagePreviews[idx]
                          ? `url("${imagePreviews[idx]}")`
                          : "none",
                      }}
                    >
                      {!imagePreviews[idx] && (
                        <ImageIcon size={50} className="text-white/70" />
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </Field>
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
                <FieldLabel htmlFor="price-1-month">
                  Price for 1 month
                </FieldLabel>
                <Input
                  id="price-1-month"
                  placeholder="$"
                  name="price-month"
                  type="number"
                />
              </Field>
            </div>
          </FieldGroup>
          <Field>
            <FieldLabel htmlFor="location" className="text-base">
              Pickup location
            </FieldLabel>
            <Input
              id="location"
              placeholder="12 xyz ave.."
              required
              name="pickup-location"
            />
            {/* <Button
              variant="outline"
              type="button"
              className="max-w-xs bg-transparent border"
              onClick={addLocation}
            >
              Use my location
            </Button> */}
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
