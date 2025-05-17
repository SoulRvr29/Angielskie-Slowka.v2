import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FaWindowClose, FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { speechHandler } from "@/utils/speechHandler";

const WordDetailsLine = ({ data, title, actualLine, setActualLine }) => {
  const [play, setPlay] = useState(false);
  if (!data) return <></>;

  const onEndCallback = () => {
    setPlay(false);
    setActualLine(null);
  };

  useEffect(() => {
    if (actualLine !== title) {
      setPlay(false);
    }
  }, [actualLine]);

  return (
    <div className="flex justify-between gap-2 border-b border-base-content/20 pb-2 ">
      <div>
        <span className="font-bold capitalize text-info">{title}:</span>{" "}
        {data || "Brak"}
      </div>
      {(title === "definicja" ||
        title === "przykład" ||
        title === "synonimy") && (
        <button
          className="hover:text-info"
          onClick={() => {
            setPlay((prev) => !prev);
            speechHandler(data, play, onEndCallback);
            if (actualLine !== title) {
              setActualLine(title);
            }
          }}
        >
          {!play ? <FaPlayCircle size={20} /> : <FaPauseCircle size={20} />}
        </button>
      )}
    </div>
  );
};

const WordDetails = ({ word, setShowDetails }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [actualLine, setActualLine] = useState(null);

  useEffect(() => {
    const loadWord = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/zestawy/${id}/gra/${word}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Błąd pobierania");
        setData(data);
      } catch (err) {
        setError(err.message || "Nieznany błąd");
      } finally {
        setLoading(false);
      }
    };
    loadWord();
  }, []);

  return (
    <div
      className="relative flex flex-col border-2 border-base-content/20 rounded-xl p-4 pt-2 bg-base-300 shadow-xl max-w-xl min-w-xl max-sm:min-w-auto max-sm:w-screen max-sm:rounded-none max-[560px]:border-x-0"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {" "}
      <button
        className="absolute right-4 top-3 hover:text-error"
        onClick={() => {
          speechHandler("", false);
          setShowDetails(false);
        }}
      >
        <FaWindowClose size={20} />
      </button>
      {loading && <p className="mr-8">Ładowanie...</p>}
      {error && <p className="mr-8">{error}</p>}
      {data && (
        <div className=" text-sm">
          <div className="flex justify-between items-center border-b mb-2 pb-2">
            <h3 className="text-2xl font-semibold capitalize">{data.word}</h3>
          </div>

          <div className="flex flex-col gap-2">
            <WordDetailsLine
              actualLine={actualLine}
              setActualLine={setActualLine}
              data={data.definition}
              title="definicja"
            />
            <WordDetailsLine
              actualLine={actualLine}
              setActualLine={setActualLine}
              data={data.example}
              title="przykład"
            />
            <WordDetailsLine
              actualLine={actualLine}
              setActualLine={setActualLine}
              data={data.synonyms.length > 0 ? data.synonyms.join(", ") : null}
              title="synonimy"
            />
            <WordDetailsLine
              actualLine={actualLine}
              setActualLine={setActualLine}
              data={data.phonetic}
              title="fonetycznie"
            />
            {/* <WordDetailsLine
              actualLine={actualLine}
              setActualLine={setActualLine}
              data={data.partOfSpeech}
              title="część mowy"
            /> */}
          </div>

          <div className="text-xs opacity-30 mt-2">
            Źródło:{" "}
            {data.source === "oxford"
              ? "Oxford Dictionary API"
              : "Free Dictionary API"}
          </div>
        </div>
      )}
    </div>
  );
};

export default WordDetails;
