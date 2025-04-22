const normalizeString = (str) => {
  return str
    .split(" ")
    .join("_")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L");
};

export default normalizeString;
