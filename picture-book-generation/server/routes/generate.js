import express from 'express';
import authMiddleware from '../middleware/auth.js';
import storyService from '../services/storyService.js';
import db from '../db/index.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

/**
 * POST /chat - Generate story via chat mode (description + style)
 */
router.post('/chat', async (req, res) => {
  try {
    const { description, style, title } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    // Create storybook record with generating status
    const storyConfig = { description, style: style || '水彩' };
    const insertStmt = db.prepare(`
      INSERT INTO storybooks (user_id, title, story_config, status)
      VALUES (?, ?, ?, 'generating')
    `);
    const result = insertStmt.run(
      req.user.id,
      title || 'Generating Story...',
      JSON.stringify(storyConfig)
    );

    const storybookId = result.lastInsertRowid;

    try {
      // Generate the complete story with images
      const story = await storyService.generateStory(storyConfig, 'chat');

      // Update storybook with generated content and completed status
      const updateStmt = db.prepare(`
        UPDATE storybooks
        SET title = ?, pages = ?, status = 'completed', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      updateStmt.run(story.title, JSON.stringify(story.pages), storybookId);

      // Fetch updated record
      const fetchStmt = db.prepare(`
        SELECT id, user_id, title, story_config, pages, status, created_at, updated_at
        FROM storybooks
        WHERE id = ?
      `);
      const updated = fetchStmt.get(storybookId);

      res.json({
        ...updated,
        story_config: JSON.parse(updated.story_config || '{}'),
        pages: JSON.parse(updated.pages || '[]')
      });
    } catch (error) {
      // Mark as failed if generation fails
      const failStmt = db.prepare(`
        UPDATE storybooks
        SET status = 'failed', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      failStmt.run(storybookId);

      throw error;
    }
  } catch (err) {
    console.error('Error generating story (chat):', err);
    res.status(500).json({ error: 'Failed to generate story' });
  }
});

/**
 * POST /random - Generate story via random mode (character + setting + theme + style)
 */
router.post('/random', async (req, res) => {
  try {
    const { character, setting, theme, style, title } = req.body;

    if (!character || !setting || !theme) {
      return res.status(400).json({ error: 'Character, setting, and theme are required' });
    }

    // Create storybook record with generating status
    const storyConfig = { character, setting, theme, style: style || '水彩' };
    const insertStmt = db.prepare(`
      INSERT INTO storybooks (user_id, title, story_config, status)
      VALUES (?, ?, ?, 'generating')
    `);
    const result = insertStmt.run(
      req.user.id,
      title || 'Generating Story...',
      JSON.stringify(storyConfig)
    );

    const storybookId = result.lastInsertRowid;

    try {
      // Generate the complete story with images
      const story = await storyService.generateStory(storyConfig, 'random');

      // Update storybook with generated content and completed status
      const updateStmt = db.prepare(`
        UPDATE storybooks
        SET title = ?, pages = ?, status = 'completed', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      updateStmt.run(story.title, JSON.stringify(story.pages), storybookId);

      // Fetch updated record
      const fetchStmt = db.prepare(`
        SELECT id, user_id, title, story_config, pages, status, created_at, updated_at
        FROM storybooks
        WHERE id = ?
      `);
      const updated = fetchStmt.get(storybookId);

      res.json({
        ...updated,
        story_config: JSON.parse(updated.story_config || '{}'),
        pages: JSON.parse(updated.pages || '[]')
      });
    } catch (error) {
      // Mark as failed if generation fails
      const failStmt = db.prepare(`
        UPDATE storybooks
        SET status = 'failed', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      failStmt.run(storybookId);

      throw error;
    }
  } catch (err) {
    console.error('Error generating story (random):', err);
    res.status(500).json({ error: 'Failed to generate story' });
  }
});

export default router;