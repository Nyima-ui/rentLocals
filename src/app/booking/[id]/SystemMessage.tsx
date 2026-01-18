import { formatSystemDate } from "@/lib/utils";

export type SystemAction =
  | "requested"
  | "booked"
  | "in_use"
  | "returned"
  | "cancelled"
  | "declined"
  | null;

function SystemMessageContent({
  action,
  isOwner,
}: {
  action: SystemAction;
  isOwner: boolean;
}) {
  if (action === "requested")
    return (
      <p>{isOwner ? "New rental request received." : "Rental request sent."}</p>
    );
  if (action === "booked")
    return (
      <p>
        {isOwner
          ? "You accepted the rental request."
          : "Your rental request was accepted."}
      </p>
    );
  if (action === "in_use")
    return (
      <p>
        {isOwner ? "The item has been picked up." : "You picked up the item."}
      </p>
    );
  if (action === "returned")
    return (
      <p>
        {isOwner ? "The item has been returned." : "You returned the item."}
      </p>
    );
  if (action === "cancelled")
    return (
      <p>
        {isOwner
          ? "The rental request was cancelled."
          : "You cancelled the rental request."}
      </p>
    );
  if (action === "declined")
    return (
      <p>
        {isOwner
          ? "You declined the rental request."
          : "The owner declined your rental request."}
      </p>
    );
}

export function SystemMessage({
  date,
  action,
  isOwner,
}: {
  date: string;
  action: SystemAction;
  isOwner: boolean;
}) {
  return (
    <div className="bg-card rounded-r-md max-w-70 ml-3 my-5 px-2 py-1.5 border-l-2 border-primary text-sm">
      <p>{formatSystemDate(date)}</p>
      <SystemMessageContent action={action} isOwner={isOwner} />
    </div>
  );
}

export default SystemMessage;
