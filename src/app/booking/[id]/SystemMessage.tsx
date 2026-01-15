import { IncomingBooking } from "./types";

interface SystemMessageProps {
  date: string;
  isOwner: boolean;
  status:
    | "requested"
    | "booked"
    | "in_use"
    | "returned"
    | "cancelled"
    | "declined";
}



export function SystemRequestMessage({
  date,
  isOwner,
}: {
  date: string;
  isOwner: boolean;
}) {
  return (
    <div className="bg-cyan-100 max-w-70 ml-3 my-5 px-2 py-1.5 border-l-2 border-cyan-300 text-sm">
      <p>{date}</p>
      <p>{isOwner ? "New rental request received." : "Rental request sent."}</p>
    </div>
  );
}

export function SystemDeclineMessage({
  date,
  isOwner,
}: {
  date: string;
  isOwner: boolean;
}) {
  return (
    <div className="bg-cyan-100 max-w-70 ml-3 my-5 px-2 py-1.5 border-l-2 border-cyan-300 text-sm">
      <p>{date}</p>
      <p>
        {isOwner
          ? "You declined the rental request."
          : "The owner declined your rental request."}
      </p>
    </div>
  );
}

export function SystemBookedMessage({
  date,
  isOwner,
}: {
  date: string;
  isOwner: boolean;
}) {
  return (
    <div className="bg-cyan-100 max-w-70 ml-3 my-5 px-2 py-1.5 border-l-2 border-cyan-300 text-sm">
      <p>{date}</p>
      <p>
        {isOwner
          ? "You accepted the rental request."
          : "Your rental request was accepted."}
      </p>
    </div>
  );
}

export function SystemInUseMessage({
  date,
  isOwner,
}: {
  date: string;
  isOwner: boolean;
}) {
  return (
    <div className="bg-cyan-100 max-w-70 ml-3 my-5 px-2 py-1.5 border-l-2 border-cyan-300 text-sm">
      <p>{date}</p>
      <p>
        {isOwner ? "The item has been picked up." : "You picked up the item."}
      </p>
    </div>
  );
}

export function SystemReturnedMessage({
  date,
  isOwner,
}: {
  date: string;
  isOwner: boolean;
}) {
  return (
    <div className="bg-cyan-100 max-w-70 ml-3 my-5 px-2 py-1.5 border-l-2 border-cyan-300 text-sm">
      <p>{date}</p>
      <p>
        {isOwner ? "The item has been returned." : "You returned the item."}
      </p>
    </div>
  );
}

export function SystemCancelledMessage({
  date,
  isOwner,
}: {
  date: string;
  isOwner: boolean;
}) {
  return (
    <div className="bg-cyan-100 max-w-70 ml-3 my-5 px-2 py-1.5 border-l-2 border-cyan-300 text-sm">
      <p>{date}</p>
      <p>
        {isOwner
          ? "The rental request was cancelled."
          : "You cancelled the rental request."}
      </p>
    </div>
  );
}

export function SystemMessageWrapper({ date, isOwner }: SystemMessageProps) {
  return (
    <div className="bg-cyan-100 max-w-70 ml-3 my-5 px-2 py-1.5 border-l-2 border-cyan-300 text-sm">
      <p>{date}</p>

      <p>{isOwner ? "New rental request received." : "Rental request sent."}</p>
    </div>
  );
}

export default SystemMessageWrapper;
