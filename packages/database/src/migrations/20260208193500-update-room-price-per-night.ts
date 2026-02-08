
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.changeColumn('room', 'price_per_night', {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    });
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.changeColumn('room', 'price_per_night', {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    });
}
