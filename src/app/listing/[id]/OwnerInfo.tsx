import { Card, CardTitle, CardAction, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";



export function OwnerInfo({ listing }: ListingSectionProps) {
  const [ownerData, setOwnerData] = useState<UserData | null>(null);
  const ownerId = listing.user_id;
  const supabase = createClient();

  useEffect(() => {
    async function fetchOwner() {
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar, first_name, last_name")
        .eq("user_id", ownerId)
        .single();

      if (error) {
        console.error(`Error fetching owner data: ${error.message}`);
        return;
      }
      setOwnerData(data);
    }
    fetchOwner();
  }, [ownerId, supabase]);

  const ownerName = ownerData
    ? `${ownerData?.first_name ?? ""} ${ownerData?.last_name ?? ""}`
    : "Unknown";

  return (
    <Card className="flex flex-row items-start max-lg:flex-col mt-10 justify-between bg-transparent border-none shadow-none">
      <div className="flex items-start max-md:flex-col max-md:gap-5">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage
              src={ownerData?.avatar}
              alt="@shadcn"
              className="size-15 rounded-[100px] object-cover"
            />
          </Avatar>
          <CardContent>
            <CardTitle className="text-lg">Owned by {ownerName}</CardTitle>
            <CardAction className="mt-3">
              <Button>Message</Button>
            </CardAction>
          </CardContent>
        </div>
        <div className="">
          <p className="mb-3 font-medium">Approximate location:</p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1472086.7749927582!2d-80.61774836557551!3d43.893756423188556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b2a1d7471156d%3A0x4ecad8e272e4c2a2!2sGreater%20Toronto%20Area%2C%20ON%2C%20Canada!5e0!3m2!1sen!2sin!4v1767149734066!5m2!1sen!2sin"
            width="400"
            height="350"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <p className="max-w-md max-xl:max-w-sm">
        <span className="text-base block font-semibold">About the item:</span>
        {listing?.description}
      </p>
    </Card>
  );
}

export default OwnerInfo;
