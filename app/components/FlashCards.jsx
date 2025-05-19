"use client";
import {
  FaBackward,
  FaArrowLeft,
  FaArrowRight,
  FaArrowDown,
  FaPlay,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { speechHandler } from "@/utils/speechHandler";
import { FaInfoCircle } from "react-icons/fa";
import WordDetails from "./WordDetails";
import ConfettiEffect from "./ConfettiEffect";

const FlashCard = ({
  actualWords,
  wordIndex,
  progress,
  size,
  gameOver,
  randomize,
  setActualWords,
  setWordIndex,
  setProgress,
  setShowResults,
  setSaved,
  setAutoSave,
  setGameOver,
  updateSavedWords,
}) => {
  const [cardRotated, setCardRotated] = useState(false);
  const [actualCardSide, setActualCardSide] = useState(false);
  const [defaultCardSide, setDefaultCardSide] = useState(false);
  const [cardAnimation, setCardAnimation] = useState(false);
  const [actualUnknown, setActualUnknown] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

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
        if (localStorage.getItem("mute") !== "true") {
          const audio = new Audio("/sounds/card-unknown.mp3");
          audio.volume = 0.6;
          audio.play();
        }
        setActualUnknown((prev) => [...prev, actualWords[wordIndex]]);
      } else {
        if (localStorage.getItem("mute") !== "true") {
          const audio = new Audio("/sounds/card-known.mp3");
          audio.volume = 0.4;
          audio.play();
        }
        setProgress((prev) => prev + 100 / size);
      }
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
  // Keyboard control listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (progress === 100) {
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
      if (e.code === "ArrowDown") {
        e.preventDefault();
        backwardHandler();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cardAnimation, cardRotated]);

  useEffect(() => {
    if (actualWords.length === wordIndex && actualWords.length !== 0) {
      if (actualUnknown.length === 0) {
        if (localStorage.getItem("mute") !== "true") {
          if (actualWords.every((item) => item.known)) {
            const audio = new Audio("/sounds/perfect.mp3");
            audio.volume = 0.75;
            audio.play();
          } else {
            const audio = new Audio("/sounds/finish.mp3");
            audio.volume = 0.5;
            audio.play();
          }
        }
        setGameOver(true);
        setProgress(100);
        setActualWords(actualWords.slice(0, size));
      } else {
        setActualWords((prev) => [...prev, ...randomize(actualUnknown)]);
        setActualUnknown([]);
      }
    }
  }, [wordIndex]);

  useEffect(() => {
    if (actualWords[wordIndex]) {
      if (!actualCardSide) {
        const word = actualWords[wordIndex].english;
        speechHandler(word);
      }
    }
  }, [actualCardSide, actualWords, wordIndex]);

  return (
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

            <FaInfoCircle
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(true);
              }}
              className="absolute angpl-btn right-3 top-3 opacity-0 max-sm:opacity-20 group-hover:opacity-50 hover:opacity-100"
              size={18}
            />

            <FaPlay
              onClick={(e) => {
                e.stopPropagation();
                const word = actualWords[wordIndex].english;
                speechHandler(word);
              }}
              className="absolute angpl-btn left-3 bottom-3 opacity-0 max-sm:opacity-20 group-hover:opacity-50 hover:opacity-100"
              size={18}
            />
            <div className="absolute bottom-2 right-3 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDefaultCardSide((prev) => !prev);
                }}
                title="kolejność"
                className="angpl-btn opacity-0 max-sm:opacity-20 pointer-events-none text-md max-sm:text-sm font-bold"
              >
                {defaultCardSide ? "pl/eng" : "eng/pl"}
              </button>
            </div>
          </>
        ) : (
          <>
            {actualWords.every((item) => item.known) ? (
              <>
                <ConfettiEffect />
                <p className="font-semibold">Idealnie</p>
              </>
            ) : (
              <p className="font-semibold">Koniec</p>
            )}
          </>
        )}
      </div>
      {/* Known yes/not controls */}
      {!gameOver ? (
        <div className="max-w-100 w-full pb-6">
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
                  space
                </div>
                Obróć kartę
              </button>
            </div>
          ) : (
            <div className="flex gap-4 max-w-100 px-4 w-full justify-center">
              <button
                onClick={() => {
                  wordCheckHandler(true);
                  speechHandler("", false);
                  setShowDetails(false);
                }}
                className="btn btn-success w-45 max-sm:w-[38vw] group relative"
              >
                <div
                  title="klawisz &larr;"
                  className="absolute right-3 opacity-0 group-hover:opacity-30 text-black flex items-center"
                >
                  <FaArrowLeft className="border border-black rounded-sm p-[2px] size-5" />
                </div>
                Znam
              </button>
              <button
                onClick={() => {
                  wordCheckHandler(false);
                  speechHandler("", false);
                  setShowDetails(false);
                }}
                className="btn btn-error w-45 max-sm:w-[38vw] relative group "
              >
                <div
                  title="klawisz &rarr;"
                  className="absolute right-3 opacity-0 group-hover:opacity-30 text-black flex items-center"
                >
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
          className="btn btn-sm btn-info opacity-50 hover:opacity-100 btn-outline mb-4 relative group"
        >
          <div
            title="klawisz &darr;"
            className="absolute -bottom-8 opacity-0 group-hover:opacity-30 text-black flex items-center bg-[rgba(255,255,255,0.5)] rounded-md"
          >
            <FaArrowDown className="border border-black rounded-sm p-[2px] size-6" />
          </div>
          <FaBackward size={20} />
        </button>
      )}
      {showDetails && (
        <div
          className=""
          onClick={() => {
            speechHandler("", false);
            setShowDetails(false);
          }}
        >
          <WordDetails
            word={actualWords[wordIndex].english}
            setShowDetails={setShowDetails}
          />
        </div>
      )}
    </div>
  );
};
export default FlashCard;
