module.exports = async (_req, res) => {
  return res.status(200).json({
    embedApiKey: process.env.GOOGLE_MAPS_EMBED_API_KEY || "",
  });
};
