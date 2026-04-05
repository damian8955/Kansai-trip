module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method not allowed");
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return res.status(500).send("Missing GOOGLE_MAPS_API_KEY");
  }

  const photoName = typeof req.query?.name === "string" ? req.query.name : "";
  if (!photoName) {
    return res.status(400).send("Missing name");
  }

  try {
    const mediaUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&key=${encodeURIComponent(apiKey)}`;
    const mediaResponse = await fetch(mediaUrl);

    if (!mediaResponse.ok) {
      const errorText = await mediaResponse.text();
      return res.status(mediaResponse.status).send(errorText || "Failed to fetch media");
    }

    const contentType = mediaResponse.headers.get("content-type") || "image/jpeg";
    const cacheControl = mediaResponse.headers.get("cache-control") || "public, max-age=86400";
    const buffer = Buffer.from(await mediaResponse.arrayBuffer());

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", cacheControl);
    return res.status(200).send(buffer);
  } catch (error) {
    return res.status(500).send(error instanceof Error ? error.message : "Unknown error");
  }
};
