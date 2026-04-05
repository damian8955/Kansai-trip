# Kansai Trip Map

這個版本改成適合部署在 Vercel，並採用雙 key + 共用雲端儲存架構：

- `GOOGLE_MAPS_API_KEY`：後端私密 key，只給 Vercel API 用
- `GOOGLE_MAPS_EMBED_API_KEY`：前端內嵌地圖專用 key，會被瀏覽器看到，但可以做嚴格網域限制

## 架構

- 前端：`index.html`、`styles.css`、`script.js`
- 後端 API：
  - `api/place-search.js`
  - `api/place-photo.js`
  - `api/place-photo-media.js`
  - `api/public-config.js`
  - `api/shared-spots.js`

## Vercel 部署

1. 把專案推到 GitHub
2. 到 [Vercel](https://vercel.com/) 匯入這個 repository
3. 在 Vercel 專案設定新增環境變數：
   - `GOOGLE_MAPS_API_KEY`
   - `GOOGLE_MAPS_EMBED_API_KEY`
4. 重新部署

## 共用儲存設定

如果你想讓不同裝置、不同人都看到同一份景點清單，還要再做這一步：

1. 到 Vercel 專案的 `Storage`
2. 建立一個 `Blob` store
3. 連接到目前這個專案
4. Vercel 會自動提供 `BLOB_READ_WRITE_TOKEN`

完成後，網站會把景點清單存在 Blob 裡，大家打開同一個網站就會共用同一份資料。

## 本機開發

如果要在本機用 Vercel 模擬 serverless function：

1. 安裝 Vercel CLI
2. 在專案目錄建立 `.env.local`
3. 放入：

```bash
GOOGLE_MAPS_API_KEY=你的 Google Maps API Key
GOOGLE_MAPS_EMBED_API_KEY=你的 Google Maps Embed API Key
BLOB_READ_WRITE_TOKEN=你的 Vercel Blob Token
```

4. 執行：

```bash
vercel dev
```

## 重要說明

- 景點搜尋與景點圖片會走你自己的 Vercel API，所以前端看不到 `GOOGLE_MAPS_API_KEY`
- 內嵌 Google 地圖會使用 `GOOGLE_MAPS_EMBED_API_KEY`
- 景點清單共用儲存會使用 `BLOB_READ_WRITE_TOKEN`
- `GOOGLE_MAPS_EMBED_API_KEY` 不能真正隱藏，但你應該在 Google Cloud Console 設成：
  - `Application restrictions`：`HTTP referrers (web sites)`
  - 只允許你的 Vercel 網域，例如：
    - `https://your-project.vercel.app/*`
  - `API restrictions`：只允許 `Maps Embed API`
- `GOOGLE_MAPS_API_KEY` 則建議只允許 Places 相關 API
