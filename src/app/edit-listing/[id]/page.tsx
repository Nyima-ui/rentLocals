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
import { SelectContent } from "@radix-ui/react-select";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { X as CloseIcon } from "lucide-react";

interface Listing {
  category: string[];
  created_at: string;
  description: string;
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  listing_id: string;
  pickup_location: string;
  title: string;
  updated_at: string;
  user_id: string;
}

interface ImageSlot {
  type: "existing" | "new" | "empty";
  url?: string;
  file?: File;
}

const EditListing = () => {
  const [listingData, setListingData] = useState<Listing | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(
    Array(6).fill({ type: "empty" })
  );
  const imageSlotsRef = useRef<ImageSlot[]>(imageSlots);

  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function fetchListingData() {
      if (id) {
        const { data, error } = await supabase
          .from("listings")
          .select()
          .eq("listing_id", id)
          .single();

        if (error) {
          console.log(
            `Error fetching listing data for editing: ${error.message}`
          );
          alert("Error fetching listing data in edit page.");
          return;
        }

        if (data) {
          setListingData(data);

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
        }
      }
    }
    fetchListingData();
  }, [id, supabase]);

  useEffect(() => {
    imageSlotsRef.current = imageSlots;
  }, [imageSlots]);

  useEffect(() => {
    return () => {
      imageSlotsRef.current.forEach((slot) => {
        if (slot.type === "new" && slot.url) {
          URL.revokeObjectURL(slot.url);
        }
      });
    };
  }, []);

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

  async function uploadNewImages() {
    const uploadedUrls: { [key: number]: string } = {};
    const newImages = imageSlots
      .map((slot, idx) => ({ slot, idx }))
      .filter(({ slot }) => slot.type === "new" && slot.file);
    for (const { slot, idx } of newImages) {
      if (!slot.file) continue;

      const fileExt = slot.file.name.split(".").pop();
      const fileName = `${idx}-${Date.now()}.${fileExt}`;
      const filePath = `${user?.id}/${listingData?.listing_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(filePath, slot.file);

      if (uploadError) {
        console.error(
          `Error uploading image while editing: ${uploadError.message}`
        );
        alert("Error uploading image");
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("listing-images").getPublicUrl(filePath);

      uploadedUrls[idx] = publicUrl;
    }

    const finalImages = imageSlots
      .map((slot, idx) => {
        if (uploadedUrls[idx]) return uploadedUrls[idx];
        if (slot.type === "existing" && slot.url) return slot.url;
        return null;
      })
      .filter(Boolean) as string[];

    return finalImages;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!listingData) return;

    try {
      const oldImageUrls = await fetchPresentImageUrls(listingData.listing_id);
      const finalImageUrls = await uploadNewImages();

      await removeOldImageUrls(oldImageUrls, finalImageUrls);

      const { error: updateError } = await supabase
        .from("listings")
        .update({
          title: listingData.title,
          description: listingData.description,
          category: listingData.category,
          pickup_location: listingData.pickup_location,
          images: finalImageUrls,
          updated_at: new Date().toISOString(),
        })
        .eq("listing_id", id);

      if (updateError) {
        console.error(`Error updating listing: ${updateError.message}`);
        return;
      }

      formRef.current?.reset();
      router.push(`/listings/${user?.id}`);
      setListingData(null);
      setImageSlots(Array(6).fill({ type: "empty" }));
    } catch (error) {
      console.error(`Error updating listing:`, error);
    }
  }

  async function fetchPresentImageUrls(listingId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("listings")
      .select("images")
      .eq("listing_id", listingId)
      .single();

    if (error) {
      console.error(`Error fetching present image urls: ${error.message}`);
    }
    return data?.images ?? [];
  }

  function getStoragePathFromPublicUrl(publicUrl: string) {
    const marker = "/listing-images/";
    const index = publicUrl.indexOf(marker);
    if (index === -1) return null;
    return publicUrl.slice(index + marker.length);
  }

  async function removeOldImageUrls(oldUrls: string[], finalUrls: string[]) {
    const unusedUrls = oldUrls.filter((url) => !finalUrls.includes(url));

    if (unusedUrls.length === 0) return;

    const pathsToDelete = unusedUrls
      .map(getStoragePathFromPublicUrl)
      .filter(Boolean) as string[];

    if (pathsToDelete.length === 0) return;

    const { error } = await supabase.storage
      .from("listing-images")
      .remove(pathsToDelete);

    if (error) {
      console.error(`Error deleting unused images: ${error.message}`);
      return;
    }
  }

  if (!listingData)
    return (
      <p className="max-w-6xl mx-auto max-xl:px-5 text-2xl mt-10">Loading...</p>
    );

  return (
    <div className="max-w-6xl mx-auto max-xl:px-5">
      <div className="my-14">
        <h1 className="text-3xl mt-5">{listingData?.title}</h1>
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
                value={listingData?.category[0] ?? ""}
                onValueChange={(value) =>
                  setListingData((prev) =>
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
                  <SelectItem value="Car accessories">
                    Car accessories
                  </SelectItem>
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
                value={listingData?.title}
                onChange={(e) =>
                  setListingData({ ...listingData, title: e.target.value })
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
                value={listingData?.description}
                onChange={(e) =>
                  setListingData({
                    ...listingData,
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
              <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-2">
                {imageSlots.map((slot, idx) => {
                  const inputId = `listing-image-${idx}`;
                  const hasImage = slot.type !== "empty";

                  return (
                    <div key={idx} className="shadow-sm">
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id={inputId}
                        onChange={(e) => handleImageChange(e, idx)}
                      />
                      <label
                        htmlFor={inputId}
                        className="h-40 bg-gray-400 rounded-md flex items-center justify-center cursor-pointer bg-cover bg-no-repeat bg-center"
                        style={{
                          backgroundImage: slot.url
                            ? `url("${slot.url}")`
                            : "none",
                        }}
                      >
                        {!hasImage && (
                          <ImageIcon size={50} className="text-white/70" />
                        )}
                      </label>
                    </div>
                  );
                })}
              </div>
            </Field>
            {/* listing prices  */}
            <FieldGroup>
              <p className="text-base font-medium">Prices</p>
              <div className="flex gap-5 max-[400px]:flex-wrap">
                <Field>
                  <FieldLabel htmlFor="price-1-day">Price for 1 day</FieldLabel>
                  <Input id="price-1-day" placeholder="$" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="price-1-week">
                    Price for 1 week
                  </FieldLabel>
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
            {/* pickup location  */}
            <Field>
              <FieldLabel htmlFor="location" className="text-base">
                Pickup location
              </FieldLabel>
              <Input
                id="location"
                placeholder="12 xyz ave.."
                required
                value={listingData?.pickup_location}
                onChange={(e) =>
                  setListingData({
                    ...listingData,
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
              <Button type="submit" className="max-w-xs cursor-pointer">
                Update listing
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
};

export default EditListing;
