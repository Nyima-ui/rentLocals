import { SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const Searchbar = () => {
  return (
    <div className="max-w-lg mx-auto px-5">
      <InputGroup>
        <InputGroupInput placeholder="Search listing..." />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

export default Searchbar;
