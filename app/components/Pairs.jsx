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
          color: "secondary",
        }))
      )
    );
    setRightWords(
      randomize(
        actualWords.map((item) => ({
          ...item,
          side: "right",
          color: "primary",
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
    console.log("correct");
    setLeftWords([
      ...leftWords.map((item) => {
        if (item._id === firstWord._id) {
          return { ...item, correct: true };
        } else return item;
      }),
    ]);

    setRightWords([
      ...rightWords.map((item) => {
        if (item._id === secondWord._id) {
          return { ...item, correct: true };
        } else return item;
      }),
    ]);

    setProgress((prev) => prev + 100 / size);
    setTimeout(() => {
      setLeftWords([
        ...leftWords.map((item) => {
          if (item._id === firstWord._id) {
            return { ...item, correct: false, color: "base" };
          } else return item;
        }),
      ]);
      setRightWords([
        ...rightWords.map((item) => {
          if (item._id === secondWord._id) {
            return { ...item, correct: false, color: "base" };
          } else return item;
        }),
      ]);
    }, 500);
  };
  const pairWrong = () => {
    console.log("wrong");
    setLeftWords([
      ...leftWords.map((item) => {
        if (item._id === firstWord._id) {
          return { ...item, wrong: true };
        } else return item;
      }),
    ]);

    setRightWords([
      ...rightWords.map((item) => {
        if (item._id === secondWord._id) {
          return { ...item, wrong: true };
        } else return item;
      }),
    ]);

    setProgress((prev) => prev + 100 / size);
    setTimeout(() => {
      setLeftWords([
        ...leftWords.map((item) => {
          if (item._id === firstWord._id) {
            return { ...item, wrong: false };
          } else return item;
        }),
      ]);
      setRightWords([
        ...rightWords.map((item) => {
          if (item._id === secondWord._id) {
            return { ...item, wrong: false };
          } else return item;
        }),
      ]);
    }, 500);
  };

  return (
    <div className="flex justify-center gap-8 max-sm:gap-4 p-4 ">
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
              word={word.english}
              color={word.color}
              correct={word.correct}
              wrong={word.wrong}
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
              word={word.polish}
              color={word.color}
              correct={word.correct}
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
