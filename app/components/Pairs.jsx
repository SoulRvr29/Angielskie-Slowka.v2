"use client";
import PairBlock from "./PairBlock";
import { useEffect, useState } from "react";

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
  const [leftWords, setLeftWords] = useState([]);
  const [rightWords, setRightWords] = useState([]);
  const [actualSelected, setActualSelected] = useState("");
  const [actualSide, setActualSide] = useState("");
  const [completeCount, setCompleteCount] = useState(0);

  useEffect(() => {
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
      changeColor("dimmed");
    }, 500);
  };

  useEffect(() => {
    if (completeCount == size) {
      setGameOver(true);
      setProgress(100);
    }
  }, [completeCount]);

  const pairWrong = () => {
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

  if (!leftWords || !rightWords) {
    return (
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-base-300/30">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="pairs flex justify-center gap-8 max-sm:gap-4 p-4 py-8 ">
        <div className="flex flex-col gap-4 max-sm:w-full ">
          {leftWords.map((word) => (
            <button
              className={`${
                word.color === "dimmed" ? "pointer-events-none" : ""
              }`}
              key={word._id}
              onClick={() => {
                setFirstWord(word);
                setActualSide("left");
              }}
            >
              <PairBlock
                data={word}
                actualSelected={actualSelected}
                actualSide={actualSide}
              />
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-4 max-sm:w-full">
          {rightWords.map((word) => (
            <button
              className={`${
                word.color === "dimmed" ||
                word.color === "success" ||
                word.color === "error"
                  ? "pointer-events-none"
                  : ""
              }`}
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
            </button>
          ))}
        </div>
      </div>

      {gameOver && (
        <div className="flex gap-4 max-w-100 px-4 w-full justify-between summary-btn">
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
