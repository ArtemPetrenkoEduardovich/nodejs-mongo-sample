import express from 'express';
import cors from 'cors';
import routers from './routers';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', routers);
app.use(errorHandler);

export default app;
