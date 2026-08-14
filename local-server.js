const express = require('express');
const https = require('https');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const MAX_PROMPT_LENGTH = 30000;

app.use(express.json({ limit: '100kb' }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

function getGeminiApiKey() {
  const key = process.env.GEMINI_API_KEY;
  return typeof key === 'string' && key.trim() ? key.trim() : null;
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasEnvKey: Boolean(getGeminiApiKey()) });
});

app.post('/api/generate', async (req, res) => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return res.status(503).json({ error: '서버 환경변수 GEMINI_API_KEY가 설정되지 않았습니다.' });
  }

  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
  if (!prompt) return res.status(400).json({ error: '프롬프트(prompt) 내용이 필요합니다.' });
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return res.status(413).json({ error: `프롬프트는 ${MAX_PROMPT_LENGTH.toLocaleString()}자 이하로 입력해 주세요.` });
  }

  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
  let lastError = null;
  for (const model of models) {
    try {
      const text = await callGeminiREST(model, apiKey, prompt);
      return res.json({ text, modelUsed: model });
    } catch (err) {
      lastError = err;
    }
  }

  console.error('Gemini request failed:', lastError?.message || 'unknown error');
  return res.status(502).json({ error: 'Gemini API 호출에 실패했습니다. 잠시 후 다시 시도해 주세요.' });
});

function callGeminiREST(model, apiKey, promptText) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] });
    const request = https.request({
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) },
    }, (apiRes) => {
      let data = '';
      apiRes.on('data', (chunk) => { data += chunk; });
      apiRes.on('end', () => {
        if (apiRes.statusCode >= 200 && apiRes.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            return text ? resolve(text) : reject(new Error('응답 데이터에 텍스트가 없습니다.'));
          } catch { return reject(new Error('Gemini 응답 JSON 파싱 오류')); }
        }
        try {
          const parsed = JSON.parse(data);
          reject(new Error(parsed.error?.message || `HTTP ${apiRes.statusCode}`));
        } catch { reject(new Error(`HTTP ${apiRes.statusCode}`)); }
      });
    });
    request.on('error', reject);
    request.write(postData);
    request.end();
  });
}

if (require.main === module) {
  app.listen(PORT, () => console.log(`CareerAI Pro 서버: http://localhost:${PORT}`));
}

module.exports = app;
