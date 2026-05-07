import { generateStoryText, generateImage } from './aiService.js';

/**
 * Build system prompt - acts as a children's picture book author
 */
function buildSystemPrompt() {
  return `You are a professional children's picture book author.

CRITICAL OUTPUT FORMAT - Each page MUST be exactly one line:
Page N: [Chinese story text] | [English image prompt]

Rules:
1. Output ONLY the story pages, nothing else (no titles, no headers, no markdown)
2. Each page is exactly ONE line in this format: Page N: [story] | [prompt]
3. Generate 9-10 pages (Page 1 through Page 9 or Page 10, depending on story length)
4. Story text in Chinese (1-2 sentences per page)
5. Image prompt in English (detailed, specific visual description)
6. Separate story and image prompt with the | character only
7. Do NOT use markdown, headers, or any other formatting

Example output:
Page 1: 小兔子晶晶第一次离开兔妈妈去森林里探险，她有点紧张但也很兴奋。| A cute white rabbit girl with big eyes, nervously looking around a magical forest with soft golden sunlight filtering through tall trees
Page 2:晶晶在森林里遇到了一只友善的小松鼠，他们决定一起寻找回家的路。| A cute white rabbit and a friendly squirrel walking together in a magical forest with tall trees and colorful flowers
Page 3:晶晶和小松鼠一起唱歌，给寂静的森林带来了欢乐的旋律。| A cute white rabbit and a friendly squirrel singing together in a magical forest, musical notes floating in the air, warm sunlight filtering through trees
...`;
}

/**
 * Build user prompt based on configuration and mode
 * @param {Object} config - Story configuration
 * @param {'chat'|'random'} mode - Generation mode
 */
function buildUserPrompt(config, mode) {
  if (mode === 'chat') {
    const { description, style } = config;
    return `Create a 9-10 page children's picture book.

Description: ${description}
Art Style: ${style || 'watercolor'}

Output 9-10 lines in this format:
Page 1: [Chinese story text] | [English image prompt]
Page 2: [Chinese story text] | [English image prompt]
...`;
  } else {
    const { character, setting, theme, style } = config;
    return `Create a 9-10 page children's picture book.

Character: ${character || 'a little rabbit'}
Setting: ${setting || 'a magical forest'}
Theme: ${theme || 'friendship and adventure'}
Art Style: ${style || 'watercolor'}

Output 9-10 lines in this format (one line per page):
Page 1: [Chinese story text] | [English image prompt]
Page 2: [Chinese story text] | [English image prompt]
...`;
  }
}

/**
 * Parse generated story text into pages
 * @param {string} text - Generated story text
 * @returns {Array<{story: string, imagePrompt: string}>} Parsed pages
 */
function parseStoryPages(text) {
  if (!text || typeof text !== 'string') {
    console.log('[storygen] parseStoryPages: no text to parse');
    return [];
  }

  const pages = [];
  // Match: Page N: story text | image prompt
  // Each page is exactly one line
  const lineRegex = /^Page\s+(\d+):\s*(.+?)\s*\|\s*(.+)$/gm;

  let match;
  while ((match = lineRegex.exec(text)) !== null) {
    const pageNum = parseInt(match[1], 10);
    const content = match[2].trim();
    const imagePrompt = match[3].trim();

    // Split content by last | to separate story from prompt
    const pipeIndex = content.lastIndexOf('|');
    if (pipeIndex > 0) {
      const story = content.substring(0, pipeIndex).trim();
      pages.push({ story, imagePrompt: content.substring(pipeIndex + 1).trim() || imagePrompt });
    } else {
      pages.push({ story: content, imagePrompt });
    }
  }

  console.log(`[storygen] parseStoryPages: matched ${pages.length} pages`);
  return pages;
}

/**
 * Generate a complete story with images
 * @param {Object} config - Story configuration
 * @param {'chat'|'random'} mode - Generation mode
 * @param {Object} options - Options including progress callback
 * @returns {Promise<{title: string, pages: Array<{pageNum: number, story: string, imageUrl: string}>}>}
 */
async function generateStory(config, mode, options = {}) {
  const { progressCallback } = options;
  const log = (msg) => {
    console.log(`[storygen] ${msg}`);
    if (progressCallback) {
      progressCallback(msg);
    }
  };

  log(`Starting story generation (mode: ${mode})`);
  log(`Config: ${JSON.stringify(config)}`);

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(config, mode);

  // Generate story text
  log('Generating story text...');
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  const generatedText = await generateStoryText(messages);
  log(`Story text generated: ${generatedText.substring(0, 500)}...`);

  // Parse into pages
  const parsedPages = parseStoryPages(generatedText);
  log(`Parsed ${parsedPages.length} pages`);

  // Generate title from first page story or config
  const story = { title: config.title || null };
  if (!story.title && parsedPages.length > 0 && parsedPages[0].story) {
    story.title = parsedPages[0].story.substring(0, 10) + '...';
  }
  if (!story.title) {
    story.title = 'Untitled Story';
  }
  log(`Story title: ${story.title}`);

  // Generate images for each page
  const style = config.style || '水彩';
  const totalPages = parsedPages.length;
  log(`Will generate ${totalPages} images`);

  const pagesWithImages = [];
  for (let i = 0; i < totalPages; i++) {
    const page = parsedPages[i];
    try {
      log(`Generating image for page ${i + 1}/${totalPages}...`);
      const { url } = await generateImage(page.imagePrompt, style);
      log(`Image URL for page ${i + 1}: ${url}`);
      pagesWithImages.push({
        page_number: i + 1,
        text: page.story,
        image_url: url
      });
    } catch (error) {
      log(`Failed to generate image for page ${i + 1}: ${error.message}`);
      pagesWithImages.push({
        page_number: i + 1,
        text: page.story,
        image_url: null
      });
    }
  }

  log(`Story generation complete: ${pagesWithImages.length} pages`);
  return {
    title: story.title || title,
    pages: pagesWithImages
  };
}

export default {
  buildSystemPrompt,
  buildUserPrompt,
  generateStory,
  parseStoryPages
};