"use client";
import { useState, useEffect } from "react";
import ConfettiEffect from "./ConfettiEffect";

const Typing = ({
  actualWords,
  wordIndex,
  size,
  gameOver,
  saveInProgress,
  setActualWords,
  setWordIndex,
  setProgress,
  setShowResults,
  setSaved,
  setAutoSave,
  setGameOver,
  updateSavedWords,
}) => {
  const [inputText, setInputText] = useState("");
  const [activeLetterIndex, setActiveLetterIndex] = useState(0);
  const [hints, setHints] = useState(3);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (actualWords.length !== wordIndex) {
        const currentWord = actualWords[wordIndex].english;

        if (e.key === "Enter") {
          wordCheck();
        }
        // else if (e.key === "Backspace") {
        //   if (inputText.length > 0) {
        //     // If previous letter is a space, skip it
        //     let newIndex = inputText.length - 1;
        //     if (currentWord[newIndex] === " " && newIndex > 0) {
        //       newIndex--;
        //     }
        //     setInputText((prev) => prev.slice(0, newIndex));
        //     setActiveLetterIndex(newIndex);
        //   }
        // }
        else if (e.key === "Control") {
          hintsHandler();
        }
        // else if (/^[a-zA-Z]$/.test(e.key)) {
        //   updateText(e.key);
        // }
      } else if (e.key === " " || e.key === "Enter") {
        setShowResults(true);
      }
      console.log(e.key);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputText, actualWords, wordIndex]);

  const updateText = (inputText) => {
    const currentWord = actualWords[wordIndex].english;

    let nextIndex = inputText.length;
    // If next letter is a space, skip it
    // if (currentWord[nextIndex] === " ") {
    //   setInputText((prev) => prev + " ");
    //   setActiveLetterIndex((prev) => prev + 1);
    //   nextIndex++;
    // }
    setActiveLetterIndex(inputText.length);
    if (inputText.length <= currentWord.length) {
      setInputText(inputText);
      // setActiveLetterIndex((prev) => prev + 1);
      // if (currentWord[nextIndex + 1] === " ") {
      // setInputText((prev) => prev + " ");
      // setActiveLetterIndex((prev) => prev + 1);
      // }
    }
  };

  const wordCheck = () => {
    if (actualWords.length !== wordIndex) {
      if (actualWords[wordIndex].english === inputText) {
        if (localStorage.getItem("mute") !== "true") {
          const audio = new Audio("/sounds/card-known.mp3");
          audio.volume = 0.4;
          audio.play();
        }
      } else {
        if (localStorage.getItem("mute") !== "true") {
          const audio = new Audio("/sounds/card-unknown.mp3");
          audio.volume = 0.5;
          audio.play();
        }
      }
      if (actualWords[wordIndex].english[inputText.length] === " ") {
        setWordIndex((prev) => prev + 2);
      } else {
        setWordIndex((prev) => prev + 1);
      }
      setProgress((prev) => prev + 100 / size);
      setInputText("");
      setActiveLetterIndex(0);
      setHints(3);
      // Focus the input after checking the word
      const inputEl = document.querySelector('input[type="text"]');
      if (inputEl) {
        inputEl.focus();
      }
    }
    if (inputText === actualWords[wordIndex].english) {
      setActualWords((prev) =>
        prev.map((item, index) =>
          index === wordIndex ? { ...item, known: true } : item
        )
      );
    }
  };

  useEffect(() => {
    if (actualWords.length === wordIndex) {
      if (localStorage.getItem("mute") !== "true") {
        if (actualWords.every((item) => item.known)) {
          const audio = new Audio("/sounds/perfect.mp3");
          const audio2 = new Audio("/sounds/fireworks.mp3");
          audio.volume = 0.8;
          audio2.volume = 0.5;
          audio2.play();
          audio.play();
        } else {
          const audio = new Audio("/sounds/finish.mp3");
          audio.volume = 0.3;
          audio.play();
        }
      }
      setGameOver(true);
      setProgress(100);
      setAutoSave(JSON.parse(localStorage.getItem("autoSave") || false));
      if (JSON.parse(localStorage.getItem("autoSave"))) {
        updateSavedWords(actualWords.slice(0, size));
        setSaved(true);
      }
    }
  }, [wordIndex]);

  const hintsHandler = () => {
    if (hints > 0) {
      const currentWord = actualWords[wordIndex]?.english;
      // Find the first wrong letter index
      let nextLetterIndex = 0;
      while (
        nextLetterIndex < inputText.length &&
        inputText[nextLetterIndex] === currentWord[nextLetterIndex]
      ) {
        nextLetterIndex++;
      }

      if (nextLetterIndex < currentWord.length) {
        let newInput = inputText.slice(0, nextLetterIndex);

        // If the next letter is a space, add it and move to the next letter
        if (currentWord[nextLetterIndex] === " ") {
          newInput += " ";
          nextLetterIndex++;
        }

        // Add the next correct letter if within bounds
        if (nextLetterIndex < currentWord.length) {
          newInput += currentWord[nextLetterIndex];
        }

        setInputText(newInput);
        setActiveLetterIndex(newInput.length);
        setHints((prev) => prev - 1);
        const inputEl = document.querySelector('input[type="text"]');
        if (inputEl) {
          inputEl.focus();
        }
        if (currentWord[nextLetterIndex + 1] === " ") {
          setInputText((prev) => prev + " ");
          setActiveLetterIndex((prev) => prev + 1);
        }
      }
    }
  };
  return (
    <>
      {!gameOver ? (
        <div className="relative flex flex-col justify-center items-center mt-20 gap-8">
          <p className=" text-2xl p-3 pb-4 px-5 border-2 border-primary rounded-xl ">
            {actualWords[wordIndex]?.polish}
          </p>
          <div className="relative flex gap-1 ">
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                updateText(e.target.value.toLowerCase());
              }}
              className="absolute border -top-8 input-primary w-full px-2 tracking-[20px] text-3xl opacity-100 pointer-events-auto"
              autoFocus
              inputMode="text"
              autoComplete="off"
              spellCheck={false}
            />
            {actualWords[wordIndex]?.english.split("").map((letter, index) => (
              <span
                className={`text-3xl w-8 h-10 text-center px-1 ${
                  letter !== " "
                    ? "border-b-2 border-base-content"
                    : "border-b-2 border-base-content/20"
                } ${
                  index === activeLetterIndex
                    ? "border-secondary underline-active"
                    : ""
                } ${
                  letter === inputText[index] ? "text-success" : "text-error"
                }`}
                key={index}
              >
                {inputText[index] || ""}
              </span>
            ))}
          </div>
          <div className="flex gap-4 mt-2 max-w-100 w-full justify-center">
            <button
              className="relative group btn btn-warning btn-sm w-45"
              onClick={() => hintsHandler()}
            >
              dodaj literkę{" "}
              <span className="border rounded-full size-5 grid place-content-center">
                {hints}
              </span>
              <div className="absolute right-1 opacity-0 group-hover:opacity-30 text-black border border-black rounded-sm px-1 pb-[1px]">
                ctrl
              </div>
            </button>
            <button
              className="relative group btn btn-success btn-sm w-45"
              onClick={() => wordCheck()}
            >
              przejdź dalej
              <div className="absolute right-1 opacity-0 group-hover:opacity-30 text-black border border-black rounded-sm px-1 pb-[1px]">
                enter
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col mt-20 mx-auto gap-4 max-w-100 px-4 w-full justify-between summary-btn">
          {actualWords.every((item) => item.known) ? (
            <>
              <ConfettiEffect />
              <p className="text-center text-3xl text-success mb-10 w-fit mx-auto px-6 pb-3 py-2 rounded-xl border-2 border-dotted border-success/50 animate-bounce ">
                Idealnie
              </p>
            </>
          ) : (
            <p className="text-center text-3xl text-success mb-10 w-fit mx-auto px-6 pb-3 py-2 rounded-xl border-2 border-dotted border-success/50 animate-bounce">
              Koniec
            </p>
          )}

          {saveInProgress ? (
            <button className="btn btn-success w-full relative group animate-pulse ">
              Trwa zapisywanie...
            </button>
          ) : (
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
          )}
        </div>
      )}
    </>
  );
};
export default Typing;
