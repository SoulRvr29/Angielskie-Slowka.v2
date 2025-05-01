import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const SubNav = ({ title, text, link }) => {
  return (
    <div className="flex justify-between border-b border-info/50 text-info mb-4 max-sm:px-2 pb-2">
      <p className="text-xl max-sm:text-lg">{title}</p>
      {link && (
        <Link className="max-sm:mb-0 gap-2 btn btn-sm" href={link}>
          <FaArrowLeft />
          {text}
        </Link>
      )}
    </div>
  );
};
export default SubNav;
