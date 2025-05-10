"use client";
import Category from "../components/Category";
import { useEffect, useState } from "react";
import AddCategory from "../components/AddCategory";
import SubNav from "../components/SubNav";
import Loader from "../components/Loader";
import Link from "next/link";
import { useSession } from "next-auth/react";

const WordSetsPage = () => {
  const [wordSets, setWordSets] = useState(null);
  const [categoriesList, setCategoriesList] = useState();
  const [actualCategory, setActualCategory] = useState(null);
  const [savedWordSets, setSavedWordSets] = useState();
  const [admin, setAdmin] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      if (session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setAdmin(true);
      }
    }
  }, [session]);

  const fetchWords = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/publiczne_zestawy`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();

      setCategoriesList(data.wordSets.map((item) => item.category));
      setWordSets(data.wordSets);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWords();
    setSavedWordSets(
      JSON.parse(localStorage.getItem("nieZnaneSlowka") || "[]")
    );
  }, []);

  if (!wordSets) {
    return <Loader message="Pobieranie zestawów" />;
  }

  const addCategoryHandler = (name) => {
    const createCategory = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/publiczne_zestawy/kategoria`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              category: name,
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Failed to create category");
        }
        const data = await res.json();
        console.log("Category created:", data);
        fetchWords();
      } catch (error) {
        console.error(error);
      }
    };

    createCategory();
  };

  const deleteCategoryHandler = (name) => {
    const deleteCategory = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/publiczne_zestawy/kategoria`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ category: name }),
          }
        );

        if (!res.ok) {
          throw new Error("Failed to delete category");
        }

        const data = await res.json();
        console.log("Category deleted:", data);
        fetchWords();
        setActualCategory(null);
      } catch (error) {
        console.error(error);
      }
    };

    deleteCategory();
  };

  const editCategoryHandler = (categoryData) => {
    const editCategory = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/publiczne_zestawy/kategoria`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(categoryData),
          }
        );

        if (!res.ok) {
          throw new Error("Failed to edit category");
        }

        const data = await res.json();
        console.log("Category edited:", data);
        fetchWords();
        setActualCategory(null);
      } catch (error) {
        console.error(error);
      }
    };

    editCategory();
  };

  return (
    <div className="flex flex-col gap-2">
      <SubNav title="Lista słówek" />
      <div className="flex flex-col gap-4 max-sm:gap-2 max-w-2xl mx-auto w-full">
        {savedWordSets.length > 0 && (
          <Link
            className="text-lg rounded-md gap-2 px-4 max-sm:py-1 max-sm:rounded-none font-semibold max-sm:text-lg cursor-pointer  border border-primary bg-primary/10"
            href={`/publiczne_zestawy/zapisane`}
          >
            Zapisane słówka
          </Link>
        )}
        {wordSets.length > 0 ? (
          wordSets.map((item, index) => (
            <Category
              key={index}
              category={item.category}
              sets={item.sets}
              actualCategory={actualCategory}
              setActualCategory={setActualCategory}
              deleteCategoryHandler={deleteCategoryHandler}
              editCategoryHandler={editCategoryHandler}
              admin={admin}
            />
          ))
        ) : (
          <div>Brak kategorii</div>
        )}
        {admin && (
          <AddCategory
            addCategoryHandler={addCategoryHandler}
            categoriesList={categoriesList}
          />
        )}
      </div>
    </div>
  );
};
export default WordSetsPage;
