"use client";
import Category from "../../components/Category";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const getCategories = (data) => {
  return [...new Set(data.map((item) => item.category).sort())];
};

const MojeZestawyPage = () => {
  const [wordSets, setWordSets] = useState(null);
  const [collapseAll, setCollapseAll] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/zestawy/wlasne`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        console.log(data[0].user_sets);

        setWordSets(data[0].user_sets);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWords();
  }, []);

  if (!wordSets) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-base-300/30">
        <span className="loader"></span>
      </div>
    );
  }
  const categories = getCategories(wordSets);

  return (
    <div>
      <h2>Moje zestawy</h2>
      <div className="flex flex-col gap-4 ">
        <div className="flex justify-between">
          <Link href="/zestawy" className="my-2 gap-2 items-center btn btn-sm">
            <FaArrowLeft />
            wróć do zestawów
          </Link>
          <button
            onClick={() => setCollapseAll((prev) => !prev)}
            className="btn btn-sm"
          >
            {!collapseAll ? "rozwiń kategorie" : "zwiń kategorie"}
          </button>
        </div>
        {categories.map((category) => (
          <Category
            key={category}
            category={category}
            collapseAll={collapseAll}
            wordSets={wordSets}
          />
        ))}
      </div>
    </div>
  );
};
export default MojeZestawyPage;
