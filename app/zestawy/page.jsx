import Category from "../components/Category";

async function fetchWordSets() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/zestawy`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching word sets:", error);
    return []; // Return an empty array as fallback
  }
}

const getCategories = (data) => {
  return [...new Set(data.map((item) => item.category).sort())];
};

const WordSetsPage = async () => {
  const wordSets = await fetchWordSets();
  const categories = getCategories(wordSets);

  return (
    <div>
      <h2>Wybierz zestaw</h2>
      <div className="flex flex-col gap-4">
        {categories.map((category) => (
          <Category key={category} category={category} wordSets={wordSets} />
        ))}
      </div>
      <div className="flex justify-center gap-4 flex-wrap max-sm:flex-col items-center"></div>
    </div>
  );
};
export default WordSetsPage;
