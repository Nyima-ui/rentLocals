import { useState } from "react";

export function useListingImages(max = 6) {
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>(
    Array(max).fill(null)
  );
  const [listingImages, setListingImages] = useState<(File | null)[]>(
    Array(max).fill(null)
  );

  function removeImage(idx: number) {
    setImagePreviews((prev) => {
      const updated = [...prev];
      if (updated[idx]) {
        URL.revokeObjectURL(updated[idx]);
      }
      updated[idx] = null;
      return updated;
    });
    setListingImages((prev) => {
      const updated = [...prev];
      updated[idx] = null;
      return updated;
    });
  }
  return {
    imagePreviews,
    listingImages,
    setImagePreviews,
    setListingImages,
    removeImage,
  };
}

export function toNullableNumber(value: FormDataEntryValue | null) {
  if (value === null || value === "") return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
}
