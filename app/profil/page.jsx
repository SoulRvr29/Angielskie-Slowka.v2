"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const ProfilPage = () => {
  const [autoSave, setAutoSave] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/profil`);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setProfileData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
    setAutoSave(JSON.parse(localStorage.getItem("autoSave")) || false);
  }, []);

  const {
    email,
    username,
    image,
    createdAt,
    wordSets,
    wordsToLearn,
    wordsKnown,
  } = profileData || {};

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", options);
  };

  if (!profileData) {
    return (
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-base-300/30">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {profileData && (
        <div className="flex flex-col items-center min-w-sm max-sm:min-w-auto gap-2 p-4 bg-info/10 w-fit mx-auto rounded-lg shadow-lg justify-center mt-8 max-sm:w-[90vw] border-2 border-info wrap-anywhere">
          {image && (
            <Image src={image} width={100} height={100} alt="profile image" />
          )}
          <div className="w-full mt-2 ">
            <p>
              <span className="font-semibold text-info">Login:</span> {username}
            </p>
            <p>
              <span className="font-semibold text-info ">Mail:</span> {email}
            </p>
            <p>
              <span className="font-semibold text-info">Data rejestracji:</span>{" "}
              {formatDate(createdAt)}
            </p>
            <hr className="border-dotted border-info my-2" />
            <p>
              <span className="font-semibold text-info">
                Utworzone kategorie:
              </span>{" "}
              {wordSets.length}
            </p>
            <p>
              <span className="font-semibold text-info">
                Utworzone zestawy:
              </span>{" "}
              {wordSets.reduce((acc, wordSet) => acc + wordSet.sets.length, 0)}
            </p>
            <p>
              <span className="font-semibold text-info">Utworzone słówka:</span>{" "}
              {wordSets.reduce(
                (acc, wordSet) =>
                  acc +
                  wordSet.sets.reduce((acc, set) => acc + set.words.length, 0),
                0
              )}
            </p>
            <hr className="border-dotted border-info my-2" />
            <p>
              <span className="font-semibold text-info">
                Słówka do powtórki:
              </span>{" "}
              {wordsToLearn.length}
            </p>
            <p>
              <span className="font-semibold text-info">Słówka nauczone:</span>{" "}
              {wordsKnown.length}
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            className="checkbox checkbox-sm max-sm:checkbox-lg"
            type="checkbox"
            defaultChecked={autoSave}
            onChange={(e) => {
              setAutoSave(e.target.checked);
              localStorage.setItem(
                "autoSave",
                JSON.stringify(e.target.checked)
              );
            }}
          />
          Autozapis
        </div>
        <Link
          className="btn btn-info btn-lg "
          href={{
            pathname: "/zestawy",
            query: { type: "private" },
          }}
          onClick={() => setDropdownOpen(false)}
        >
          Moje słówka
        </Link>
        <button
          className="btn btn-lg"
          onClick={() => {
            signOut({ callbackUrl: "/" });
          }}
        >
          Wyloguj
        </button>
      </div>
    </div>
  );
};
export default ProfilPage;
