const { generateText } = require('./_gemini');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    const result = await generateText(req.body?.prompt);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 502;
    return res.status(statusCode).json({ error: error.message });
  }
};
