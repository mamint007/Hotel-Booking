import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('review', {
      review_id: {
        type: DataTypes.CHAR(7),
        primaryKey: true,
        allowNull: false
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      review_text: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      create_datetime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      booking_id: {
        type: DataTypes.CHAR(7),
        allowNull: false,
        references: {
          model: 'booking',
          key: 'booking_id'
        }
      },
      member_id: {
        type: DataTypes.CHAR(7),
        allowNull: false,
        references: {
          model: 'member',
          key: 'member_id'
        }
      }
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('review');
  }
};
