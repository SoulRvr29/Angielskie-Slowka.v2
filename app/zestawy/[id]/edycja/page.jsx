"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowDown, FaArrowLeft } from "react-icons/fa";
import FormRow from "@/app/components/FormRow";
import SubNav from "@/app/components/SubNav";

const EdycjaPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [wordsSet, setWordsSet] = useState();
  const [formData, setFormData] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchWords = async (id) => {
      if (!id) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/zestawy/${id}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();

        const singleSet = data;
        setWordsSet(singleSet);
        setFormData(singleSet.words);
        setName(singleSet.name);
        setCategory(singleSet.category);
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

  const addNewRow = () => {
    setFormData([...formData, { english: "", polish: "" }]);
  };

  const deleteRow = (indexToDelete) => {
    const newFormData = formData.filter((_, i) => i !== indexToDelete);
    setFormData(newFormData);
  };

  const handleForm = (e) => {
    const editWordSet = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/zestawy/${id}/edycja`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              updateData: {
                name: name,
                words: formData,
              },
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Failed to create word set");
        }
        const data = await res.json();
        console.log("Word set created:", data);
        router.push(`/zestawy/${id}`);
      } catch (error) {
        console.error(error);
      }
    };

    editWordSet();
  };

  return (
    <div>
      <SubNav
        title="Edycja zestawu"
        text="wróć do zestawu"
        link={`/zestawy/${id}`}
      />
      <div>
        <form
          className="flex flex-col gap-4 max-w-xl mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            handleForm(e);
          }}
        >
          <div className="flex flex-col pl-10">
            <label className="max-sm:text-base font-semibold text-sm opacity-70 pb-2">
              Nazwa zestawu
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input max-w-58"
              required
            />
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
              Aktualizuj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EdycjaPage;
