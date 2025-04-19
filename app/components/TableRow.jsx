"use client";
import { FaWindowClose } from "react-icons/fa";

const TableRow = ({ index, formData, setFormData, deleteRow }) => {
  const updateForm = (key, data) => {
    const updatedFormData = [...formData];
    updatedFormData[index] = {
      ...updatedFormData[index],
      [key]: data,
    };
    setFormData(updatedFormData);
  };

  return (
    <>
      <tr>
        <th className="max-sm:p-2 text-center">{index + 1}</th>
        <td className="max-sm:p-0 max-sm:pb-2">
          <input
            onChange={(e) => {
              updateForm("ang", e.target.value);
            }}
            value={formData[index].ang}
            type="text"
            required
            id={"ang" + index}
            className="input"
          />
        </td>
        <td className="max-sm:p-0 max-sm:pb-2 max-sm:px-2">
          <input
            onChange={(e) => {
              updateForm("pl", e.target.value);
            }}
            value={formData[index].pl}
            type="text"
            required
            id={"pl" + index}
            className="input"
          />
        </td>
        <td>
          <FaWindowClose
            className="btn btn-xs btn-square"
            onClick={() => {
              if (formData.length > 1) deleteRow(index);
            }}
          />
        </td>
      </tr>
    </>
  );
};
export default TableRow;
