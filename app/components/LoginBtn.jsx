"use client";
import { useState, useEffect } from "react";
import { signIn, useSession, getProviders } from "next-auth/react";

const LoginBtn = () => {
  const [providers, setProviders] = useState(null);
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
