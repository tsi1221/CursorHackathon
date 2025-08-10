import express from 'express';
import { z } from 'zod';
import OpenAI from 'openai';

const router = express.Router();

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const suggestSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(2),
  subCity: z.string().optional().default(''),
  woreda: z.string().optional().default(''),
});

router.post('/suggest', async (req, res, next) => {
  try {
    if (!openai) {
      return res.status(503).json({ error: 'AI is not configured' });
    }
    const parsed = suggestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const system = `You are FixMyHood AI assistant helping residents in Addis Ababa, Ethiopia to resolve local infrastructure issues. Suggest clear, locally relevant next steps including: who to contact (municipal department or utility), what info to provide, low-cost community actions, and safety precautions. Keep it concise with bullet points and add Amharic labels for each bullet in parentheses when possible.`;

    const user = `Issue title: ${parsed.data.title}\nCategory: ${parsed.data.category}\nSub-city: ${parsed.data.subCity}\nWoreda: ${parsed.data.woreda}\nDescription: ${parsed.data.description}`;

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.3,
    });

    const text = completion.choices?.[0]?.message?.content?.trim() || 'No suggestion available.';
    res.json({ suggestion: text });
  } catch (err) {
    next(err);
  }
});

export default router;