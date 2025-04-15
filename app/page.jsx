import Link from "next/link";

const HomePage = () => {
  return (
    <main className="flex flex-col items-center justify-between ">
      <h2>Witaj na stronie do nauki angielskich słówek</h2>
      <Link href="/zestawy" className="btn btn-xl btn-primary my-4">
        Rozpocznij
      </Link>
    </main>
  );
};

export default HomePage;
