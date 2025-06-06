"use client";
import "@/assets/styles/card.css";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SubNav from "@/app/components/SubNav";
import ProgressBar from "@/app/components/ProgressBar";
import FlashCards from "@/app/components/FlashCards";
import Typing from "@/app/components/Typing";
import Pairs from "@/app/components/Pairs";

const GraPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [wordsSet, setWordsSet] = useState(null);
  const [actualWords, setActualWords] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [saved, setSaved] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [saveInProgress, setSaveInProgress] = useState(false);
  const { data: session } = useSession();
  const gameType = searchParams.get("game");
  const size = searchParams.get("size");
  const unknownOnly = searchParams.get("unknown");
  const root =
    searchParams.get("type") === "public" ? "zestawy" : "prywatne_zestawy";

  useEffect(() => {
    if (id === "zapisane") {
      fetchWordsToLearn();
    } else if (id === "losowy") {
      const data = {
        name: "Losowy zestaw",
        words: JSON.parse(localStorage.getItem("losowyZestaw")) || [],
      };
      setWordsSet(data);
      setActualWords(data.words);
    } else fetchWords();
  }, []);

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
      if (unknownOnly === "true") {
        const wordsKnown = await fetchWordsKnownOld();
        const filtered = data.words.filter(
          (item) => !wordsKnown.some((known) => known._id === item._id)
        );
        const newSet = { ...data, words: filtered };
        setWordsSet(newSet);
        setActualWords(
          randomize(
            newSet.words.map((item) => ({ ...item, known: false }))
          ).slice(0, size)
        );
      } else {
        setWordsSet(data);
        setActualWords(
          randomize(
            data.words.map((item) => ({ ...item, known: false }))
          ).slice(0, size)
        );
      }
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
      setSaveInProgress(true);
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
      setSaveInProgress(false);
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

      <div className="sticky top-12 max-md:top-21 max-sm:top-11 bg-base-100 pt-2 z-10">
        <ProgressBar progress={progress} />
      </div>
      {!showResults && (
        <>
          {gameType === "fiszki" ? (
            <FlashCards
              actualWords={actualWords}
              progress={progress}
              size={size}
              randomize={randomize}
              wordIndex={wordIndex}
              setActualWords={setActualWords}
              gameOver={gameOver}
              saveInProgress={saveInProgress}
              setWordIndex={setWordIndex}
              setProgress={setProgress}
              setShowResults={setShowResults}
              setSaved={setSaved}
              setAutoSave={setAutoSave}
              setGameOver={setGameOver}
              updateSavedWords={updateSavedWords}
            />
          ) : gameType === "pary" ? (
            <Pairs
              actualWords={actualWords}
              progress={progress}
              setProgress={setProgress}
              size={size}
              randomize={randomize}
              gameOver={gameOver}
              saveInProgress={saveInProgress}
              setGameOver={setGameOver}
              setActualWords={setActualWords}
              setSaved={setSaved}
              setAutoSave={setAutoSave}
              setShowResults={setShowResults}
              updateSavedWords={updateSavedWords}
            />
          ) : (
            <Typing
              actualWords={actualWords}
              size={size}
              wordIndex={wordIndex}
              setActualWords={setActualWords}
              gameOver={gameOver}
              saveInProgress={saveInProgress}
              setWordIndex={setWordIndex}
              setProgress={setProgress}
              setShowResults={setShowResults}
              setSaved={setSaved}
              setAutoSave={setAutoSave}
              setGameOver={setGameOver}
              updateSavedWords={updateSavedWords}
            />
          )}
        </>
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
              <button onClick={resetGame} className="btn btn-md max-sm:btn-lg ">
                Restartuj
              </button>
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
                        className={`btn btn-md w-34 h-9 pl-8 max-sm:w-full max-sm:h-12 max-sm:text-lg ${
                          autoSave && "btn-success"
                        } `}
                      >
                        Autozapis
                      </div>
                    ) : (
                      <>
                        {saved ? (
                          <button
                            className={`btn btn-md w-34 h-9 pl-8 max-sm:w-full max-sm:h-12 max-sm:text-lg ${
                              saved && "btn-success"
                            } `}
                          >
                            {saveInProgress ? (
                              <span className="animate-pulse ml-[5px]">
                                Zapisuję...
                              </span>
                            ) : (
                              "Zapisano"
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              updateSavedWords(actualWords);
                              setSaved(true);
                            }}
                            className={`btn btn-md w-34 h-9 pl-8 max-sm:w-full max-sm:h-12 max-sm:text-lg ${
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
export default GraPage;
