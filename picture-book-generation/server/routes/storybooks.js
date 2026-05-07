import express from 'express';
import authMiddleware from '../middleware/auth.js';
import db from '../db/index.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET / - Get all storybooks for the authenticated user
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT id, title, status, created_at, updated_at
      FROM storybooks
      WHERE user_id = ?
      ORDER BY updated_at DESC
    `);
    const storybooks = stmt.all(req.user.id);
    res.json(storybooks);
  } catch (err) {
    console.error('Error fetching storybooks:', err);
    res.status(500).json({ error: 'Failed to fetch storybooks' });
  }
});

// GET /:id - Get single storybook details
router.get('/:id', (req, res) => {
  try {
    console.log(`[storybooks] GET /${req.params.id} by user ${req.user.id}`);
    const stmt = db.prepare(`
      SELECT id, user_id, title, story_config, pages, status, created_at, updated_at
      FROM storybooks
      WHERE id = ? AND user_id = ?
    `);
    const storybook = stmt.get(Number(req.params.id), req.user.id);

    if (!storybook) {
      return res.status(404).json({ error: 'Storybook not found' });
    }

    // Parse JSON fields
    const result = {
      ...storybook,
      story_config: JSON.parse(storybook.story_config || '{}'),
      pages: JSON.parse(storybook.pages || '[]')
    };

    res.json(result);
  } catch (err) {
    console.error('Error fetching storybook:', err);
    res.status(500).json({ error: 'Failed to fetch storybook' });
  }
});

// POST / - Create new storybook
router.post('/', (req, res) => {
  const { title, story_config, pages } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO storybooks (user_id, title, story_config, pages)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(
      req.user.id,
      title,
      JSON.stringify(story_config || {}),
      JSON.stringify(pages || [])
    );

    const newStorybook = {
      id: result.lastInsertRowid,
      user_id: req.user.id,
      title,
      story_config: story_config || {},
      pages: pages || [],
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    res.status(201).json(newStorybook);
  } catch (err) {
    console.error('Error creating storybook:', err);
    res.status(500).json({ error: 'Failed to create storybook' });
  }
});

// PUT /:id - Update storybook
router.put('/:id', (req, res) => {
  const { title, pages, status } = req.body;
  const storybookId = req.params.id;

  try {
    // First check if storybook exists and belongs to user
    const checkStmt = db.prepare('SELECT id FROM storybooks WHERE id = ? AND user_id = ?');
    const existing = checkStmt.get(storybookId, req.user.id);

    if (!existing) {
      return res.status(404).json({ error: 'Storybook not found' });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (pages !== undefined) {
      updates.push('pages = ?');
      values.push(JSON.stringify(pages));
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(storybookId, req.user.id);

    const updateStmt = db.prepare(`
      UPDATE storybooks
      SET ${updates.join(', ')}
      WHERE id = ? AND user_id = ?
    `);
    updateStmt.run(...values);

    // Fetch updated storybook
    const fetchStmt = db.prepare(`
      SELECT id, user_id, title, story_config, pages, status, created_at, updated_at
      FROM storybooks
      WHERE id = ? AND user_id = ?
    `);
    const updated = fetchStmt.get(storybookId, req.user.id);

    res.json({
      ...updated,
      story_config: JSON.parse(updated.story_config || '{}'),
      pages: JSON.parse(updated.pages || '[]')
    });
  } catch (err) {
    console.error('Error updating storybook:', err);
    res.status(500).json({ error: 'Failed to update storybook' });
  }
});

// DELETE /:id - Delete storybook
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM storybooks WHERE id = ? AND user_id = ?');
    const result = stmt.run(req.params.id, req.user.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Storybook not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting storybook:', err);
    res.status(500).json({ error: 'Failed to delete storybook' });
  }
});

export default router;