import express, { Request, Response } from 'express';
import cors from 'cors';
import { urlencoded } from 'body-parser'
import routers from './routers';
import { createRequestLog, createResponseLog, createErrorLog } from './controller/logController'

const APP = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(urlencoded({ extended: true }))
    app.use('/uploads', express.static('public/uploads'));

    app.get('/', (req: Request, res: Response) => {
        res.send('Welcome to Hotel Service API');
    });

    app.use(createRequestLog())

    app.get('/health', (req: Request, res: Response) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    app.use(routers)

    app.use(createResponseLog())
    app.use(createErrorLog())

    return app
}


export default APP