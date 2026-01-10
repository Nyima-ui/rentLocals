function SystemMessage({ date }: { date: string }) {
  return (
    <div className="bg-cyan-100 max-w-60 ml-3 my-5 px-2 py-1.5 border-l-2 border-cyan-300 text-sm">
      <p>{date}</p>
      <p>You request has been sent.</p>
    </div>
  );
}

export default SystemMessage;
