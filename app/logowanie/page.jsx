"use client";
import { useState } from "react";

const LogowaniePage = () => {
  const [loginOrRegister, setLoginOrRegister] = useState(true);
  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      {loginOrRegister ? (
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 mx-auto">
          <legend className="fieldset-legend text-xl relative bottom-0.5">
            Logowanie
          </legend>

          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            placeholder="example@gmail.com"
          />

          <label className="label">Hasło</label>
          <input type="password" className="input" placeholder="••••••••" />

          <button className="btn btn-neutral mt-4">Login</button>
        </fieldset>
      ) : (
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 mx-auto">
          <legend className="fieldset-legend text-xl relative bottom-0.5">
            Rejestracja
          </legend>

          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            placeholder="example@gmail.com"
          />

          <label className="label">Hasło</label>
          <input type="password" className="input" placeholder="••••••••" />

          <label className="label">Powtórz hasło</label>
          <input type="password" className="input" placeholder="••••••••" />

          <button className="btn btn-neutral mt-4">Login</button>
        </fieldset>
      )}
      {loginOrRegister ? (
        <p>
          Nie masz konta?{" "}
          <button
            onClick={() => {
              setLoginOrRegister((prev) => !prev);
            }}
            className="text-error font-semibold hover:underline"
          >
            Zarejestruj
          </button>
        </p>
      ) : (
        <p>
          Masz już konto?{" "}
          <button
            onClick={() => {
              setLoginOrRegister((prev) => !prev);
            }}
            className="text-error font-semibold hover:underline"
          >
            Zaloguj
          </button>
        </p>
      )}
    </div>
  );
};
export default LogowaniePage;
