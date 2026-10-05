import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { rateLimiter } from './middlewares/rateLimiter.middleware.js';
import { initializeSockets } from './sockets/index.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(rateLimiter);

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs', (_req: Request, res: Response) => res.redirect('/swagger'));
app.get('/', (_req: Request, res: Response) => res.redirect('/swagger'));

app.use('/api/v1', apiRouter);
app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req: Request, res: Response) => res.status(204).end());

app.use(errorHandler);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: env.CORS_ORIGIN, methods: ['GET', 'POST'] }
});

initializeSockets(io);

server.listen(env.PORT, () => {
  logger.info(`MatchStorm Engine live on http://localhost:${env.PORT}`);
});