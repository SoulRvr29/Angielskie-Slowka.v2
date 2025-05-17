export async function GET(request, { params }) {
  const word = params.word;
  if (!word || typeof word !== "string") {
    return new Response(JSON.stringify({ error: "Brak słowa" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // try {
  //   const oxfordRes = await fetch(
  //     `https://od-api-sandbox.oxforddictionaries.com/api/v2/entries/en-us/${word}`,
  //     {
  //       headers: {
  //         Accept: "application/json",
  //         app_id: process.env.OXFORD_APP_ID,
  //         app_key: process.env.OXFORD_APP_KEY,
  //       },
  //     }
  //   );

  //   if (!oxfordRes.ok) throw new Error("Oxford API failed");

  //   const data = await oxfordRes.json();
  //   const entry = data.results?.[0]?.lexicalEntries?.[0];

  //   return res.status(200).json({
  //     source: "oxford",
  //     word,
  //     definition: entry.entries?.[0]?.senses?.[0]?.definitions?.[0] || null,
  //     example: entry.entries?.[0]?.senses?.[0]?.examples?.[0]?.text || null,
  //     phonetic: entry.pronunciations?.[0]?.phoneticSpelling || null,
  //     partOfSpeech: entry.lexicalCategory?.text || null,
  //     synonyms:
  //       entry.entries?.[0]?.senses?.[0]?.synonyms?.map((s) => s.text) || [],
  //   });
  // } catch (oxErr) {
  try {
    const freeRes = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (!freeRes.ok) throw new Error("Free Dictionary API failed");

    const data = await freeRes.json();
    console.log(data);
    const entry = data[0];

    return new Response(
      JSON.stringify({
        source: "free",
        word,
        definition: entry.meanings?.[0]?.definitions?.[0]?.definition || null,
        example: entry.meanings?.[0]?.definitions?.[0]?.example || null,
        phonetic: entry.phonetic || null,
        partOfSpeech: entry.meanings?.[0]?.partOfSpeech || null,
        synonyms: entry.meanings?.[0]?.definitions?.[0]?.synonyms || [],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Nie udało się pobrać danych z żadnego źródła" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  // }
}
