"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useListingImages } from "./hook";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toNullableNumber } from "./hook";
import { insertListingPrices } from "./action";
import { uploadListingImages } from "./action";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import ImageUploadGrid from "./ImageUploadGrid";
import PriceFields from "./PriceFields";

export function CreateListingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const { user } = useAuth();
  const router = useRouter();
  const {
    imagePreviews,
    listingImages,
    setImagePreviews,
    setListingImages,
    removeImage,
  } = useListingImages(6);

  function handleChangeinListingImage(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
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
    try {
      setIsLoading(true);
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const category = [formData.get("listing-category") as string];
      const pickup_location = formData.get("pickup-location") as string;
      const user_id = user?.id;

      const priceDay = toNullableNumber(formData.get("price-day"));
      const priceWeek = toNullableNumber(formData.get("price-week"));
      const priceMonth = toNullableNumber(formData.get("price-month"));

      if (priceDay === null) {
        console.error("Price per day is required");
        return;
      }

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

      await insertListingPrices(supabase, data.listing_id, {
        priceDay,
        priceMonth,
        priceWeek,
      });

      const imageUrls = await uploadListingImages(
        supabase,
        user.id,
        data.listing_id,
        listingImages
      );

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
    } catch (err) {
      const error = err as Error;
      console.error(`Error creating a new listing: ${error.message}`);
    } finally {
      setIsLoading(false);
      setImagePreviews(Array(6).fill(null));
      setListingImages(Array(6).fill(null));
      form.reset();
    }
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
            <ImageUploadGrid
              imagePreviews={imagePreviews}
              onChange={handleChangeinListingImage}
              onRemove={removeImage}
            />
          </Field>
          <PriceFields />
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
          </Field>
          <Field>
            <Button
              type="submit"
              className="max-w-xs cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Posting..." : "Post listing"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
