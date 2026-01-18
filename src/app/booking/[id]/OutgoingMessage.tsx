import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { IncomingChats } from "./types";

function OutgoingMessage({
  message,
  avatar,
}: {
  message: IncomingChats;
  avatar: string;
}) {
  return (
    <div className="flex gap-3 mt-5 justify-end">
      <div className="text-sm bg-accent text-white max-w-70 rounded-b-lg px-2 py-1 rounded-tl-lg mt-7">
        {message.message}
      </div>
      <div>
        <Avatar>
          <AvatarImage src={avatar} className="size-12 rounded-[100px]" />
        </Avatar>
      </div>
    </div>
  );
}

export default OutgoingMessage;
