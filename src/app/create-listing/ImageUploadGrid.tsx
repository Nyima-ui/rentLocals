"use client";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, X as CloseIcon } from "lucide-react";

interface Props {
  imagePreviews: (string | null)[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>, idx: number) => void;
  onRemove: (idx: number) => void;
}

const ImageUploadGrid = ({ imagePreviews, onChange, onRemove }: Props) => {
  return (
    <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, idx) => {
        const inputId = `listing-image-${idx}`;
        const hasPreviewImage = imagePreviews[idx];

        return (
          <div key={idx} className="shadow-sm relative">
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              id={inputId}
              onChange={(e) => onChange(e, idx)}
            />
            <label
              htmlFor={inputId}
              className="h-40 bg-gray-400 rounded-md flex items-center justify-center cursor-pointer bg-cover bg-no-repeat bg-center relative"
              style={{
                backgroundImage: hasPreviewImage
                  ? `url("${imagePreviews[idx]}")`
                  : "none",
              }}
            >
              {!hasPreviewImage && (
                <ImageIcon size={50} className="text-white/70" />
              )}
            </label>
            {hasPreviewImage && (
              <button
                className="absolute top-1.5 right-2 cursor-pointer hover:bg-gray-200/50 transition-all duration-100 ease-in rounded-md"
                onClick={() => onRemove(idx)}
              >
                <CloseIcon className="text-red-500" size={27} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ImageUploadGrid;
