const SHARED_SPOTS_PATHNAME = "shared/kansai-trip-spots.json";

module.exports = async (req, res) => {
  const { put, head, del } = await import("@vercel/blob");

  const isBlobNotFound = (error) => {
    const errorText = [
      error?.name,
      error?.code,
      error?.message,
      error?.cause?.message,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      errorText.includes("not found") ||
      errorText.includes("blobnotfound") ||
      errorText.includes("nosuchkey") ||
      errorText.includes("does not exist")
    );
  };

  if (req.method === "GET") {
    try {
      const blob = await head(SHARED_SPOTS_PATHNAME);
      const response = await fetch(blob.url, {
        headers: {
          Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch shared spots" });
      }

      const data = await response.json();
      return res.status(200).json({ spots: Array.isArray(data.spots) ? data.spots : [] });
    } catch (error) {
      if (isBlobNotFound(error)) {
        return res.status(200).json({ spots: [] });
      }

      return res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  if (req.method === "POST") {
    const spots = Array.isArray(req.body?.spots) ? req.body.spots : null;
    if (!spots) {
      return res.status(400).json({ error: "Missing spots" });
    }

    try {
      await put(
        SHARED_SPOTS_PATHNAME,
        JSON.stringify(
          {
            updatedAt: new Date().toISOString(),
            spots,
          },
          null,
          2,
        ),
        {
          access: "private",
          allowOverwrite: true,
          addRandomSuffix: false,
          contentType: "application/json",
        },
      );

      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await del(SHARED_SPOTS_PATHNAME);
      return res.status(200).json({ ok: true });
    } catch (error) {
      if (isBlobNotFound(error)) {
        return res.status(200).json({ ok: true });
      }

      return res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  res.setHeader("Allow", "GET, POST, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
};
