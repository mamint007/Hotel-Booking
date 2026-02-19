import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.createTable('checkin_checkout', {
            stay_id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.CHAR(7)
            },
            checkin_date: {
                allowNull: false,
                type: DataTypes.DATE
            },
            checkout_date: {
                allowNull: false,
                type: DataTypes.DATE
            },
            booking_id: {
                allowNull: false,
                type: DataTypes.CHAR(7),
                references: {
                    model: 'booking',
                    key: 'booking_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            }
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable('checkin_checkout');
    }
};
