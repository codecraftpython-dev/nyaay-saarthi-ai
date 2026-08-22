import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';
import { handleAiChat, handleAiSummarize, handleAiSuggestions } from './src/server/apiHandler.ts';

dotenv.config();

function apiDevPlugin(): Plugin {
  return {
    name: 'api-dev-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/ai/')) {
          return next();
        }

        try {
          let body = {};
          if (req.method === 'POST') {
            const buffers: Buffer[] = [];
            for await (const chunk of req) {
              buffers.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
            }
            const raw = Buffer.concat(buffers).toString('utf-8');
            try {
              body = raw ? JSON.parse(raw) : {};
            } catch (e) {
              body = {};
            }
          }

          const expressReq: any = req;
          expressReq.body = body;

          const expressRes: any = res;
          expressRes.status = (code: number) => {
            res.statusCode = code;
            return expressRes;
          };
          expressRes.json = (data: any) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return expressRes;
          };

          const urlPath = (req.url || '').split('?')[0];

          if (urlPath === '/api/ai/chat') {
            return await handleAiChat(expressReq, expressRes);
          }
          if (urlPath === '/api/ai/summarize') {
            return await handleAiSummarize(expressReq, expressRes);
          }
          if (urlPath === '/api/ai/suggestions') {
            return await handleAiSuggestions(expressReq, expressRes);
          }

          next();
        } catch (err: any) {
          console.error('Error in Vite API dev middleware:', err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal Server Error', details: err?.message }));
          }
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevPlugin()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },

    preview: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
    },
  };
});
