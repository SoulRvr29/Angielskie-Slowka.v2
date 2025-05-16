"use client";
import PairBlock from "./PairBlock";
import { useEffect, useState } from "react";

const Pairs = ({ actualWords, progress, setProgress, size, randomize }) => {
  const [firstWord, setFirstWord] = useState("");
  const [secondWord, setSecondWord] = useState("");
  const [leftWords, setLeftWords] = useState([]);
  const [rightWords, setRightWords] = useState([]);
  const [actualSelected, setActualSelected] = useState("");
  const [actualSide, setActualSide] = useState("");

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
    changeColor("success");
    setTimeout(() => {
      changeColor("dimmed");
    }, 500);
  };
  const pairWrong = () => {
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
    <div className="pairs flex justify-center gap-8 max-sm:gap-4 p-4 ">
      <div className="flex flex-col gap-4 max-sm:w-full ">
        {leftWords.map((word) => (
          <button
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
  );
};
export default Pairs;
