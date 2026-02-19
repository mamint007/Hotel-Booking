import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable('promotion', {
        promo_id: {
            type: DataTypes.CHAR(7),
            primaryKey: true,
            allowNull: false
        },
        promo_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        discount_value: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        usage_per_user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        promo_start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        promo_end_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        promo_detail: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        is_active: {
            type: DataTypes.CHAR(1),
            allowNull: false,
            defaultValue: 'A'
        },
        employee_id: {
            type: DataTypes.CHAR(4),
            allowNull: false,
            references: {
                model: 'employee',
                key: 'employee_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        }
    });
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('promotion');
}
