import {createRequestHandler} from '@react-router/express';
import express from 'express';
import {readFileSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUILD_PATH = join(__dirname, 'dist/server/index.js');
const PUBLIC_PATH = join(__dirname, 'dist/client');

const app = express();
app.use(express.static(PUBLIC_PATH, {maxAge: '1h'}));

const env = {};
const envFile = readFileSync(join(__dirname, '.env'), 'utf-8');
envFile.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && !key.startsWith('#')) env[key.trim()] = vals.join('=').trim().replace(/^["']|["']$/g, '');
});

const build = await import(BUILD_PATH);

app.all('*', async (req, res, next) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === 'string') headers.set(key, value);
    }
    
    const request = new Request(url.toString(), {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
    });

    const response = await build.default.fetch(request, env);
    
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.listen(3000, () => {
  console.log('\n🚀 Local server running at: http://localhost:3000/\n');
});
