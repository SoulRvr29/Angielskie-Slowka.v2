import Link from "next/link";

const SubNav = ({ title, text, link }) => {
  return (
    <div className="flex justify-between border-b border-info text-info mb-4 max-sm:px-2">
      <h2 className="">{title}</h2>
      <button className="btn btn-outline btn-sm">
        <Link href={link}>{text}</Link>
      </button>
    </div>
  );
};
export default SubNav;
