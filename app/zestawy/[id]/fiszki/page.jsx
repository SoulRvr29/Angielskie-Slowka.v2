"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SubNav from "@/app/components/SubNav";
import "@/assets/styles/card.css";
import { FaBackward, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useSession } from "next-auth/react";

const FiszkiPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const size = searchParams.get("size");
  const [wordsSet, setWordsSet] = useState(null);
  const [actualWords, setActualWords] = useState([]);
  const [actualUnknown, setActualUnknown] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [cardRotated, setCardRotated] = useState(false);
  const [actualCardSide, setActualCardSide] = useState(false);
  const [defaultCardSide, setDefaultCardSide] = useState(false);
  const [cardAnimation, setCardAnimation] = useState(false);
  const [progress, setProgress] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [saved, setSaved] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const { data: session } = useSession();
  const root =
    searchParams.get("type") === "public" ? "zestawy" : "prywatne_zestawy";

  useEffect(() => {
    if (id === "zapisane") {
      fetchWordsToLearn();
    } else fetchWords();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (progress === 100) {
          console.log(gameOver, progress);
          setAutoSave(JSON.parse(localStorage.getItem("autoSave") || false));
          setShowResults(true);
          if (JSON.parse(localStorage.getItem("autoSave"))) {
            updateSavedWords(actualWords);
            setSaved(true);
          }
          return;
        }
        if (!cardAnimation) {
          cardRotateHandler();
        }
      }
      if (e.code === "ArrowLeft") {
        e.preventDefault();
        if (cardRotated) {
          wordCheckHandler(true);
        }
      }
      if (e.code === "ArrowRight") {
        e.preventDefault();
        if (cardRotated) {
          wordCheckHandler(false);
        }
      }
      if (e.code === "Backspace") {
        e.preventDefault();
        backwardHandler();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cardAnimation, cardRotated]);

  const fetchWords = async () => {
    if (!id) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/${root}/${id}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setWordsSet(data);
      setActualWords(
        randomize(data.words.map((item) => ({ ...item, known: false }))).slice(
          0,
          size
        )
      );
    } catch (error) {
      console.error(error);
    }
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
      const savedWords = {
        category: "Zapisane słówka",
        words: data.wordsToLearn,
      };
      // setWordsToLearnOld(savedWords.words);
      setWordsSet(savedWords);
      setActualWords(randomize(savedWords.words).slice(0, size));
    } catch (error) {
      console.error(error);
    }
  };

  const randomize = (arr) => {
    const indexes = arr.map((_, i) => i);
    for (let i = indexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
    }
    return indexes.map((i) => arr[i]);
  };

  const cardRotateHandler = () => {
    setCardRotated(true);
    setCardAnimation(true);
    setTimeout(() => {
      setActualCardSide((prev) => !prev);
    }, 250);
    setTimeout(() => {
      setCardAnimation(false);
    }, 500);
  };

  const wordCheckHandler = (isKnown) => {
    if (!gameOver) {
      setActualCardSide(defaultCardSide);
      setCardRotated(false);
      setWordIndex((wordIndex) => wordIndex + 1);
      setActualWords((prev) =>
        prev.map((item, index) =>
          index === wordIndex ? { ...item, known: isKnown } : item
        )
      );
      if (!isKnown) {
        setActualUnknown((prev) => [...prev, actualWords[wordIndex]]);
      } else {
        setProgress((prev) => prev + 100 / size);
      }
    }
  };

  useEffect(() => {
    if (actualWords.length === wordIndex && actualWords.length !== 0) {
      if (actualUnknown.length === 0) {
        setGameOver(true);
        setProgress(100);
        setActualWords(actualWords.slice(0, size));
      } else {
        setActualWords((prev) => [...prev, ...randomize(actualUnknown)]);
        setActualUnknown([]);
      }
    }
  }, [wordIndex]);

  if (!wordsSet) {
    return (
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-base-300/30">
        <span className="loader"></span>
      </div>
    );
  }

  const resetGame = () => {
    setProgress(0);
    setWordIndex(0);
    setGameOver(false);
    setShowResults(false);
    setActualWords((prev) =>
      randomize(
        prev
          .map((item) => ({
            ...item,
            known: false,
          }))
          .slice(0, size)
      )
    );
    setSaved(false);
  };

  const updateSavedWords = async (arr) => {
    if (session) {
      const newWordsToLearn = arr.filter((item) => item.known === false);
      const newKnown = arr.filter((item) => item.known === true);
      const knownIds = new Set(newKnown.map((item) => item._id));
      const unknownIds = new Set(newWordsToLearn.map((item) => item._id));
      const oldWordsToLearn = await fetchWordsToLearnOld();
      const oldKnown = await fetchWordsKnownOld();
      const newArrOfWordsToLearn = [...oldWordsToLearn, ...newWordsToLearn];
      const newArrOfKnown = [...oldKnown, ...newKnown];
      const filteredWordsToLearn = newArrOfWordsToLearn.filter(
        (item) => !knownIds.has(item._id)
      );
      const filteredKnown = newArrOfKnown.filter(
        (item) => !unknownIds.has(item._id)
      );
      const uniqueWordsToLearn = [
        ...new Map(
          filteredWordsToLearn.map((item) => [item["_id"], item])
        ).values(),
      ];
      const uniqueKnown = [
        ...new Map(filteredKnown.map((item) => [item["_id"], item])).values(),
      ];
      postWordsToLearn(uniqueWordsToLearn);
      postWordsKnown(uniqueKnown);
    }
  };

  const postWordsKnown = async (data) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/znane_slowka`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ wordsKnown: data }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update data");
      }

      const updatedData = await res.json();
      console.log("Update successful:", updatedData);
    } catch (error) {
      console.error(error);
    }
  };
  const postWordsToLearn = async (data) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/do_nauczenia`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ wordsToLearn: data }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update data");
      }

      const updatedData = await res.json();
      console.log("Update successful:", updatedData);
    } catch (error) {
      console.error(error);
    }
  };

  const backwardHandler = () => {
    if (wordIndex > 0) {
      if (actualWords[wordIndex - 1].known) {
        setProgress((prev) => prev - 100 / size);
      }
      setWordIndex((prev) => prev - 1);
      setCardRotated(false);
      setActualCardSide(defaultCardSide);
    } else {
      setWordIndex(0);
    }
    if (actualWords[wordIndex - 1].known === false) {
      setActualUnknown((prev) => [...prev.slice(0, -1)]);
    }
  };

  return (
    <div className="flex-grow ">
      <SubNav
        title={wordsSet.name}
        text="Wróć do zestawu"
        link={{
          pathname: `/zestawy/${id}`,
          query: { type: searchParams.get("type") },
        }}
      />
      {/* Progress bar */}
      <div className="relative bg-base-300 w-full text-center px-2 max-sm:py-1">
        <p className="z-[1] relative">Postęp {Math.trunc(progress)}%</p>
        <div
          style={{ width: `${progress}%` }}
          className="absolute transition-all top-0 left-0 h-full bg-secondary "
        ></div>
      </div>
      {!showResults && (
        <div className="flex flex-col items-center mx-4 perspective-normal">
          {/* Flash Card */}
          <div
            onClick={() => {
              if (!cardAnimation) cardRotateHandler();
            }}
            className={`card my-6 shadow-lg relative border-8 rounded-2xl py-2 px-4 w-100 h-50 max-[440px]:h-40 max-sm:w-full flex justify-center items-center text-center cursor-pointer select-none ${
              actualCardSide
                ? "border-accent/70 hover:border-accent/100 bg-accent/10 hover:bg-accent/20"
                : "border-secondary/70 hover:border-secondary/100 bg-secondary/10 hover:bg-secondary/20"
            } ${cardAnimation && "card-anim"} ${
              actualWords.length > size && "border-double "
            }`}
          >
            {!gameOver ? (
              <>
                {actualWords.length > size && (
                  <div
                    className={`absolute text-lg top-1 left-2 opacity-50 font-semibold ${
                      actualCardSide ? "text-accent" : "text-secondary"
                    }`}
                  >
                    Powtórka
                  </div>
                )}
                <p className="title  max-sm:text-2xl font-semibold">
                  {!actualCardSide
                    ? actualWords[wordIndex]?.english
                    : actualWords[wordIndex]?.polish}
                </p>
                <div className="absolute bottom-2 right-3 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDefaultCardSide((prev) => !prev);
                    }}
                    title="kolejność"
                    className="angpl-btn opacity-0 pointer-events-none text-md max-sm:text-sm font-bold"
                  >
                    {defaultCardSide ? "pl/eng" : "eng/pl"}
                  </button>
                </div>
              </>
            ) : (
              <p className="font-semibold">Koniec</p>
            )}
          </div>
          {/* Known yes/not controls */}
          {!gameOver ? (
            <div className="max-w-100 w-full">
              {!cardRotated ? (
                <div className="flex gap-4 max-w-100 px-4 w-full justify-between">
                  <button
                    onClick={() => {
                      if (!cardAnimation) cardRotateHandler();
                      setCardRotated(true);
                    }}
                    className="btn btn-info w-full relative group"
                  >
                    <div className="absolute right-3 opacity-0 group-hover:opacity-30 text-black border border-black rounded-sm px-2 pb-[1px]">
                      spacja
                    </div>
                    Obróć kartę
                  </button>
                </div>
              ) : (
                <div className="flex gap-4 max-w-100 px-4 w-full justify-center">
                  <button
                    onClick={() => {
                      wordCheckHandler(true);
                    }}
                    className="btn btn-success w-45 max-sm:w-[38vw] group relative"
                  >
                    <div className="absolute right-3 opacity-0 group-hover:opacity-30 text-black flex items-center">
                      <FaArrowLeft className="border border-black rounded-sm p-[2px] size-5" />
                    </div>
                    Znam
                  </button>
                  <button
                    onClick={() => {
                      wordCheckHandler(false);
                    }}
                    className="btn btn-error w-45 max-sm:w-[38vw] relative group "
                  >
                    <div className="absolute right-3 opacity-0 group-hover:opacity-30 text-black flex items-center">
                      <FaArrowRight className="border border-black rounded-sm p-[2px] size-5" />
                    </div>
                    Nie znam
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-4 max-w-100 px-4 w-full justify-between">
              <button
                onClick={() => {
                  setAutoSave(
                    JSON.parse(localStorage.getItem("autoSave") || false)
                  );
                  setShowResults(true);
                  if (JSON.parse(localStorage.getItem("autoSave"))) {
                    updateSavedWords(actualWords);
                    setSaved(true);
                  }
                }}
                className="btn btn-info w-full relative group"
              >
                <div className="absolute right-3 opacity-0 group-hover:opacity-30 text-black border border-black rounded-sm px-2 pb-[1px]">
                  spacja
                </div>
                Przejdź do podsumowania
              </button>
            </div>
          )}
          {wordIndex > 0 && !gameOver && actualWords.length <= size && (
            <button
              title="Cofnij"
              onClick={backwardHandler}
              className="btn btn-sm btn-info opacity-50 hover:opacity-100 btn-outline my-6 relative group"
            >
              <div className="absolute -bottom-8 opacity-0 group-hover:opacity-30 text-black border border-black rounded-sm px-2 pb-[1px] bg-[rgba(255,255,255,0.5)]">
                backspace
              </div>
              <FaBackward size={20} />
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col gap-4 items-center">
        {/* Final results */}
        {showResults && (
          <div className="my-4">
            <div className="w-full text-xl flex justify-center gap-2 bg-base-200 py-1 rounded-t-2xl max-sm:rounded-none">
              <h3>Wynik:</h3>
              <div>
                {actualWords.reduce(
                  (acc, item) => (item.known ? acc + 1 : acc),
                  0
                )}{" "}
                / {actualWords.length}
              </div>
            </div>
            <ul className="border-2 border-base-200 py-2 px-4 rounded-b-2xl min-w-sm max-sm:min-w-screen max-sm:rounded-none">
              {actualWords.map((item) => (
                <li
                  key={item.english}
                  className={`text-${item.known ? "success" : "error"}`}
                >
                  {item.english} - {item.polish}
                </li>
              ))}
            </ul>
            <div className="flex justify-center max-sm:px-4 gap-4 max-sm:flex-col max-sm:gap-2 py-4">
              <button onClick={resetGame} className="btn btn-sm max-sm:btn-lg ">
                Restartuj
              </button>
              {/* {actualWords.reduce(
                (acc, item) => (item.known ? acc : acc + 1),
                0
              ) > 0 && ( */}
              <>
                {session && (
                  <div className="flex items-center relative">
                    <input
                      className="absolute left-2 checkbox checkbox-sm max-sm:checkbox-lg"
                      type="checkbox"
                      defaultChecked={autoSave}
                      onChange={(e) => {
                        setAutoSave(e.target.checked);
                        localStorage.setItem(
                          "autoSave",
                          JSON.stringify(e.target.checked)
                        );
                        if (e.target.checked) {
                          updateSavedWords(actualWords);
                          setSaved(true);
                        }
                      }}
                    />
                    {autoSave ? (
                      <div
                        className={`btn btn-sm w-31 h-8 pl-8 max-sm:w-full max-sm:h-12 max-sm:text-lg ${
                          autoSave && "btn-success"
                        }`}
                      >
                        Autozapis
                      </div>
                    ) : (
                      <>
                        {saved ? (
                          <button
                            className={`btn btn-sm w-31 h-8 pl-8 max-sm:w-full max-sm:h-12 max-sm:text-lg ${
                              saved && "btn-success"
                            }`}
                          >
                            Zapisano
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              updateSavedWords(actualWords);
                              setSaved(true);
                            }}
                            className={`btn btn-sm w-31 h-8 pl-8 max-sm:w-full max-sm:h-12 max-sm:text-lg ${
                              autoSave && "btn-success"
                            }`}
                          >
                            Zapisz wynik
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default FiszkiPage;
