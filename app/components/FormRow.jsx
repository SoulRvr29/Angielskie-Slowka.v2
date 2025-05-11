"use client";
import { FaWindowClose } from "react-icons/fa";
import { FaArrowRightArrowLeft } from "react-icons/fa6";

const TableRow = ({ index, formData, setFormData, deleteRow }) => {
  const updateForm = (key, data) => {
    const updatedFormData = [...formData];
    updatedFormData[index] = {
      ...updatedFormData[index],
      [key]: data,
    };
    setFormData(updatedFormData);
  };

  const changeOrder = () => {
    const updatedFormData = [...formData];
    updatedFormData[index] = {
      ...updatedFormData[index],
      english: formData[index].polish,
      polish: formData[index].english,
    };
    setFormData(updatedFormData);
  };

  return (
    <>
      <tr>
        <th className="text-center p-2">{index + 1}</th>
        <td className="max-sm:py-2 p-0">
          <input
            onChange={(e) => {
              updateForm("english", e.target.value);
            }}
            value={formData[index].english}
            type="text"
            required
            id={"english" + index}
            className="input"
          />
        </td>
        <td className="max-sm:py-2 max-sm:px-2 ">
          <input
            onChange={(e) => {
              updateForm("polish", e.target.value);
            }}
            value={formData[index].polish}
            type="text"
            required
            id={"polish" + index}
            className="input"
          />
        </td>
        <td className="p-0 pr-2 ">
          <FaArrowRightArrowLeft
            className="btn btn-square p-[2px] btn-xs "
            onClick={() => {
              changeOrder();
            }}
          />
        </td>
        <td className="p-0 max-sm:pr-2 ">
          <FaWindowClose
            className="btn btn-xs btn-square hover:text-error"
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
