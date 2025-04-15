import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-8 items-center mt-[20vh] flex-grow">
      <h2>Witaj na stronie do nauki angielskich słówek</h2>
      <Link href="/zestawy" className="btn btn-xl btn-info">
        Rozpocznij
      </Link>
    </div>
  );
};

export default HomePage;
