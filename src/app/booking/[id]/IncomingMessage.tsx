import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { IncomingChats } from "./types";

function IncomingMessage({
  message,
  avatar,
}: {
  message: IncomingChats;
  avatar: string;
}) {
  return (
    <div className="flex gap-3 mt-3">
      <div>
        <Avatar>
          <AvatarImage src={avatar} className="size-12 rounded-[100px]" />
        </Avatar>
      </div>
      <div className="text-sm bg-accent text-white max-w-70 rounded-b-lg px-2 py-1 rounded-tr-lg mt-7">
        {message.message}
      </div>
    </div>
  );
}

export default IncomingMessage;
