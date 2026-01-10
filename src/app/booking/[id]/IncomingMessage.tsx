import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

function IncomingMessage() {
  return (
    <div className="flex gap-3">
      <div>
        <Avatar>
          <AvatarImage
            src="https://github.com/shadcn.png"
            className="size-12 rounded-[100px]"
          />
        </Avatar>
      </div>
      <div className="text-sm bg-gray-600 text-white max-w-70 rounded-b-lg px-2 py-1 rounded-tr-lg mt-7">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo, quam!
      </div>
    </div>
  );
}

export default IncomingMessage;
