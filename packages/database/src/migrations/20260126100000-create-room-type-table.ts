import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable('room_type', {
        room_type_id: {
            field: 'room_type_id',
            type: DataTypes.CHAR(3),
            primaryKey: true,
            allowNull: false
        },
        room_type_name: {
            field: 'room_type_name',
            type: DataTypes.STRING(50),
            allowNull: false
        }
    });

    await queryInterface.bulkInsert('room_type', [
        {
            room_type_id: 'T01',
            room_type_name: 'standard'
        },
        {
            room_type_id: 'T02',
            room_type_name: 'suite'
        }
    ]);
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('room_type');
}
