
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
                allowNull: false,
                type: DataTypes.STRING(50)
            },
            amenity_icon: {
                allowNull: true,
                type: DataTypes.STRING(255)
            }
        });

        await queryInterface.bulkInsert('amenity', [
            {
                amenity_id: 'A01',
                amenity_name: 'Free Wifi',
                amenity_icon: 'wifi.svg'
            },
            {
                amenity_id: 'A02',
                amenity_name: 'Pool',
                amenity_icon: 'pool.svg'
            },
            {
                amenity_id: 'A03',
                amenity_name: 'Break Fast',
                amenity_icon: 'breakfast.svg'
            },
            {
                amenity_id: 'A04',
                amenity_name: 'Parking',
                amenity_icon: 'parking.svg'
            },
            {
                amenity_id: 'A05',
                amenity_name: 'Fitness',
                amenity_icon: 'fitness.svg'
            },
            {
                amenity_id: 'A06',
                amenity_name: 'Mini Bar',
                amenity_icon: 'minibar.svg'
            }
        ]);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable('amenity');
    }
};
