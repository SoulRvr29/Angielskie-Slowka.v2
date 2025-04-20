"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaArrowDown } from "react-icons/fa";
import FormRow from "@/app/components/FormRow";
import { useState } from "react";
import SubNav from "@/app/components/SubNav";

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
      <SubNav
        title={`Kategoria: ${category}`}
        text="wróć do zestawów"
        link="/zestawy"
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
      </div>
    </div>
  );
};
export default NowyZestawPage;
