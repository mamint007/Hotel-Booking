import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.createTable('booking_additional_charges', {
            charge_id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.CHAR(3),
                references: {
                    model: 'additional_charges',
                    key: 'charge_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            stay_id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.CHAR(7),
                references: {
                    model: 'checkin_checkout',
                    key: 'stay_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            }
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable('booking_additional_charges');
    }
};
