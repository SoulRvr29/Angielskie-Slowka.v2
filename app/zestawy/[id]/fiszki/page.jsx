"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SubNav from "@/app/components/SubNav";

const FiszkiPage = () => {
  const [wordsSet, setWordsSet] = useState(null);
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
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-base-300/30">
        <span className="loader"></span>
      </div>
    );
  }

  console.log(wordsSet);
  return (
    <div>
      <SubNav
        title={wordsSet.name}
        text="Wróć do zestawu"
        link={`/zestawy/${id}`}
      />
      <div className="flex flex-col items-center">
        {/* <div className="flex flex-col gap-2 border rounded-md p-2 mt-4">
          {wordsSet.sets[0].words.map((item) => (
            <div className="flex gap-2">
              <p>{item.english}</p> - <p>{item.polish}</p>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};
export default FiszkiPage;
