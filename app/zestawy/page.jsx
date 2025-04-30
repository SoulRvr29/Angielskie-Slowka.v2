"use client";
import Category from "../components/Category";
import { useEffect, useState } from "react";
import AddCategory from "../components/AddCategory";
import SubNav from "../components/SubNav";
import Loader from "../components/Loader";

const WordSetsPage = () => {
  const [wordSets, setWordSets] = useState(null);
  const [categoriesList, setCategoriesList] = useState();
  const [actualCategory, setActualCategory] = useState(null);

  const fetchWords = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/zestawy`);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();

      setWordSets(data);
      setCategoriesList(data.map((item) => item.category));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  if (!wordSets) {
    return <Loader message="Pobieranie zestawów" />;
  }

  const addCategoryHandler = (name) => {
    const createCategory = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/zestawy/kategoria`,
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
    const result = confirm("Potwierdź usunięcie");
    if (!result) return;

    const deleteCategory = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/zestawy/kategoria`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: name }),
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
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/zestawy/kategoria`,
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
      <SubNav title="Lista zestawów" />
      <div className="flex flex-col gap-4 max-sm:gap-2 max-w-2xl mx-auto w-full">
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
            />
          ))
        ) : (
          <div>Brak kategorii</div>
        )}
        <AddCategory
          addCategoryHandler={addCategoryHandler}
          categoriesList={categoriesList}
        />
      </div>
    </div>
  );
};
export default WordSetsPage;
