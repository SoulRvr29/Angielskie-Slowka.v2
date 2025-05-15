const ProgressBar = ({ progress }) => {
  return (
    <div className="relative bg-base-300 w-full text-center px-2 max-sm:py-1">
      <p className="z-[1] relative">Postęp {Math.trunc(progress)}%</p>
      <div
        style={{ width: `${progress}%` }}
        className="absolute transition-all top-0 left-0 h-full bg-secondary "
      ></div>
    </div>
  );
};
export default ProgressBar;
