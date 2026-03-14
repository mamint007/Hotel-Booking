import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.changeColumn('payment', 'employee_id', {
        type: DataTypes.CHAR(4),
        allowNull: true
    });
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.changeColumn('payment', 'employee_id', {
        type: DataTypes.CHAR(4),
        allowNull: false
    });
}
