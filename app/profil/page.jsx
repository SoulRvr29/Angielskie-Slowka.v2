"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";

const ProfilPage = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-base-300 w-fit mx-auto rounded-lg shadow-lg justify-center mt-8 max-sm:w-[90vw] font-semibold">
      <Image src={profileImage} width={100} height={100} alt="profile image" />
      <p>{session?.user.name}</p>
      <p>{session?.user.email}</p>
    </div>
  );
};
export default ProfilPage;
