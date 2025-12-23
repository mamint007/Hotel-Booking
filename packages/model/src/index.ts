import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_DIALECT } = process.env;

export const sequelize = new Sequelize(
    DB_NAME || 'hotel_booking',
    DB_USER || 'postgres',
    DB_PASSWORD || 'postgres',
    {
        host: DB_HOST || 'localhost',
        port: Number(DB_PORT) || 5432,
        dialect: (DB_DIALECT as any) || 'postgres',
        logging: false,
    }
);
