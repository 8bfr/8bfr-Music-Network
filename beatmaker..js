export default async function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  var body = req.body || {};
  var prompt = (body.prompt || '').trim();
  var mode = body.mode || 'generate';
  if (!prompt) return res.status(400).json({ error: 'Prompt required' });
  if (mode === 'describe') {
    var OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) return res.status(500).json({ error: 'OpenAI key not set' });
    try {
      var descRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-4o-mini', max_tokens: 200, messages: [{ role: 'system', content: 'Convert this into a music generation prompt with genre, tempo, instruments, mood, energy. Output ONLY the prompt text. Max 100 words. Be very specific about sounds.' }, { role: 'user', content: prompt }] })
      });
      var descData = await descRes.json();
      var gp = descData.choices && descData.choices[0] && descData.choices[0].message ? descData.choices[0].message.content.trim() : prompt;
      return res.status(200).json({ success: true, prompt: gp, mode: 'describe' });
    } catch(e) { return res.status(500).json({ error: e.message }); }
  }
  try {
    var encodedPrompt = encodeURIComponent(prompt);
    var audioUrl = 'https://audio.pollinations.ai/' + encodedPrompt;
    var audioRes = await fetch(audioUrl);
    if (!audioRes.ok) {
      return res.status(500).json({ error: 'Audio generation failed: ' + audioRes.status });
    }
    var ct = audioRes.headers.get('content-type') || 'audio/mpeg';
    var audioBuffer = Buffer.from(await audioRes.arrayBuffer());
    if (audioBuffer.length < 1000) {
      return res.status(500).json({ error: 'Audio too small, generation may have failed' });
    }
    var fmt = ct.indexOf('wav') !== -1 ? 'wav' : ct.indexOf('flac') !== -1 ? 'flac' : 'mp3';
    return res.status(200).json({ success: true, audio: audioBuffer.toString('base64'), format: fmt, mime: ct, prompt: prompt });
  } catch (e) { return res.status(500).json({ error: e.message }); }
}
