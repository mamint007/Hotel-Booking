import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable('member', {
        member_id: {
            field: 'member_id',
            type: DataTypes.CHAR(7),
            primaryKey: true,
            allowNull: false
        },
        m_firstname: {
            field: 'm_firstname',
            type: DataTypes.STRING(50),
            allowNull: false
        },
        m_lastname: {
            field: 'm_lastname',
            type: DataTypes.STRING(50),
            allowNull: false
        },
        m_sex: {
            field: 'm_sex',
            type: DataTypes.CHAR(1),
            allowNull: false
        },
        m_tel: {
            field: 'm_tel',
            type: DataTypes.STRING(10),
            allowNull: false
        },
        m_email: {
            field: 'm_email',
            type: DataTypes.STRING(50),
            allowNull: false
        },
        m_password: {
            field: 'm_password',
            type: DataTypes.STRING(255), // Increased length for password hash
            allowNull: false
        }
    });
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('member');
}
