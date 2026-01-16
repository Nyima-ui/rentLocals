import { Input } from "@/components/ui/input";
import { Image as ImageIcon, X as CloseIcon } from "lucide-react";
import { ImageSlot } from "./types";

interface EditImageProps {
  imageSlots: ImageSlot[];
  handleImageChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  handleRemoveImage: (idx: number) => void;
}

const EditImage = ({
  imageSlots,
  handleImageChange,
  handleRemoveImage,
}: EditImageProps) => {
  return (
    <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-2">
      {imageSlots.map((slot, idx) => {
        const inputId = `listing-image-${idx}`;
        const hasImage = slot.type !== "empty";

        return (
          <div key={idx} className="shadow-sm relative">
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
                backgroundImage: slot.url ? `url("${slot.url}")` : "none",
              }}
            >
              {!hasImage && <ImageIcon size={50} className="text-white/70" />}
            </label>
            {hasImage && (
              <button
                type="button"
                className="absolute top-1.5 right-2 cursor-pointer hover:bg-gray-200/50 transition-all duration-100 ease-in rounded-md"
                onClick={() => handleRemoveImage(idx)}
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

export default EditImage;
