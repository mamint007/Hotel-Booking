
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.createTable('room_type_detail', {
            room_id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.CHAR(4),
                references: {
                    model: 'room',
                    key: 'room_id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            amenity_id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.CHAR(3),
                references: {
                    model: 'amenity',
                    key: 'amenity_id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable('room_type_detail');
    }
};
