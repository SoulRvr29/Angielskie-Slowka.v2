"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaArrowDown } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import FormRow from "@/app/components/FormRow";
import { useState } from "react";
import SubNav from "@/app/components/SubNav";

const NowyZestawPage = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const router = useRouter();
  const [formData, setFormData] = useState([{ english: "", polish: "" }]);
  const [importField, setImportField] = useState(false);

  const addNewRow = () => {
    setFormData([...formData, { english: "", polish: "" }]);
    console.log(formData);
  };

  const deleteRow = (indexToDelete) => {
    const newFormData = formData.filter((_, i) => i !== indexToDelete);
    setFormData(newFormData);
  };

  const handleForm = (e) => {
    console.log({ name: e.target[0].value, words: formData });
    const createWordSet = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/zestawy`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              category: category,
              name: e.target[0].value,
              words: formData,
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Failed to create word set");
        }
        const data = await res.json();
        console.log("Word set created:", data);
        router.push("/zestawy");
      } catch (error) {
        console.error(error);
      }
    };

    createWordSet();
  };

  const parseWords = (text) => {
    const lines = text.split("\n");
    const parsedText = lines
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && line.includes("-"))
      .map((line) => {
        const [english, polish] = line.split("-").map((part) => part.trim());
        return { english, polish };
      });

    return parsedText;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = parseWords(event.target.result);

      setFormData(text);
      setImportField(false);
    };

    reader.readAsText(file);
  };

  const handlePasteText = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        setError("Schowek jest pusty!");
        return;
      }
      const parsedText = parseWords(text);
      setFormData(parsedText);
      setImportField(false);
    } catch (err) {
      setError("Błąd podczas odczytu schowka.");
    }
  };

  return (
    <div>
      <SubNav
        title={`Kategoria: ${category}`}
        text="wróć do zestawów"
        link="/zestawy"
      />
      <div className="flex justify-center">
        {" "}
        <button
          onClick={() => router.push("/zestawy")}
          className="my-2 max-sm:mb-0 gap-2 items-center btn btn-sm"
        >
          <FaArrowLeft />
          wróć do zestawów
        </button>
      </div>
      <div>
        <form
          className="flex flex-col gap-4 max-w-xl mx-auto "
          onSubmit={(e) => {
            e.preventDefault();
            handleForm(e);
          }}
        >
          <div className="flex flex-col pl-10">
            <label className="max-sm:text-base font-semibold text-sm opacity-70 pb-2">
              Nazwa zestawu
            </label>
            <input type="text" className="input max-w-58" required />
          </div>
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Słówko </th>
                <th>Tłumaczenie</th>
              </tr>
            </thead>
            <tbody>
              {formData.map((row, index) => (
                <FormRow
                  key={index}
                  index={index}
                  formData={formData}
                  setFormData={setFormData}
                  deleteRow={deleteRow}
                />
              ))}
            </tbody>
          </table>
          <div className="flex justify-between px-2">
            <div onClick={() => addNewRow()} className="btn">
              <FaArrowDown /> dodaj
            </div>
            <button type="submit" className="btn btn-outline btn-success ">
              Stwórz zestaw
            </button>
          </div>
        </form>
        <div className="flex justify-between gap-2 max-w-xl mx-auto items-start my-4 px-2 border-t border-base-content/30 pt-4">
          <button onClick={() => handlePasteText()} className="btn btn-xs ">
            wklej ze schowka
          </button>
          {importField ? (
            <fieldset className="fieldset bg-base-200 rounded-md p-4 relative">
              <button
                onClick={() => setImportField(false)}
                className="absolute -top-7 right-2 hover:text-secondary"
              >
                <IoMdCloseCircle size={30} />
              </button>
              <legend className="fieldset-legend">Import z pliku</legend>
              <input
                type="file"
                accept=".txt"
                className="file-input file-input-sm file-input-secondary"
                onChange={(e) => handleFileChange(e)}
              />
              <label className="mt-4 label">Przykład formatowania:</label>
              <pre className="opacity-70 border rounded-sm border-base-content/20 p-2">
                cat - kot{"\n"}
                dog - pies{"\n"}
                apple - jabłko
              </pre>
            </fieldset>
          ) : (
            <button
              onClick={() => setImportField(true)}
              className="btn btn-xs "
            >
              importuj z pliku
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default NowyZestawPage;
