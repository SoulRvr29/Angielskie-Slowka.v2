"use client";
import Category from "../components/Category";
import { useEffect, useState } from "react";
import Link from "next/link";
import AddCategory from "../components/AddCategory";
import SubNav from "../components/SubNav";

const getCategories = (data) => {
  return [...new Set(data.map((item) => item.category).sort())];
};

const WordSetsPage = () => {
  const [wordSets, setWordSets] = useState(null);
  const [actualCategory, setActualCategory] = useState(null);

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

        setWordSets(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWords();
  }, []);

  if (!wordSets) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-base-300/30 flex flex-col gap-4">
        <p className="text-info animate-pulse delayFadeIn">
          Pobieranie zestawów
        </p>
        <span className="loader"></span>
      </div>
    );
  }
  const categories = getCategories(wordSets);

  const newCategoryHandler = (name) => {
    console.log(name);
  };

  return (
    <div className="flex flex-col gap-2">
      <SubNav
        title="Publiczne zestawy"
        text="Moje zestawy"
        link="/zestawy/wlasne"
      />
      <div className="flex flex-col gap-4 max-sm:gap-2 max-w-2xl mx-auto w-full">
        {categories.map((category) => (
          <Category
            key={category}
            category={category}
            wordSets={wordSets}
            actualCategory={actualCategory}
            setActualCategory={setActualCategory}
          />
        ))}
        <AddCategory newCategoryHandler={newCategoryHandler} />
      </div>
    </div>
  );
};
export default WordSetsPage;
