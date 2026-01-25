import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable('role', {
        role_id: {
            field: 'role_id',
            type: DataTypes.CHAR(3),
            primaryKey: true,
            allowNull: false
        },
        role_name: {
            field: 'role_name',
            type: DataTypes.STRING(50),
            allowNull: false
        },
        is_active: {
            field: 'is_active',
            type: DataTypes.CHAR(1),
            allowNull: false
        }
    });

    await queryInterface.bulkInsert('role', [
        {
            role_id: 'R01',
            role_name: 'Owner',
            is_active: 'A'
        },
        {
            role_id: 'R02',
            role_name: 'Admin',
            is_active: 'A'
        },
        {
            role_id: 'R03',
            role_name: 'Employee',
            is_active: 'A'
        }
    ]);
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('role');
}
