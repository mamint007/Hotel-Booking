
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.addColumn('employee', 'is_active', {
            type: DataTypes.CHAR(1),
            defaultValue: 'A',
            allowNull: false,
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.removeColumn('employee', 'is_active');
    }
};
