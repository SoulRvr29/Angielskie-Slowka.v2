"use client";
import { useRouter, useParams, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const [onlyUnknown, setOnlyUnknown] = useState(false);
  const root =
    searchParams.get("type") === "public" ? "zestawy" : "prywatne_zestawy";

  useEffect(() => {
    if (session) {
      if (session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setAdmin(true);
      }
    }
  }, [session]);

  const fetchWordsToLearnOld = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/do_nauczenia`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      // setActualUnknown(data.wordsToLearn);

      return data.wordsToLearn;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWordsKnownOld = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/znane_slowka`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      return data.wordsKnown;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWordsToLearn = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/do_nauczenia`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();

      setWordsSet({
        category: "Słówka do powtórki",
        words: data.wordsToLearn,
      });
      setSize(data.wordsToLearn.length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id !== "zapisane") {
      if (onlyUnknown) {
        setWordsSet((prev) => {
          return {
            ...prev,
            words: prev.words.filter((item) => item.known !== true),
          };
        });
      } else {
        fetchWords();
      }
    }
  }, [onlyUnknown]);

  useEffect(() => {
    setSize(wordsSet?.words?.length);
  }, [wordsSet]);

  useEffect(() => {
    if (id === "zapisane") {
      fetchWordsToLearn();
      return;
    }

    if (session) {
      fetchWordsToLearnOld();
    }
    fetchWords();
  }, []);

  useEffect(() => {
    if (id !== "zapisane") {
      fetchWords();
    }
  }, [session]);

  const fetchWords = async () => {
    if (!id) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/${root}/${id}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setSize(data.words.length);
      setWordsSet(data);
      if (session) {
        const actualUnknown = await fetchWordsToLearnOld();
        const actualKnown = await fetchWordsKnownOld();
        const wordsMapped = data.words.map((word) => {
          const isKnown = actualKnown.some((known) => known._id === word._id);
          const isUnknown = actualUnknown.some(
            (unknown) => unknown._id === word._id
          );
          return isKnown
            ? { ...word, known: true }
            : isUnknown
            ? { ...word, known: false }
            : word;
        });
        setWordsSet({ ...data, words: wordsMapped });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (root !== "zestawy") {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
    if (session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      setAdmin(true);
    }
  }, [root]);

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
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/${root}/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      router.push(`/zestawy?type=${searchParams.get("type")}`);
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
          link={{
            pathname: "/zestawy",
            query: { type: searchParams.get("type") },
          }}
        />
      </div>

      <div className="flex flex-col border max-sm:border-none max-sm:rounded-none w-fit overflow-hidden min-w-lg max-sm:min-w-auto max-sm:w-full rounded-t-md border-primary/50 bg-primary/10">
        <div className="bg-primary/50 w-full font-semibold text-lg px-2 max-sm:py-2 py-1 flex flex-wrap gap-2 justify-between">
          <div>{wordsSet.name}</div>
          <div className="flex gap-2 text-sm">
            {id !== "zapisane" && session && (
              <div className="flex gap-1 items-center border border-neutral/30 px-2 rounded-md">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs"
                  onChange={() => {
                    setOnlyUnknown((prev) => !prev);
                  }}
                />
                <div>ukryj znane</div>
              </div>
            )}
            <div className="flex gap-1 items-center border border-neutral/30 px-2 rounded-md">
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
                className="input input-xs text-base px-1 w-7 "
                value={size}
                min={1}
                max={wordsSet.words.length}
                maxLength={2}
              />{" "}
              <div>
                {size === 1
                  ? "słówko"
                  : size > 1 && size < 5
                  ? "słówka"
                  : size > 20 &&
                    size.toString().slice(-1) < 5 &&
                    size % 10 !== 0
                  ? "słówka"
                  : "słówek"}
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-2 font-semibold">
          {wordsSet.words.map((item, index) => (
            <div
              key={index}
              className={`${
                id === "zapisane"
                  ? "text-error"
                  : item.known === false
                  ? "text-error"
                  : item.known === true
                  ? "text-success"
                  : ""
              }`}
            >
              <span>{item.english}</span> - <span>{item.polish}</span>
            </div>
          ))}
        </div>
        {size > 0 ? (
          <div className="flex w-full">
            <Link
              href={`${
                process.env.NEXT_PUBLIC_DOMAIN
              }/zestawy/${id}/gra?type=${searchParams.get(
                "type"
              )}&size=${size}&game=fiszki&unknown=${onlyUnknown}`}
              className="bg-primary/50 flex justify-center font-semibold text-xl hover:bg-secondary/70 p-2 border-2 border-r-1 border-primary w-full"
            >
              Uruchom fiszki
            </Link>
            <Link
              href={`${
                process.env.NEXT_PUBLIC_DOMAIN
              }/zestawy/${id}/gra?type=${searchParams.get(
                "type"
              )}&size=${size}&game=pary&unknown=${onlyUnknown}`}
              className="bg-primary/50 flex justify-center font-semibold text-xl hover:bg-secondary/70 p-2 border-2 border-l-1 border-primary w-full"
            >
              Uruchom pary
            </Link>
          </div>
        ) : (
          <div className="px-4 py-2 font-semibold opacity-75 -mt-4">
            Lista pusta
          </div>
        )}
      </div>
      {id !== "zapisane" && (
        <>
          {admin && (
            <div className="flex gap-4">
              <Link
                href={{
                  pathname: `${process.env.NEXT_PUBLIC_DOMAIN}/zestawy/${id}/edycja`,
                  query: { type: searchParams.get("type") },
                }}
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
