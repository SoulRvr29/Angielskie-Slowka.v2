import Link from "next/link";

const SubNav = ({ title, text, link }) => {
  return (
    <div className="flex justify-between border-b border-info text-info mb-4 max-sm:px-2 pb-2">
      <p className="text-xl max-sm:text-base">{title}</p>
      <button className="btn btn-outline btn-sm max-sm:btn-xs">
        <Link href={link}>{text}</Link>
      </button>
    </div>
  );
};
export default SubNav;
