import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable('employee', {
        employee_id: {
            field: 'employee_id',
            type: DataTypes.CHAR(4),
            primaryKey: true,
            allowNull: false
        },
        emp_firstname: {
            field: 'emp_firstname',
            type: DataTypes.STRING(50),
            allowNull: false
        },
        emp_lastname: {
            field: 'emp_lastname',
            type: DataTypes.STRING(50),
            allowNull: false
        },
        emp_sex: {
            field: 'emp_sex',
            type: DataTypes.CHAR(1),
            allowNull: false
        },
        emp_tel: {
            field: 'emp_tel',
            type: DataTypes.STRING(10),
            allowNull: false
        },
        emp_email: {
            field: 'emp_email',
            type: DataTypes.STRING(50),
            allowNull: false
        },
        emp_password: {
            field: 'emp_password',
            type: DataTypes.STRING(20),
            allowNull: false
        },
        role_id: {
            field: 'role_id',
            type: DataTypes.CHAR(3),
            allowNull: false,
            references: {
                model: 'role',
                key: 'role_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'NO ACTION'
        }
    });
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('employee');
}
