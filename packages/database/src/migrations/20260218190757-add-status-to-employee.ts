import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('employee', 'status', {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    });
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('employee', 'status');
}
