"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import bazaSlowek from "@/baza-slowek.json";
import { FaArrowLeft } from "react-icons/fa";

const Set = () => {
  const pathname = usePathname();
  const name = pathname.split("/")[2];
  const zestaw = bazaSlowek.find((zestaw) => zestaw.nazwa === name);
  console.log(zestaw);
  return (
    <div>
      <Link href="/sets" className="my-2 gap-2 items-center btn btn-sm">
        <FaArrowLeft />
        wróć do zestawów
      </Link>
      <div className="bg-primary p-2 px-4 rounded-md w-fit">
        {zestaw.slowka.map((item) => (
          <div key={item.id}>
            <span>{item.word}</span> - <span>{item.translation}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Set;
