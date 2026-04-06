// api/beatmaker.js
// POST /api/beatmaker
// Body: { prompt, duration, user_id }
// Uses Hugging Face Inference API (free tier) with MusicGen model
// Returns base64 audio

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  var body = req.body || {};
  var prompt = (body.prompt || '').trim();
  var userId = body.user_id || '';
  var mode = body.mode || 'generate'; // 'generate' or 'describe' (convert YouTube/artist to prompt)

  if (!prompt) return res.status(400).json({ error: 'Prompt required' });

  // Mode: describe - use OpenAI to convert reference into MusicGen prompt
  if (mode === 'describe') {
    var OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) return res.status(500).json({ error: 'OpenAI key not set' });

    try {
      var descRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + OPENAI_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 200,
          messages: [
            {
              role: 'system',
              content: 'You are a music production expert. Convert the user\'s description into a detailed MusicGen-compatible prompt. Include: genre, tempo feel, instruments, mood, energy level, production style. Be specific about sounds. Output ONLY the prompt text, nothing else. Max 150 words.'
            },
            { role: 'user', content: prompt }
          ]
        })
      });
      var descData = await descRes.json();
      var generatedPrompt = descData.choices && descData.choices[0] && descData.choices[0].message
        ? descData.choices[0].message.content.trim()
        : prompt;

      return res.status(200).json({
        success: true,
        prompt: generatedPrompt,
        mode: 'describe'
      });
    } catch(e) {
      return res.status(500).json({ error: 'Prompt generation failed: ' + e.message });
    }
  }

  // Mode: generate - call Hugging Face MusicGen
  var HF_TOKEN = process.env.HF_TOKEN || '';

  try {
    var headers = { 'Content-Type': 'application/json' };
    if (HF_TOKEN) headers['Authorization'] = 'Bearer ' + HF_TOKEN;

    // Use MusicGen medium for better quality
    var hfRes = await fetch('https://api-inference.huggingface.co/models/facebook/musicgen-small', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1500
        }
      })
    });

    if (!hfRes.ok) {
      var errText = await hfRes.text();
      // Check if model is loading
      if (hfRes.status === 503) {
        return res.status(503).json({
          error: 'Model is loading. Please try again in 30-60 seconds.',
          retry: true
        });
      }
      return res.status(500).json({ error: 'HuggingFace error: ' + errText.substring(0, 200) });
    }

    // Response is raw audio bytes (FLAC format)
    var audioBuffer = Buffer.from(await hfRes.arrayBuffer());

    // Return as base64
    var base64 = audioBuffer.toString('base64');

    // Log generation
    try {
      var { createClient } = require('@supabase/supabase-js');
      var supabase = createClient(
        process.env.SUPABASE_URL || 'https://novbuvwpjnxwwvdekjhr.supabase.co',
        process.env.SUPABASE_SERVICE_KEY || ''
      );
      await supabase.from('ai_generations').insert({
        user_id: userId || null,
        tool: 'beatmaker',
        prompt: prompt.substring(0, 500),
        status: 'success'
      });
    } catch(logErr) {}

    return res.status(200).json({
      success: true,
      audio: base64,
      format: 'flac',
      mime: 'audio/flac',
      prompt: prompt
    });

  } catch (e) {
    return res.status(500).json({ error: e.message || 'Generation failed' });
  }
};
