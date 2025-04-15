import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between ">
      <h2 className="mt-2 mb-4">
        Witaj na stronie do nauki angielskich słówek
      </h2>
      <Link href="/sets" className="btn btn-xl btn-primary">
        Wybierz zestaw
      </Link>
    </main>
  );
}
