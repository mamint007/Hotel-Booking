import express, { Request, Response } from 'express';
import cors from 'cors';
import { urlencoded } from 'body-parser'


const APP = () => {
    const app = express();
    const port = process.env.PORT || 3001;

    app.use(cors());
    app.use(express.json());
    app.use(urlencoded({ extended: true }))

    app.get('/', (req: Request, res: Response) => {
        res.send('Welcome to Hotel Service API');
    });

    app.get('/health', (req: Request, res: Response) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    return app
}


export default APP