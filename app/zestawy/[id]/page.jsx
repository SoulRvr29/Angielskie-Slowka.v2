"use client";
import { usePathname, useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect, useState } from "react";

const Set = () => {
  const [wordsSet, setWordsSet] = useState(null);

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
  const router = useRouter();

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/zestawy`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        const set = data.find(
          (item) => normalizeString(item.name) === actualPath
        );
        setWordsSet(set);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWords();
  }, [actualPath]);

  if (!wordsSet) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-base-300/30">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <button
        onClick={() => router.back()}
        className="my-2 gap-2 items-center btn btn-sm"
      >
        <FaArrowLeft />
        wróć do zestawów
      </button>
      <div className="flex flex-col border w-fit overflow-hidden min-w-lg max-sm:min-w-auto max-sm:w-full rounded-md border-primary/50 bg-primary/10">
        <div className="bg-primary/50 w-full font-semibold text-lg px-2 flex flex-wrap gap-2 justify-between">
          <div>{wordsSet.name}</div>
          <div>{wordsSet.words.length} słówek</div>
        </div>
        <div className="px-4 py-2">
          {wordsSet.words.map((item) => (
            <div key={item.english}>
              <span>{item.english}</span> - <span>{item.polish}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Set;
