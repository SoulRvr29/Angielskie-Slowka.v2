const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="loader-container absolute top-0 left-0 w-full h-full flex items-center justify-center bg-base-300/0 flex-col gap-4 z-10 pointer-events-none">
      <div className="flex flex-col gap-2 items-center p-5 shadow-lg">
        <p className="text-info animate-pulse font-semibold">{message}</p>
        <span className="loader"></span>
      </div>
    </div>
  );
};
export default Loader;
