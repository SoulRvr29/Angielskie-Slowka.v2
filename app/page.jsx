import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-8 items-center mt-[20vh] flex-grow max-sm:px-4">
      <h2>Witaj na stronie do nauki angielskich słówek</h2>
      <Link href="/zestawy" className="btn btn-xl btn-info">
        Rozpocznij
      </Link>
      <Link href="/konto" className="btn btn-xl">
        Logowanie
      </Link>
    </div>
  );
};

export default HomePage;
