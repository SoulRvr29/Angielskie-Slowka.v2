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
  const [actualCategory, setActualCategory] = useState(null);

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
      <div className="flex flex-col gap-4 ">
        <div className="flex justify-between border-b mb-4 ">
          <h2 className="">Moje zestawy</h2>
          <button className="btn btn-outline btn-info btn-sm">
            <Link href="/zestawy"> Publiczne zestawy</Link>
          </button>
        </div>
        <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
          {categories.map((category) => (
            <Category
              key={category}
              category={category}
              wordSets={wordSets}
              actualCategory={actualCategory}
              setActualCategory={setActualCategory}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default MojeZestawyPage;
