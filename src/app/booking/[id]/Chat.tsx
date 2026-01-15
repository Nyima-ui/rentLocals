import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import SystemMessage from "./SystemMessage";

import IncomingMessage from "./IncomingMessage";
import OutgoingMessage from "./OutgoingMessage";
import { IncomingBooking } from "./types";
import { useAuth } from "@/context/AuthContext";
import { getMessages, sendMessage } from "./hooks";
import { useEffect, useRef, useState } from "react";
import { IncomingChats } from "./types";
import { createClient } from "@/lib/supabase/client";

export function Chat({ booking }: { booking: IncomingBooking }) {
  const [messages, setMessages] = useState<IncomingChats[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const isOwner = user?.id === booking.owner_id;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleanMessage = message.trim();
    if (!user || !message.trim()) return;
    try {
      setIsLoading(true);
      await sendMessage({
        sender_id: user.id,
        receiver_id: isOwner ? booking.renter_id : booking.owner_id,
        listing_id: booking.listing_id,
        booking_id: booking.booking_id,
        message: cleanMessage,
      });
      setMessage("");
    } catch (err) {
      const error = err as Error;
      console.error(`Error sending a message: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function loadMessages() {
      try {
        const data = await getMessages(booking.booking_id);
        setMessages(data);
      } catch (err) {
        const error = err as Error;
        console.error(`Error fetching previous messages: ${error.message}`);
      }
    }
    loadMessages();
  }, [booking.booking_id]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chats",
          filter: `booking_id=eq.${booking.booking_id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as IncomingChats]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [booking.booking_id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="grow px-3 h-135 relative border rounded-md pt-3">
      <div className="h-120 overflow-y-scroll no-scrollbar pb-10">
        {messages.map((item) => {
          if (item.type === "system") {
            return (
              <SystemMessage
                key={item.message_id}
                date={item.created_at}
                action={item.system_action}
                isOwner={isOwner}
              />
            );
          }
          return item.sender_id === user?.id ? (
            <OutgoingMessage
              key={item.message_id}
              message={item}
              avatar={isOwner ? booking.owner.avatar : booking.renter.avatar}
            />
          ) : (
            <IncomingMessage
              key={item.message_id}
              message={item}
              avatar={isOwner ? booking.renter.avatar : booking.owner.avatar}
            />
          );
        })}
        <div ref={bottomRef}></div>
      </div>

      <form
        className="flex items-center justify-between absolute w-[95%] bottom-0.5"
        onSubmit={handleSubmit}
      >
        <Field className="flex-row">
          <Input
            type="text"
            placeholder={`Message to ${
              isOwner ? booking.renter.first_name : booking.owner.first_name
            }`}
            className="grow px-3 py-2 rounded-4xl border text-wrap"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
            name="outgoing-message"
          />
          <Button type="submit" className="max-w-10 cursor-pointer">
            <Send />
          </Button>
        </Field>
      </form>
    </div>
  );
}

export default Chat;
