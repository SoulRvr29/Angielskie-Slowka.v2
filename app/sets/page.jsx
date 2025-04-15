import bazaSlowek from "@/baza-slowek.json";
import Link from "next/link";

const Sets = () => {
  return (
    <div>
      <h2 className="mb-4">Strona zestawów słówek</h2>
      <div className="flex justify-center gap-4">
        {bazaSlowek.map((zestaw) => (
          <Link
            href={`/sets/${zestaw.nazwa}`}
            key={zestaw.nazwa}
            className="bg-primary/80 p-2 px-4 rounded-md w-fit text-center cursor-pointer hover:bg-primary transition-colors"
          >
            <h3 className="font-semibold text-xl">{zestaw.nazwa}</h3>
            <p>{zestaw.slowka.length} słówek</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Sets;
