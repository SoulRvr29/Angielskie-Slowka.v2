"use client";
import Category from "../components/Category";
import { useEffect, useState } from "react";
import AddCategory from "../components/AddCategory";
import SubNav from "../components/SubNav";
import Loader from "../components/Loader";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const WordSetsPage = () => {
  const [wordSets, setWordSets] = useState(null);
  const [categoriesList, setCategoriesList] = useState();
  const [actualCategory, setActualCategory] = useState(null);
  const [savedWordSets, setSavedWordSets] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [admin, setAdmin] = useState(false);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const root =
    searchParams.get("type") === "public" ? "zestawy" : "prywatne_zestawy";

  useEffect(() => {
    if (session) {
      if (session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setAdmin(true);
      }

      fetchWordsToLearn();
      mapKnownWords();
    }
  }, [session, root]);

  const fetchWords = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/${root}`);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();

      if (Array.isArray(data)) {
        setCategoriesList(data.map((item) => item.category));
        setWordSets(data);
      } else if (data.wordSets) {
        setCategoriesList(data.wordSets.map((item) => item.category));
        setWordSets(data.wordSets);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const mapKnownWords = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/${root}`);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      const wordsToLearn = await fetchWordsToLearnOld();
      const wordsKnown = await fetchWordsKnownOld();
      if (searchParams.get("type") === "public") {
        const mappedData = data.map((item) => {
          const updatedSets = item.sets.map((set) => {
            const updatedWords = set.words.map((word) => {
              if (
                wordsKnown.some((wordToLearn) => wordToLearn._id === word._id)
              ) {
                return { ...word, known: true };
              } else if (
                wordsToLearn.some((wordToLearn) => wordToLearn._id === word._id)
              ) {
                return { ...word, known: false };
              }
              return word;
            });
            return { ...set, words: updatedWords };
          });
          return { ...item, sets: updatedSets };
        });

        if (Array.isArray(mappedData)) {
          setCategoriesList(mappedData.map((item) => item.category));
          setWordSets(mappedData);
        } else if (mappedData.wordSets) {
          setCategoriesList(mappedData.wordSets.map((item) => item.category));
          setWordSets(mappedData.wordSets);
        }
      } else {
        const mappedData = {
          ...data,
          wordSets: data.wordSets.map((item) => {
            const updatedSets = item.sets.map((set) => {
              const updatedWords = set.words.map((word) => {
                if (
                  wordsKnown.some((wordToLearn) => wordToLearn._id === word._id)
                ) {
                  return { ...word, known: true };
                } else if (
                  wordsToLearn.some(
                    (wordToLearn) => wordToLearn._id === word._id
                  )
                ) {
                  return { ...word, known: false };
                }
                return word;
              });
              return { ...set, words: updatedWords };
            });
            return { ...item, sets: updatedSets };
          }),
        };

        if (Array.isArray(mappedData)) {
          setCategoriesList(mappedData.map((item) => item.category));
          setWordSets(mappedData);
        } else if (mappedData.wordSets) {
          setCategoriesList(mappedData.wordSets.map((item) => item.category));
          setWordSets(mappedData.wordSets);
        }
      }
    } catch (error) {
      console.error(error);
    }
    setIsFetching(false);
  };

  const fetchWordsToLearnOld = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/do_nauczenia`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      // setActualUnknown(data.wordsToLearn);

      return data.wordsToLearn;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWordsKnownOld = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/znane_slowka`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      return data.wordsKnown;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWordsToLearn = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/do_nauczenia`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();

      setSavedWordSets(data.wordsToLearn);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWords();
    if (session) {
      mapKnownWords();
      setIsFetching(true);
    }
  }, []);

  useEffect(() => {
    fetchWords();
    if (root !== "zestawy") {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
    if (session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      setAdmin(true);
    }
  }, [root]);

  if (!wordSets) {
    return <Loader message="Pobieranie zestawów" />;
  }
  if (isFetching) {
    return <Loader message="Pobieranie wyników" />;
  }

  const addCategoryHandler = (name) => {
    const createCategory = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/${root}/kategoria`,
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
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/${root}/kategoria`,
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
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/${root}/kategoria`,
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="flex flex-col gap-2"
    >
      <SubNav title="Lista kategorii" />
      <div className="flex flex-col gap-4 max-sm:gap-2 max-w-2xl mx-auto w-full">
        <div className="flex max-sm:flex-col w-full justify-center gap-4 max-sm:gap-2">
          {savedWordSets.length > 0 && (
            <Link
              className="text-lg rounded-md gap-2 px-4 max-sm:py-1 max-sm:rounded-none font-semibold max-sm:text-lg cursor-pointer  border border-secondary bg-primary/10 w-full text-center hover:text-secondary transition-colors"
              href={{
                pathname: `/zestawy/zapisane`,
                query: { type: searchParams.get("type") },
              }}
            >
              Słówka do powtórki
            </Link>
          )}
          <Link
            className="text-lg rounded-md gap-2 px-4 max-sm:py-1 max-sm:rounded-none font-semibold max-sm:text-lg cursor-pointer  border border-accent bg-primary/10 w-full text-center hover:text-accent transition-colors"
            href={{
              pathname: `/zestawy/losowy`,
              query: { type: searchParams.get("type") },
            }}
          >
            Losowy zestaw
          </Link>
        </div>
        {wordSets.length > 0 ? (
          wordSets.map((item, index) => (
            <div key={item._id}>
              {root === "zestawy" && (
                <>
                  {index === 0 && (
                    <div className="text-success text-xl border-b border-dotted mb-4 block max-sm:px-2">
                      Poziom początkujący
                    </div>
                  )}
                  {index === 6 && (
                    <div className="text-success text-xl border-b border-dotted mb-4 block max-sm:px-2">
                      Poziom podstawowy
                    </div>
                  )}
                  {index === 13 && (
                    <div className="text-success text-xl border-b border-dotted mb-4 block max-sm:px-2">
                      Poziom średnio zaawansowany
                    </div>
                  )}
                </>
              )}
              <Category
                category={item.category}
                sets={item.sets}
                actualCategory={actualCategory}
                setActualCategory={setActualCategory}
                deleteCategoryHandler={deleteCategoryHandler}
                editCategoryHandler={editCategoryHandler}
                admin={admin}
                type={searchParams.get("type")}
              />
            </div>
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
    </motion.div>
  );
};
export default WordSetsPage;
