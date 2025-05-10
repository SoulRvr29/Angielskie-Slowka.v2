"use client";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="flex mt-10 gap-4 flex-col items-center justify-center  text-center">
      <IoIosWarning className="text-error text-6xl animate-pulse" />
      <h2 className="text-4xl text-error">401 - Unauthorized</h2>
      <p>Zaloguj się by mieć dostęp do tej strony.</p>
      <button onClick={() => router.back()} className="btn uppercase">
        <FaArrowLeft />
        wróć
      </button>
    </div>
  );
};
export default NotFound;
