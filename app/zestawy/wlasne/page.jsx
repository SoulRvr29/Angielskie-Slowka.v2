"use client";
import Category from "../../components/Category";
import { useEffect, useState } from "react";
import SubNav from "../../components/SubNav";
import { FaArrowLeft } from "react-icons/fa";

const getCategories = (data) => {
  return [...new Set(data.map((item) => item.category).sort())];
};

const MojeZestawyPage = () => {
  const [wordSets, setWordSets] = useState(null);
  const [actualCategory, setActualCategory] = useState(null);
  const [addCategory, setAddCategory] = useState(false);

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
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-base-300/30">
        <p className="text-info animate-pulse delayFadeIn">
          Pobieranie zestawów
        </p>
        <span className="loader"></span>
      </div>
    );
  }
  const categories = getCategories(wordSets);

  return (
    <div>
      <div className="flex flex-col gap-4 ">
        <SubNav title="Moje zestawy" text="Publiczne zestawy" link="/zestawy" />
        <div className="flex flex-col max-sm:gap-2 gap-6 max-w-2xl mx-auto w-full">
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
        {addCategory ? (
          <form
            className=" max-w-2xl mx-auto w-full flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              console.log(e);
            }}
          >
            <input
              type="text"
              name="nowaKategoria"
              className="input w-full"
              autoFocus
            />
            <button
              type="submit"
              onClick={() => setAddCategory(false)}
              className="btn btn-outline btn-secondary btn-sm text-base "
            >
              Dodaj kategorię
            </button>
          </form>
        ) : (
          <button
            onClick={() => setAddCategory(true)}
            className="btn btn-outline btn-secondary btn-sm text-base mx-auto w-full max-w-2xl"
          >
            Nowa kategoria
          </button>
        )}
      </div>
    </div>
  );
};
export default MojeZestawyPage;
