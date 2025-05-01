"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SubNav from "@/app/components/SubNav";
import "@/assets/styles/card.css";
import { FaCheck } from "react-icons/fa";

const FiszkiPage = () => {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchWords = async (id) => {
      if (id === "zapisane") {
        const savedWords = {
          category: "Zapisane słówka",
          words: JSON.parse(localStorage.getItem("nieZnaneSlowka")),
        };
        setWordsSet(savedWords);
        setActualWords(savedWords.words);
        return;
      }
      if (!id) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/zestawy/${id}`
        );
        console.log(`${process.env.NEXT_PUBLIC_API_DOMAIN}/zestawy/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setWordsSet(data);
        setActualWords(
          randomize(data.words.map((item) => ({ ...item, known: false })))
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchWords(id);
  }, []);

  // randomize old
  // const randomize = (data) => {
  //   const indexArr = [];
  //   while (indexArr.length < data.length) {
  //     let randomNr = Math.floor(Math.random() * data.length);
  //     if (indexArr.includes(randomNr) === false) indexArr.push(randomNr);
  //   }
  //   return indexArr.map((i) => data[i]);
  // };
  const randomize = (data) => {
    const indexes = data.map((_, i) => i);
    for (let i = indexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
    }
    return indexes.map((i) => data[i]);
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
        setProgress((prev) => prev + 100 / wordsSet.words.length);
      }
    }
  };

  useEffect(() => {
    if (actualWords.length === wordIndex && actualWords.length !== 0) {
      if (actualUnknown.length === 1) {
        setGameOver(true);
        setProgress(100);
        setActualWords(actualWords.slice(0, wordsSet.words.length));
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
        prev.map((item) => ({
          ...item,
          known: false,
        }))
      )
    );
    setSaved(false);
  };

  const updateUnknown = (arr) => {
    const newUnknown = arr.filter((item) => item.known === false);
    const newKnown = arr.filter((item) => item.known === true);
    const knownIds = new Set(newKnown.map((item) => item._id));
    const oldSaved = JSON.parse(localStorage.getItem("nieZnaneSlowka") || "[]");
    const newArr = [...oldSaved, ...newUnknown];
    const filtered = newArr.filter((item) => !knownIds.has(item._id));
    const unique = [
      ...new Map(filtered.map((item) => [item["_id"], item])).values(),
    ];
    localStorage.setItem("nieZnaneSlowka", JSON.stringify(unique));
    console.log(JSON.parse(localStorage.getItem("nieZnaneSlowka")));
  };

  return (
    <div className="flex-grow ">
      <SubNav title={wordsSet.name} text="Wróć do listy" link={`/zestawy`} />
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
          {/* Card */}
          <div
            onClick={() => {
              if (!cardAnimation) cardRotateHandler();
            }}
            className={`card my-6 shadow-lg relative border-8 rounded-2xl py-2 px-4 w-100 h-50 max-[440px]:h-40 max-sm:w-full flex justify-center items-center text-center cursor-pointer select-none ${
              actualCardSide
                ? "border-accent/70 hover:border-accent/100 bg-accent/10 hover:bg-accent/20"
                : "border-secondary/70 hover:border-secondary/100 bg-secondary/10 hover:bg-secondary/20"
            } ${cardAnimation && "card-anim"}`}
          >
            {!gameOver ? (
              <>
                {actualWords.length > wordsSet.words.length && (
                  <div
                    className={`absolute top-1 left-2 opacity-50 font-semibold ${
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
                    className="btn btn-info w-full"
                  >
                    Obróć kartę
                  </button>
                </div>
              ) : (
                <div className="flex gap-4 max-w-100 px-4 w-full justify-center">
                  <button
                    onClick={() => {
                      wordCheckHandler(true);
                    }}
                    className="btn btn-success w-45 max-sm:w-[38vw]"
                  >
                    Znam
                  </button>
                  <button
                    onClick={() => {
                      wordCheckHandler(false);
                    }}
                    className="btn btn-error w-45 max-sm:w-[38vw]"
                  >
                    Nie znam
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-4 max-w-100 px-4 w-full justify-between">
              <button
                onClick={() => {
                  setShowResults(true);
                  // console.log(actualWords);
                }}
                className="btn btn-info w-full"
              >
                Przejdź do podsumowania
              </button>
            </div>
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
                  key={item["_id"]}
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
                {saved ? (
                  <button className="btn btn-sm btn-success flex items-center gap-2 w-31 h-8 max-sm:w-full max-sm:h-12 max-sm:text-lg">
                    <FaCheck />
                    <p>Zapisano</p>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      updateUnknown(actualWords);
                      setSaved(true);
                    }}
                    className="btn btn-sm w-31 h-8 max-sm:w-full max-sm:h-12 max-sm:text-lg"
                  >
                    Zapisz wynik
                  </button>
                )}
              </>
              {/* )} */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default FiszkiPage;
