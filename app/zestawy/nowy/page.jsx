"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaArrowDown } from "react-icons/fa";
import FormRow from "@/app/components/FormRow";
import { useState } from "react";

const NowyZestawPage = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const router = useRouter();
  const [formData, setFormData] = useState([
    { ang: "", pl: "" },
    { ang: "", pl: "" },
    { ang: "", pl: "" },
  ]);

  const addNewRow = () => {
    setFormData([...formData, { ang: "", pl: "" }]);
    console.log(formData);
  };

  const deleteRow = (indexToDelete) => {
    const newFormData = formData.filter((_, i) => i !== indexToDelete);
    setFormData(newFormData);
  };

  const handleForm = (e) => {
    console.log({ name: e.target[0].value, data: formData });
  };

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="my-2 gap-2 items-center btn btn-sm"
      >
        <FaArrowLeft />
        wróć do zestawów
      </button>

      <div>
        <form
          className="flex flex-col gap-4 max-w-xl mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            handleForm(e);
          }}
        >
          <h2 className="text-secondary">Kategoria: {category}</h2>
          <div className="flex flex-col mx-auto px-2">
            <label className="max-sm:text-base font-semibold text-sm opacity-70 pb-2">
              Nazwa zestawu:{" "}
            </label>
            <input type="text" className="input max-w-50" required />
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
          <div className="flex justify-between ">
            <div onClick={() => addNewRow()} className="btn ">
              <FaArrowDown /> dodaj
            </div>
            <button type="submit" className="btn btn-outline btn-secondary ">
              Stwórz zestaw
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default NowyZestawPage;
