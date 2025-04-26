import "@/assets/styles/spinner.css";

const Loading = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-base-300/30">
      <span className="loader"></span>
    </div>
  );
};
export default Loading;
