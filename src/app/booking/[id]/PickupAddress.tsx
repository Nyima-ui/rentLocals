const PickupAddress = ({ address }: { address: (string | null) }) => {
  return (
    <div className="max-w-sm border-b-2 pb-1.5 mt-4">
      <p className="text-base leading-tight">
        {address ? address : "Pickup address will be shown after approval."}
      </p>
    </div>
  );
};

export default PickupAddress;
