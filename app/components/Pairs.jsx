"use client";
import PairBlock from "./PairBlock";
import { useEffect, useState } from "react";
import { speechHandler } from "@/utils/speechHandler";
import WordDetails from "./WordDetails";
import { AnimatePresence, motion } from "framer-motion";
import ConfettiEffect from "./ConfettiEffect";

const Pairs = ({
  actualWords,
  setShowResults,
  setProgress,
  setGameOver,
  size,
  gameOver,
  randomize,
  setAutoSave,
  setActualWords,
  updateSavedWords,
  setSaved,
}) => {
  const [firstWord, setFirstWord] = useState("");
  const [secondWord, setSecondWord] = useState("");
  const [actualWord, setActualWord] = useState("");
  const [leftWords, setLeftWords] = useState([]);
  const [rightWords, setRightWords] = useState([]);
  const [actualSelected, setActualSelected] = useState("");
  const [actualSide, setActualSide] = useState("");
  const [completeCount, setCompleteCount] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setLeftWords(
      randomize(
        actualWords.map((item) => ({
          ...item,
          side: "left",
          color: "default",
        }))
      )
    );
    setRightWords(
      randomize(
        actualWords.map((item) => ({
          ...item,
          side: "right",
          color: "default",
        }))
      )
    );
  }, []);

  useEffect(() => {
    wordsCheckHandler();
  }, [firstWord, secondWord]);

  useEffect(() => {
    if (gameOver) {
      setTimeout(() => {
        const summaryBtn = document.querySelector(".summary-btn");
        if (summaryBtn) {
          summaryBtn.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [gameOver]);

  const wordsCheckHandler = () => {
    if ((firstWord !== "") & (secondWord === "")) {
      setActualSelected(firstWord);
    }
    if ((firstWord === "") & (secondWord !== "")) {
      setActualSelected(secondWord);
    }

    if ((firstWord !== "") & (secondWord !== "")) {
      if (firstWord._id === secondWord._id) {
        pairCorrect();
      } else {
        pairWrong();
      }
      setFirstWord("");
      setSecondWord("");
      setActualSide("");
    }
  };

  const pairCorrect = () => {
    if (localStorage.getItem("mute") !== "true") {
      const audio = new Audio("/sounds/success.mp3");
      audio.volume = 0.7;
      audio.play();
    }

    setProgress((prev) => prev + 100 / size);
    setCompleteCount((prev) => prev + 1);
    changeColor("success");
    setActualWords((prev) =>
      prev.map((item) => {
        return item._id === firstWord._id && item.fail !== true
          ? { ...item, known: true }
          : item;
      })
    );

    setTimeout(() => {
      setLeftWords((prev) => prev.filter((item) => item.color !== "success"));
      setRightWords((prev) => prev.filter((item) => item.color !== "success"));
    }, 300);
  };
  const pairWrong = () => {
    if (localStorage.getItem("mute") !== "true") {
      const audio = new Audio("/sounds/error.mp3");
      audio.volume = 0.8;
      audio.play();
    }

    setActualWords((prev) =>
      prev.map((item) => {
        return item._id === firstWord._id
          ? { ...item, known: false, fail: true }
          : item;
      })
    );
    changeColor("error");
    setTimeout(() => {
      changeColor("default");
    }, 500);
  };

  useEffect(() => {
    if (completeCount == size) {
      setTimeout(() => {
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
      }, 500);
    }
  }, [completeCount]);

  const changeColor = (color) => {
    setLeftWords([
      ...leftWords.map((item) => {
        if (item._id === firstWord._id) {
          return { ...item, color: color };
        } else return item;
      }),
    ]);

    setRightWords([
      ...rightWords.map((item) => {
        if (item._id === secondWord._id) {
          return { ...item, color: color };
        } else return item;
      }),
    ]);
  };

  if (!hydrated || !leftWords || !rightWords) {
    return (
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-base-300/30">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {showDetails && (
        <div
          className="fixed top-0 left-0 size-full bg-[rgba(0,00,0,0.5)] z-10 grid place-content-center "
          onClick={() => {
            speechHandler("", false);
            setShowDetails(false);
          }}
        >
          <WordDetails word={actualWord} setShowDetails={setShowDetails} />
        </div>
      )}
      <div className="pairs flex justify-center gap-8 max-sm:gap-4 p-4 py-8 w-full ">
        <div className="flex flex-col max-sm:w-full ">
          <AnimatePresence>
            {leftWords.map((word) => (
              <motion.button
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{
                  opacity: { duration: 0.3 },
                  height: {
                    duration: 0.3,
                    delay: 0.15,
                  },
                  marginBottom: { duration: 0.3, delay: 0.15 },
                }}
                className={`mb-4 overflow-hidden flex items-center relative group ${
                  word.color === "dimmed" ? "pointer-events-none" : ""
                } ${word.color === "dimmed" ? " hidden transition-all" : ""}`}
                key={word._id}
                onClick={() => {
                  speechHandler(word.english);
                  setFirstWord(word);
                  setActualSide("left");
                }}
              >
                <PairBlock
                  data={word}
                  actualSelected={actualSelected}
                  actualSide={actualSide}
                  setShowDetails={setShowDetails}
                  setActualWord={setActualWord}
                />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex flex-col max-sm:w-full">
          <AnimatePresence>
            {rightWords.map((word) => (
              <motion.button
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{
                  opacity: { duration: 0.3 },
                  height: {
                    duration: 0.3,
                    delay: 0.15,
                  },
                  marginBottom: { duration: 0.3, delay: 0.15 },
                }}
                className={`mb-4 overflow-hidden flex items-center relative ${
                  word.color === "dimmed" ||
                  word.color === "success" ||
                  word.color === "error"
                    ? "pointer-events-none"
                    : ""
                } ${word.color === "dimmed" ? " hidden transition-all" : ""}`}
                key={word._id}
                onClick={() => {
                  setSecondWord(word);
                  setActualSide("right");
                }}
              >
                <PairBlock
                  data={word}
                  actualSelected={actualSelected}
                  actualSide={actualSide}
                />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {gameOver && (
        <div className="flex flex-col  gap-4 max-w-100 px-4 w-full justify-between summary-btn">
          {actualWords.every((item) => item.known) ? (
            <>
              <ConfettiEffect />
              <p className="text-center text-3xl text-success mb-10 w-fit mx-auto px-6 pb-3 py-2 rounded-xl border-2 border-dotted border-success/50 animate-bounce ">
                Idealnie
              </p>
            </>
          ) : (
            <p className="text-center text-3xl text-success mb-10 w-fit mx-auto px-6 pb-3 py-2 rounded-xl border-2 border-dotted border-success/50 ">
              Koniec
            </p>
          )}

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
            className="btn btn-info w-full relative group "
          >
            <div className="absolute right-3 opacity-0 group-hover:opacity-30 text-black border border-black rounded-sm px-2 pb-[1px]">
              spacja
            </div>
            Przejdź do podsumowania
          </button>
        </div>
      )}
    </div>
  );
};
export default Pairs;
