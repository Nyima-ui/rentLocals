import { SearchBox } from "../page";
import { CreateListingForm } from "./CreateListingForm";

const CreateListing = () => {
  return (
    <div className="max-w-6xl mx-auto max-xl:px-5">
      <SearchBox />
      <CreateListingForm />
    </div>
  );
};

export default CreateListing;
