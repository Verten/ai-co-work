const MINIMAX_API_BASE = 'https://api.minimaxi.com';

function getMinimaxApiKey() {
  const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
  if (!MINIMAX_API_KEY) {
    throw new Error('MINIMAX_API_KEY environment variable is required');
  }
  return MINIMAX_API_KEY;
}

/**
 * Generate story text using MiniMax AI
 * @param {Array<{role: string, content: string}>} messages - Conversation messages
 * @returns {Promise<string>} Generated text content
 */
async function generateStoryText(messages) {
  const MINIMAX_API_KEY = getMinimaxApiKey();
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
    signal: AbortSignal.timeout(120000),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MiniMax API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  // Extract text from content array (Anthropic format)
  const textBlock = data.content?.find(c => c.type === 'text');
  return textBlock?.text || '';
}

/**
 * Generate image using MiniMax AI
 * @param {string} prompt - Image description prompt
 * @param {string} style - Art style (漫画、元气、中世纪、水彩)
 * @returns {Promise<{url: string}>} Generated image URL
 */
async function generateImage(prompt, style) {
  const MINIMAX_API_KEY = getMinimaxApiKey();
  const response = await fetch(`${MINIMAX_API_BASE}/v1/image_generation`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MINIMAX_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'image-01',
      prompt,
      style: {
        style_type: style,
        style_weight: 0.8
      },
      aspect_ratio: '3:4',
      response_format: 'url',
      prompt_optimizer: true,
    }),
    signal: AbortSignal.timeout(120000),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MiniMax API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  console.log(`[aiService] image response:`, JSON.stringify(data));
  const url = data.data?.image_urls?.[0] || null;
  return { url };
}

export {
  generateStoryText,
  generateImage,
};
