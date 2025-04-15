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

const WordSetsPage = async () => {
  const wordSets = await fetchWordSets();
  // console.log(wordSets);
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
      <div className="flex justify-center gap-4">
        {wordSets.length > 0 ? (
          wordSets.map((item) => (
            <Link
              href={`/zestawy/${normalizeString(item.name)}`}
              key={item.name}
              className="bg-info/20 hover:bg-info/40 p-2 px-4 rounded-md w-fit text-center cursor-pointer transition-colors"
            >
              <h3 className="font-semibold text-xl">{item.name}</h3>
              <p>{item.words.length} słówek</p>
            </Link>
          ))
        ) : (
          <div>Brak dostępnych zestawów</div>
        )}
      </div>
    </div>
  );
};
export default WordSetsPage;
