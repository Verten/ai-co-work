import { generateStoryText, generateImage } from './aiService.js';

/**
 * Build system prompt - acts as a children's picture book author
 */
function buildSystemPrompt() {
  return `You are a professional children's picture book author with decades of experience creating engaging stories for young readers (ages 3-8).

Your expertise:
- Write warm, imaginative stories with simple but meaningful plots
- Create memorable characters that children can relate to
- Use age-appropriate vocabulary and sentence structures
- Craft stories with a clear beginning, middle, and end
- Each story consists of 10-12 pages with diverse scenes and settings

Output format for each page:
- Page N: [scene description in Chinese] | [visual description for image generation in English]

The visual description should be detailed and vivid, suitable for AI image generation. Focus on:
- Character appearances and expressions
- Setting and environment details
- Colors and lighting mood
- Action and interaction

Example format:
Page 1: 小兔子晶晶第一次离开兔妈妈去森林里探险，她有点紧张但也很兴奋。| A cute white rabbit girl with big eyes, nervously looking around a magical forest with soft golden sunlight filtering through tall trees, warm and cozy atmosphere

Remember: Write in Chinese for the story text. Visual descriptions should be in English for better image generation results.`;
}

/**
 * Build user prompt based on configuration and mode
 * @param {Object} config - Story configuration
 * @param {'chat'|'random'} mode - Generation mode
 */
function buildUserPrompt(config, mode) {
  if (mode === 'chat') {
    // Chat mode: description and style based
    const { description, style } = config;
    return `Create a 10-12 page children's picture book based on the following concept:

Description: ${description}
Art Style: ${style || '水彩'}

Please write a complete story with 10-12 pages, following the format specified in your instructions.`;
  } else {
    // Random mode: character, setting, theme based
    const { character, setting, theme, style } = config;
    return `Create a 10-12 page children's picture book with the following elements:

Character: ${character || 'a little rabbit'}
Setting: ${setting || 'a magical forest'}
Theme: ${theme || 'friendship and adventure'}
Art Style: ${style || '水彩'}

Please write a complete story with 10-12 pages, following the format specified in your instructions.`;
  }
}

/**
 * Parse generated story text into pages
 * @param {string} text - Generated story text
 * @returns {Array<{story: string, imagePrompt: string}>} Parsed pages
 */
function parseStoryPages(text) {
  const pages = [];
  const pageRegex = /Page\s+(\d+):\s*(.+?)(?=\nPage\s+\d+:|$)/gi;

  let match;
  while ((match = pageRegex.exec(text)) !== null) {
    const content = match[2].trim();
    // Split by pipe to separate story text and image prompt
    const parts = content.split('|').map(p => p.trim());
    if (parts.length >= 2) {
      pages.push({
        story: parts[0],
        imagePrompt: parts[1]
      });
    } else {
      // If no clear separator, use the whole content as story and derive image prompt
      pages.push({
        story: parts[0],
        imagePrompt: parts[0]
      });
    }
  }

  return pages;
}

/**
 * Generate a complete story with images
 * @param {Object} config - Story configuration
 * @param {'chat'|'random'} mode - Generation mode
 * @returns {Promise<{title: string, pages: Array<{pageNum: number, story: string, imageUrl: string}>}>}
 */
async function generateStory(config, mode) {
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(config, mode);

  // Generate story text
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  const generatedText = await generateStoryText(messages);

  // Parse into pages
  const parsedPages = parseStoryPages(generatedText);

  // Generate title from first page story or config
  const story = { title: config.title || null };
  if (!story.title && parsedPages.length > 0 && parsedPages[0].story) {
    // Extract first 10 characters as a simple title (properly handles Chinese)
    story.title = parsedPages[0].story.substring(0, 10) + '...';
  }
  if (!story.title) {
    story.title = 'Untitled Story';
  }

  // Generate images for each page
  const style = config.style || '水彩';
  const pagesWithImages = await Promise.all(
    parsedPages.map(async (page, index) => {
      try {
        const { url } = await generateImage(page.imagePrompt, style);
        return {
          page_number: index + 1,
          text: page.story,
          image_url: url
        };
      } catch (error) {
        console.error(`Failed to generate image for page ${index + 1}:`, error);
        return {
          page_number: index + 1,
          text: page.story,
          image_url: null
        };
      }
    })
  );

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