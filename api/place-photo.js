module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing GOOGLE_MAPS_API_KEY" });
  }

  const query = typeof req.query?.q === "string" ? req.query.q : "";
  if (!query) {
    return res.status(400).json({ error: "Missing q" });
  }

  try {
    const searchResponse = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.photos",
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: 1,
        languageCode: "zh-TW",
        regionCode: "JP",
      }),
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      return res.status(searchResponse.status).json({ error: errorText || "Google Places request failed" });
    }

    const searchData = await searchResponse.json();
    const photo = searchData.places?.[0]?.photos?.[0];

    if (!photo?.name) {
      return res.status(200).json({ photo: null });
    }

    return res.status(200).json({
      photo: {
        url: `/api/place-photo-media?name=${encodeURIComponent(photo.name)}`,
        authorAttributions: photo.authorAttributions || [],
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
};
