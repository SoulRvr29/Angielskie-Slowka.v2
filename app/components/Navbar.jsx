import Link from "next/link";
import { FaHome, FaInfoCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="bg-orange-800 flex justify-between w-full max-md:flex-col">
      <h1 className="absolute top-1 max-md:top-0 max-md:pb-2 max-md:relative text-center left-1/2 transform -translate-x-1/2 text-2xl font-bold mt-1 max-md:underline">
        Angielskie Słówka<span className="text-sm text-orange-200">.v2</span>
      </h1>
      <div className="flex justify-between items-center w-full p-3 max-md:p-2">
        <div className="flex gap-4 items-center font-semibold ">
          <Link href="/" className="flex items-center gap-2">
            <FaHome />
          </Link>
          <Link href="/sets">zestawy</Link>
          <Link href="/sitesettings">ustawienia</Link>
        </div>
        <div>
          <Link href="/about">
            <FaInfoCircle />
          </Link>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
