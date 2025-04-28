"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SubNav from "@/app/components/SubNav";
import "@/assets/styles/card.css";

const FiszkiPage = () => {
  const { id } = useParams();
  const [wordsSet, setWordsSet] = useState(null);
  const [actualWords, setActualWords] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [cardRotated, setCardRotated] = useState(false);
  const [cardSide, setCardSide] = useState(false);
  const [cardAnimation, setCardAnimation] = useState(false);
  const [progress, setProgress] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchWords = async (id) => {
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
        setActualWords(data.words.map((item) => ({ ...item, known: false })));
      } catch (error) {
        console.error(error);
      }
    };

    fetchWords(id);
  }, []);

  const cardRotateHandler = () => {
    setCardRotated(true);
    setCardAnimation(true);
    setTimeout(() => {
      setCardSide((prev) => !prev);
    }, 250);
    setTimeout(() => {
      setCardAnimation(false);
    }, 500);
  };

  const wordCheckHandler = (isKnown) => {
    if (!gameOver) {
      setCardRotated(false);
      setWordIndex((wordIndex) => wordIndex + 1);
      setActualWords((prev) =>
        prev.map((item, index) =>
          index === wordIndex ? { ...item, known: isKnown } : item
        )
      );
      setProgress((prev) => prev + 100 / actualWords.length);
    }
    console.log(
      `actualWords.length: ${actualWords.length},wordIndex: ${wordIndex}`
    );
  };

  useEffect(() => {
    if (actualWords.length === wordIndex && actualWords.length !== 0) {
      setGameOver(true);
      setProgress(100);

      console.log(actualWords);
    }
  }, [wordIndex]);

  if (!wordsSet) {
    return (
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-base-300/30">
        <span className="loader"></span>
      </div>
    );
  }
  // console.log(wordsSet);

  const resetGame = () => {
    setProgress(0);
    setWordIndex(0);
    setGameOver(false);
    setShowResults(false);
    setActualWords((prev) =>
      prev.map((item) => ({
        ...item,
        known: false,
      }))
    );
  };
  return (
    <div className="flex-grow ">
      <SubNav
        title={wordsSet.name}
        text="Wróć do zestawu"
        link={`/zestawy/${id}`}
      />
      {/* Progress bar */}
      <div className="relative bg-base-300 w-full text-center px-2">
        <p className="z-[1] relative">Postęp {Math.trunc(progress)}%</p>
        <div
          style={{ width: `${progress}%` }}
          className="absolute transition-all top-0 left-0 h-full bg-secondary "
        ></div>
      </div>
      {!showResults && (
        <div className="flex flex-col items-center mx-4 perspective-normal">
          {/* Card */}
          <button
            onClick={() => {
              if (!cardAnimation) cardRotateHandler();
            }}
            className={`card my-6 shadow-lg relative border-8 rounded-2xl py-2 px-4 w-100 h-50 max-[440px]:h-30 max-sm:w-full flex justify-center items-center text-center cursor-pointer select-none ${
              cardSide
                ? "border-accent/70 hover:border-accent/100 bg-accent/10 hover:bg-accent/20"
                : "border-secondary/70 hover:border-secondary/100 bg-secondary/10 hover:bg-secondary/20"
            } ${cardAnimation && "card-anim"}`}
          >
            {!gameOver ? (
              <>
                <div className="absolute top-2 left-3">#{wordIndex + 1}</div>
                <p className="title  max-sm:text-2xl font-semibold">
                  {!cardSide
                    ? actualWords[wordIndex]?.english
                    : actualWords[wordIndex]?.polish}
                </p>
              </>
            ) : (
              <p className="font-semibold">Koniec</p>
            )}
          </button>
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
            <div className="w-full text-xl flex justify-center gap-2 bg-base-200 py-1">
              <h3>Wynik:</h3>
              <div>
                {actualWords.reduce(
                  (acc, item) => (item.known ? acc + 1 : acc),
                  0
                )}{" "}
                / {actualWords.length}
              </div>
            </div>
            <ul className="border-2 border-base-200 py-2 px-4 rounded-2xl min-w-sm">
              {actualWords.map((item) => (
                <li
                  key={item["_id"]}
                  className={`text-${item.known ? "success" : "error"}`}
                >
                  {item.english} - {item.polish}
                </li>
              ))}
            </ul>
            <div className="flex justify-center gap-4 max-sm:flex-col max-sm:gap-2 py-4">
              <button onClick={resetGame} className="btn btn-sm">
                Powtórz wszystko
              </button>
              {/* {actualWords.reduce(
                (acc, item) => (item.known ? acc : acc + 1),
                0
              ) > 0 && (
                <button
                  onClick={() => {
                    setProgress(0);
                    setWordIndex(0);
                    setGameOver(false);
                    setShowResults(false);
                    setActualWords((prev) =>
                      prev.filter((item) => item.known === false)
                    );
                  }}
                  className="btn btn-sm"
                >
                  Powtórz nie znane
                </button>
              )} */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default FiszkiPage;
