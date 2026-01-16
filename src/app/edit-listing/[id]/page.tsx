"use client";
import { useParams } from "next/navigation";
import EditListingForm from "./EditListingForm";

const EditListing = () => {
  const { id } = useParams();
  if (typeof id !== "string") return;
  return (
    <div className="max-w-6xl mx-auto max-xl:px-5">
      <EditListingForm id={id} />
    </div>
  );
};

export default EditListing;
