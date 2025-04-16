import Link from "next/link";

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
  const normalizeString = (str) => {
    return str
      .split(" ")
      .join("_")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ł/g, "l")
      .replace(/Ł/g, "L");
  };
  return (
    <div>
      <h2>Wybierz zestaw</h2>
      <div className="flex flex-col gap-8">
        {categories.map((category) => (
          <div
            key={category}
            className="bg-base-300 overflow-clip rounded-md flex flex-col"
          >
            <div className="flex items-center gap-2 bg-primary/50 px-2 text-xl">
              <h3 className="font-semibold">{category}</h3>
              <p className="text-base">
                ({wordSets.filter((item) => item.category === category).length})
              </p>
            </div>
            <div className="flex flex-wrap gap-4 p-4">
              {wordSets.length > 0 ? (
                wordSets
                  .filter((wordSet) => wordSet.category === category)
                  .map((wordSet) => (
                    <Link
                      href={`/zestawy/${normalizeString(wordSet.name)}`}
                      key={wordSet.name}
                      className="bg-primary/20 hover:bg-primary/40 p-2 px-4 rounded-md text-center cursor-pointer transition-colors max-sm:w-full"
                    >
                      <h3 className="font-semibold text-xl">{wordSet.name}</h3>
                      <p>{wordSet.words.length} słówek</p>
                    </Link>
                  ))
              ) : (
                <div>Brak dostępnych zestawów</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 flex-wrap max-sm:flex-col items-center"></div>
    </div>
  );
};
export default WordSetsPage;
