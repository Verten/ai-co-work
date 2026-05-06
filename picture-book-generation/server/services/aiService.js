const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const MINIMAX_API_BASE = 'https://api.minimaxi.com';

/**
 * Generate story text using MiniMax AI
 * @param {Array<{role: string, content: string}>} messages - Conversation messages
 * @returns {Promise<string>} Generated text content
 */
async function generateStoryText(messages) {
  const response = await fetch(`${MINIMAX_API_BASE}/anthropic/v1/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MINIMAX_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'MiniMax-M2.7',
      max_tokens: 2048,
      temperature: 0.8,
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MiniMax API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.text;
}

/**
 * Generate image using MiniMax AI
 * @param {string} prompt - Image description prompt
 * @param {string} style - Art style (漫画、元气、中世纪、水彩)
 * @returns {Promise<{url: string}>} Generated image URL
 */
async function generateImage(prompt, style) {
  const response = await fetch(`${MINIMAX_API_BASE}/v1/image_generation`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MINIMAX_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'image-01',
      prompt,
      style,
      aspect_ratio: '3:4',
      response_format: 'url',
      prompt_optimizer: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MiniMax API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return { url: data.url };
}

module.exports = {
  generateStoryText,
  generateImage,
};
