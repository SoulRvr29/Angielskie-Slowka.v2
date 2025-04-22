"use client";
import { useRouter, useParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect, useState } from "react";

const Set = () => {
  const [wordsSet, setWordsSet] = useState(null);
  const router = useRouter();
  const { id } = useParams();

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
      } catch (error) {
        console.error(error);
      }
    };

    fetchWords(id);
  }, []);

  if (!wordsSet) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-base-300/30">
        <span className="loader"></span>
      </div>
    );
  }

  const deleteHandler = async () => {
    console.log({
      id: wordsSet["_id"],
    });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/zestawy/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <button
        onClick={() => router.back()}
        className="my-2 gap-2 items-center btn btn-sm"
      >
        <FaArrowLeft />
        wróć do zestawów
      </button>
      <div className="flex flex-col border w-fit overflow-hidden min-w-lg max-sm:min-w-auto max-sm:w-full rounded-md border-primary/50 bg-primary/10">
        <div className="bg-primary/50 w-full font-semibold text-lg px-2 flex flex-wrap gap-2 justify-between">
          <div>{wordsSet.name}</div>
          <div>{wordsSet.words.length} słówek</div>
        </div>
        <div className="px-4 py-2">
          {wordsSet.words.map((item) => (
            <div key={item.english}>
              <span>{item.english}</span> - <span>{item.polish}</span>
            </div>
          ))}
        </div>
      </div>
      <button onClick={deleteHandler} className="btn btn-error">
        Usuń zestaw
      </button>
    </div>
  );
};
export default Set;
