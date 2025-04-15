"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import bazaSlowek from "@/baza-slowek.json";
import { FaArrowLeft } from "react-icons/fa";

const Set = () => {
  const normalizeString = (str) => {
    return str
      .split(" ")
      .join("_")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ł/g, "l")
      .replace(/Ł/g, "L");
  };

  const pathname = usePathname();
  const actualPath = pathname.split("/")[2];
  const wordsSet = bazaSlowek.find(
    (item) => normalizeString(item.name) === actualPath
  );

  return (
    <div>
      <Link href="/zestawy" className="my-2 gap-2 items-center btn btn-sm">
        <FaArrowLeft />
        wróć do zestawów
      </Link>
      <div className="flex flex-col gap-2 border w-fit px-4 py-2 rounded-md border-info/50">
        {wordsSet.words.map((item) => (
          <div key={item.english}>
            <span>{item.english}</span> - <span>{item.polish}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Set;
