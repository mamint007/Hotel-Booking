import { sequelize } from '../../packages/model/src/sequelize';

async function fixDB() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.query('ALTER TABLE payment ALTER COLUMN employee_id DROP NOT NULL;');
        console.log('Successfully altered employee_id to drop NOT NULL constraint.');
    } catch (error) {
        console.error('Unable to connect to the database or alter table:', error);
    } finally {
        await sequelize.close();
    }
}

fixDB();
