"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const ProfilPage = () => {
  const { data: session } = useSession();

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
  }, []);

  const { email, username, image, createdAt, wordSets } = profileData || {};

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", options);
  };

  return (
    <div className="flex flex-col gap-4">
      {profileData ? (
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
            <p>
              <span className="font-semibold text-info">Zapisane słówka:</span>{" "}
              {JSON.parse(
                localStorage.getItem("nieZnaneSlowka")[0].length || 0
              )}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 p-4 bg-base-300 w-fit mx-auto rounded-lg shadow-lg justify-center mt-8 max-sm:w-[90vw]">
          <p>Ładowanie...</p>
        </div>
      )}
      <div className="flex flex-col items-center gap-4">
        <Link
          className="btn btn-info btn-lg "
          href="/zestawy"
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
