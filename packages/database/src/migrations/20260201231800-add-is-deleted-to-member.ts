
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.addColumn('member', 'is_deleted', {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.removeColumn('member', 'is_deleted');
    }
};
