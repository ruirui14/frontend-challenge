import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { prefCode } = req.query;

  try {
    const response = await fetch(
      `https://frontend-engineer-codecheck-api.mirai.yumemi.io/api/v1/population/composition/perYear?prefCode=${prefCode}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.VITE_API_KEY ?? '',
        },
      }
    );

    console.log("人口構成APIレスポンス:", response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error("外部APIエラー:", text);
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    console.error("Population API Error:", error);
    res.status(500).json({ error: error.message });
  }
}
