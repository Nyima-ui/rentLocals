import Searchbar from "@/components/own/Searchbar";
import { CreateListingForm } from "./CreateListingForm";

const CreateListing = () => {
  return (
    <div className="max-w-6xl mx-auto max-xl:px-5">
      <Searchbar />
      <CreateListingForm />
    </div>
  );
};

export default CreateListing;
