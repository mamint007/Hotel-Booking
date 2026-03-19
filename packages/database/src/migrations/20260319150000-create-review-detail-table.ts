import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    // 1. Create review_detail table
    await queryInterface.createTable('review_detail', {
      review_detail_id: {
        type: DataTypes.CHAR(7),
        primaryKey: true,
        allowNull: false
      },
      review_text: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      review_id: {
        type: DataTypes.CHAR(7),
        allowNull: false,
        references: {
          model: 'review',
          key: 'review_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });

    // 2. Remove review_text from review table (cleanup) - but check if it exists first
    const tableInfo = await queryInterface.describeTable('review');
    if (tableInfo.review_text) {
        await queryInterface.removeColumn('review', 'review_text');
    }
  },

  down: async (queryInterface: QueryInterface) => {
    // 1. Add review_text back to review table
    await queryInterface.addColumn('review', 'review_text', {
      type: DataTypes.TEXT,
      allowNull: true
    });

    // 2. Drop review_detail table
    await queryInterface.dropTable('review_detail');
  }
};
