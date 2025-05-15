"use client";
import PairBlock from "./PairBlock";
import { useEffect, useState } from "react";

const Pairs = ({ actualWords, progress, setProgress, size, randomize }) => {
  const [firstWord, setFirstWord] = useState("");
  const [secondWord, setSecondWord] = useState("");
  const [leftWords, setLeftWords] = useState([]);
  const [rightWords, setRightWords] = useState([]);

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
      console.log(firstWord);
    }
    if ((firstWord === "") & (secondWord !== "")) {
      console.log(secondWord);
    }

    if ((firstWord !== "") & (secondWord !== "")) {
      if (firstWord._id === secondWord._id) {
        setLeftWords([
          ...leftWords.map((item) => {
            if (item._id === firstWord._id) {
              return { ...item, color: "base" };
            } else return item;
          }),
        ]);
        setRightWords([
          ...rightWords.map((item) => {
            if (item._id === secondWord._id) {
              return { ...item, color: "base" };
            } else return item;
          }),
        ]);
        setProgress((prev) => prev + 100 / size);
      }
      setFirstWord("");
      setSecondWord("");
    }
    // console.log(leftWords, rightWords);
  };

  return (
    <div className="flex justify-center gap-8 max-sm:gap-4 p-4 ">
      <div className="flex flex-col gap-4 max-sm:w-full ">
        {leftWords.map((word) => (
          <button
            key={word._id}
            onClick={() => {
              setFirstWord(word);
            }}
          >
            <PairBlock word={word.english} color={word.color} />
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-4 max-sm:w-full">
        {rightWords.map((word) => (
          <button
            key={word._id}
            onClick={() => {
              setSecondWord(word);
            }}
          >
            <PairBlock word={word.polish} color={word.color} />
          </button>
        ))}
      </div>
    </div>
  );
};
export default Pairs;
