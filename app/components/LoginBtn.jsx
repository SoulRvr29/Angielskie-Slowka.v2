"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { usePathname } from "next/navigation";

const LoginBtn = () => {
  const [providers, setProviders] = useState(null);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setAuthProviders();
  }, []);

  return (
    <>
      {providers &&
        Object.values(providers).map((provider, index) => (
          <button
            key={index}
            className={`btn btn-xl ${session && "hidden"} `}
            onClick={() => {
              signIn(provider.id);
            }}
          >
            Zaloguj
          </button>
        ))}
    </>
  );
};

export default LoginBtn;
