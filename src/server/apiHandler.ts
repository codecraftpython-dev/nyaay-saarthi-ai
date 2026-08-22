import type { Request, Response } from 'express';
import { 
  generateLegalGuidance, 
  summarizeLegalDiscussion, 
  generateFollowUpSuggestions 
} from './geminiService.ts';

export async function handleAiChat(req: Request, res: Response) {
  try {
    const { message, history, language, citizenContext } = req.body || {};
    
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required and must be a string' });
      return;
    }

    const result = await generateLegalGuidance({
      message,
      history,
      language: language === 'hi' ? 'hi' : 'en',
      citizenContext
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error handling /api/ai/chat:', error);
    res.status(500).json({ 
      error: 'Failed to generate legal guidance',
      details: error?.message || 'Internal server error'
    });
  }
}

export async function handleAiSummarize(req: Request, res: Response) {
  try {
    const { text, messages, language } = req.body || {};

    const result = await summarizeLegalDiscussion({
      text,
      messages,
      language: language === 'hi' ? 'hi' : 'en'
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error handling /api/ai/summarize:', error);
    res.status(500).json({ 
      error: 'Failed to summarize legal consultation',
      details: error?.message || 'Internal server error'
    });
  }
}

export async function handleAiSuggestions(req: Request, res: Response) {
  try {
    const { message, context, language } = req.body || {};

    if (!message) {
      res.status(400).json({ error: 'Message or inquiry context is required' });
      return;
    }

    const suggestions = await generateFollowUpSuggestions({
      message,
      context,
      language: language === 'hi' ? 'hi' : 'en'
    });

    res.json({ suggestions });
  } catch (error: any) {
    console.error('Error handling /api/ai/suggestions:', error);
    res.status(500).json({ 
      error: 'Failed to generate suggestions',
      details: error?.message || 'Internal server error'
    });
  }
}
