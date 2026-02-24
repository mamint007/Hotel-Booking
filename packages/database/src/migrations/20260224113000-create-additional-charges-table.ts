import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable('additional_charges', {
        charge_id: {
            field: 'charge_id',
            type: DataTypes.CHAR(3),
            primaryKey: true,
            allowNull: false
        },
        charge_name: {
            field: 'charge_name',
            type: DataTypes.STRING(50),
            allowNull: false
        },
        charge_amount: {
            field: 'charge_amount',
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        charge_unit: {
            field: 'charge_unit',
            type: DataTypes.STRING(50),
            allowNull: false
        }
    });

    await queryInterface.bulkInsert('additional_charges', [
        {
            charge_id: 'C01',
            charge_name: 'เตียงเสริม',
            charge_amount: 500.00,
            charge_unit: 'ต่อคืน'
        },
        {
            charge_id: 'C02',
            charge_name: 'เตียงสำหรับเด็ก',
            charge_amount: 300.00,
            charge_unit: 'ต่อคืน'
        }
    ]);
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('additional_charges');
}
