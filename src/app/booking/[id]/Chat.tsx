import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  SystemRequestMessage,
  SystemDeclineMessage,
  SystemBookedMessage,
  SystemInUseMessage,
  SystemReturnedMessage,
  SystemCancelledMessage,
} from "./SystemMessage";
import { shouldRenderStatus } from "./SystemMessage";
import IncomingMessage from "./IncomingMessage";
import OutgoingMessage from "./OutgoingMessage";
import { IncomingBooking } from "./types";
import { formatSystemDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function Chat({ booking }: { booking: IncomingBooking }) {
  const dateForSystemMessage = formatSystemDate(booking.created_at);
  const { user } = useAuth();
  const isOwner = user?.id === booking.owner_id;
  return (
    <div className="grow px-3 h-135 relative border rounded-md pt-3">
      <div className="h-105 overflow-y-scroll no-scrollbar pb-10">
        {shouldRenderStatus(booking.status, "requested") && (
          <SystemRequestMessage date={dateForSystemMessage} isOwner={isOwner} />
        )}
        {shouldRenderStatus(booking.status, "booked") && (
          <SystemBookedMessage date={dateForSystemMessage} isOwner={isOwner} />
        )}
        {shouldRenderStatus(booking.status, "in_use") && (
          <SystemInUseMessage date={dateForSystemMessage} isOwner={isOwner} />
        )}
        {shouldRenderStatus(booking.status, "returned") && (
          <SystemReturnedMessage
            date={dateForSystemMessage}
            isOwner={isOwner}
          />
        )}
        {shouldRenderStatus(booking.status, "declined") && (
          <SystemDeclineMessage date={dateForSystemMessage} isOwner={isOwner} />
        )}
        {shouldRenderStatus(booking.status, "cancelled") && (
          <SystemCancelledMessage
            date={dateForSystemMessage}
            isOwner={isOwner}
          />
        )}
        {/* <IncomingMessage /> */}
        {/* <OutgoingMessage /> */}
      </div>
      <form className="flex items-center justify-between absolute w-[95%] bottom-0.5">
        <Field className="flex-row">
          <Input
            type="text"
            placeholder="Message to Artur S"
            className="grow px-3 py-2 rounded-4xl border text-wrap"
            name="outgoing-message"
          />
          <Button className="max-w-10 cursor-pointer" type="submit">
            <Send />
          </Button>
        </Field>
      </form>
    </div>
  );
}

export default Chat;
