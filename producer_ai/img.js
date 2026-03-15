// /api/image.js — Hugging Face Image Generation via Vercel
// Deploy alongside your existing /api/openai route
// Env var needed: HF_TOKEN (free from https://huggingface.co/settings/tokens)

export default async function handler(req, res) {
  // CORS headers (same as your openai route)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  const HF_TOKEN = process.env.HF_TOKEN;
  if (!HF_TOKEN) return res.status(500).json({ error: 'HF_TOKEN not configured' });

  // Model priority: try FLUX.1-schnell first (fast, free tier friendly)
  // Fallback to Stable Diffusion XL if FLUX fails
  const models = [
    'black-forest-labs/FLUX.1-schnell',
    'stabilityai/stable-diffusion-xl-base-1.0'
  ];

  let lastError = null;

  for (const model of models) {
    try {
      const hfUrl = `https://router.huggingface.co/hf-inference/models/${model}`;

      const response = await fetch(hfUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
          'x-use-cache': '0'  // Force fresh generation each time
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            guidance_scale: 7.5,
            num_inference_steps: model.includes('FLUX') ? 4 : 30
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        lastError = `${model}: HTTP ${response.status} - ${errText.substring(0, 200)}`;

        // If model is loading (503), try next model
        if (response.status === 503) continue;
        // If rate limited (429), try next model
        if (response.status === 429) continue;
        // Other errors, try next model
        continue;
      }

      // Response is binary image data
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');

      // Detect content type from response headers
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      return res.status(200).json({
        image: `data:${contentType};base64,${base64}`,
        model: model
      });

    } catch (err) {
      lastError = `${model}: ${err.message}`;
      continue;
    }
  }

  // All models failed
  return res.status(502).json({
    error: 'Image generation failed',
    detail: lastError
  });
}
