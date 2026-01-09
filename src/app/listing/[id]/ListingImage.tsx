import Image from "next/image";

export function ListingImage({ listing }: ListingSectionProps) {
  const [imageDisplayed, setImageDisplayed] = useState<string>(
    listing?.images[0]
  );
  const { images } = listing;
  return (
    <div className="w-[60%] max-md:w-full">
      <div className="bg-gray-400 h-100 w-full relative">
        <Image
          fill
          loading="eager"
          sizes="(max-width: 768px) 100vw, 60vw"
          alt={listing?.title}
          src={imageDisplayed}
          className="object-cover"
        />
      </div>
      <ul className="flex mt-2 gap-2 justify-end">
        {images.map((img, idx) => (
          <li key={idx} className="size-12.5 relative">
            <Image
              fill
              src={img}
              loading="eager"
              alt="thumbnail"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
              onClick={() => setImageDisplayed(img)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ListingImage



