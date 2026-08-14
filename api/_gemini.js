const https = require('https');

const MAX_PROMPT_LENGTH = 30000;

function getGeminiApiKey() {
  const key = process.env.GEMINI_API_KEY;
  return typeof key === 'string' && key.trim() ? key.trim() : null;
}

async function generateText(prompt) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    const error = new Error('서버 환경변수 GEMINI_API_KEY가 설정되지 않았습니다.');
    error.statusCode = 503;
    throw error;
  }
  if (typeof prompt !== 'string' || !prompt.trim()) {
    const error = new Error('프롬프트(prompt) 내용이 필요합니다.');
    error.statusCode = 400;
    throw error;
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    const error = new Error(`프롬프트는 ${MAX_PROMPT_LENGTH.toLocaleString()}자 이하로 입력해 주세요.`);
    error.statusCode = 413;
    throw error;
  }

  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
  let lastError = null;
  for (const model of models) {
    try {
      return { text: await callGeminiREST(model, apiKey, prompt), modelUsed: model };
    } catch (error) {
      lastError = error;
    }
  }
  console.error('Gemini request failed:', lastError?.message || 'unknown error');
  const error = new Error('Gemini API 호출에 실패했습니다. 잠시 후 다시 시도해 주세요.');
  error.statusCode = 502;
  throw error;
}

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

module.exports = { getGeminiApiKey, generateText };
