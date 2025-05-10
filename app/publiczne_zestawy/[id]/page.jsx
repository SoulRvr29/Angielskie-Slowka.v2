"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import SubNav from "@/app/components/SubNav";
import { useSession } from "next-auth/react";

const Set = () => {
  const [wordsSet, setWordsSet] = useState(null);
  const router = useRouter();
  const { id } = useParams();
  const [size, setSize] = useState(0);
  const { data: session } = useSession();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (session) {
      if (session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setAdmin(true);
      }
    }
  }, [session]);

  useEffect(() => {
    if (id === "zapisane") {
      setWordsSet({
        category: "Zapisane słówka",
        words: JSON.parse(localStorage.getItem("nieZnaneSlowka")),
      });
      setSize(JSON.parse(localStorage.getItem("nieZnaneSlowka")).length);
      return;
    }
    const fetchWords = async (id) => {
      if (!id) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/publiczne_zestawy/${id}`
        );
        console.log(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/publiczne_zestawy/${id}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setWordsSet(data);
        setSize(data.words.length);
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

  const deleteHandler = async () => {
    const result = confirm("Potwierdź usunięcie");
    if (!result) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/publiczne_zestawy/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      router.push("/publiczne_zestawy");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="w-full">
        <SubNav
          title={wordsSet.category}
          text="wróć do listy"
          link="/publiczne_zestawy"
        />
      </div>

      <div className="flex flex-col border max-sm:border-none max-sm:rounded-none w-fit overflow-hidden min-w-lg max-sm:min-w-auto max-sm:w-full rounded-t-md border-primary/50 bg-primary/10">
        <div className="bg-primary/50 w-full font-semibold text-lg px-2 max-sm:py-2 py-1 flex flex-wrap gap-2 justify-between">
          <div>{wordsSet.name}</div>
          <div className="flex gap-1 items-center">
            <div>słówek:</div>
            <input
              type="text"
              pattern="[0-9]*"
              onChange={(e) => {
                const input = e.target.value;
                if (/^\d{0,2}$/.test(input)) {
                  if (parseInt(input) > wordsSet.words.length) {
                    setSize(wordsSet.words.length);
                  } else if (parseInt(input) > 0 || input === "") {
                    setSize(input === "" ? "" : parseInt(input));
                  }
                }
              }}
              onFocus={() => setSize("")}
              onBlur={() => {
                if (size === "") {
                  setSize(wordsSet.words.length);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.target.blur();
                }
              }}
              className="input input-xs text-base px-1 w-7"
              value={size}
              min={1}
              max={wordsSet.words.length}
              maxLength={2}
            />
          </div>
        </div>
        <div className="px-4 py-2">
          {wordsSet.words.map((item, index) => (
            <div key={index}>
              <span>{item.english}</span> - <span>{item.polish}</span>
            </div>
          ))}
        </div>
        <Link
          href={`${process.env.NEXT_PUBLIC_DOMAIN}/publiczne_zestawy/${id}/fiszki?size=${size}`}
          className="bg-primary/50 flex justify-center font-semibold text-xl hover:bg-primary p-2 border-2 border-primary"
        >
          Uruchom zestaw
        </Link>
      </div>
      {id !== "zapisane" && (
        <>
          {admin && (
            <div className="flex gap-4">
              <Link
                href={`${process.env.NEXT_PUBLIC_DOMAIN}/publiczne_zestawy/${id}/edycja`}
                className="btn btn-info"
              >
                Edytuj
              </Link>
              <button onClick={deleteHandler} className="btn btn-error">
                Usuń
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default Set;
