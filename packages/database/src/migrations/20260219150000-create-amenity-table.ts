
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.createTable('amenity', {
            amenity_id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.CHAR(3)
            },
            amenity_name: {
                allowNull: false, // Assuming name is required
                type: DataTypes.STRING(50)
            },
            amenity_icon: {
                allowNull: true, // Assuming icon can be null or required. Let's make it optional usually unless critical.
                // But looking at the image, it has content.
                // I'll make it nullable for safety or not null per convention?
                // Usually icons are required for UI.
                // The image doesn't show NOT NULL constraint explicitly but `amenity_name` is key.
                type: DataTypes.STRING(255)
            }
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable('amenity');
    }
};
