import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert('employee', [
        {
            employee_id: 'E001',
            emp_firstname: 'Kasitinard',
            emp_lastname: 'Song',
            emp_sex: 'M',
            emp_tel: '0830329145',
            emp_email: 'yelaysong15@gmail.com',
            emp_password: '140974saiaye', // Note: Ideally this should be hashed, but using raw as per image/request
            role_id: 'R01'
        }
    ]);
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('employee', { employee_id: 'E001' });
}
