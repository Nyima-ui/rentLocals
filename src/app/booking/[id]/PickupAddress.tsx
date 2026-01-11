const PickupAddress = ({ address }: { address: (string | null) }) => {
  return (
    <div className="max-w-xs border-b-2 pb-1.5 mt-4">
      <p className="text-base text-gray-700 leading-tight">
        {address ? address : "Pickup address will be shown after approval."}
      </p>
    </div>
  );
};

export default PickupAddress;
