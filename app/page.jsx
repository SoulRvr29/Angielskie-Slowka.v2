import Link from "next/link";
import LoginBtn from "./components/LoginBtn";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-8 items-center mt-[20vh] flex-grow max-sm:px-4">
      <h2>Witaj na stronie do nauki angielskich słówek</h2>
      <Link
        href={{ pathname: "/zestawy", query: { type: "public" } }}
        className="btn btn-xl btn-info"
      >
        Rozpocznij
      </Link>
      <LoginBtn />
      {/* <Link href="/profil" className="btn btn-xl">
        Mój profil
      </Link> */}
    </div>
  );
};

export default HomePage;
