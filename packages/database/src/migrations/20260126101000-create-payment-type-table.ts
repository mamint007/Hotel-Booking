import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable('payment_type', {
        payment_type_id: {
            field: 'payment_type_id',
            type: DataTypes.CHAR(3),
            primaryKey: true,
            allowNull: false
        },
        payment_type_name: {
            field: 'payment_type_name',
            type: DataTypes.STRING(50),
            allowNull: false
        },
        deposit_percentage: {
            field: 'deposit_percentage',
            type: DataTypes.INTEGER,
            allowNull: true // Based on typical optionality, though data shows values. Let's make it allow null or default? Image doesn't strictly say constraint, but safe to match types. integer is correct.
        }
    });

    await queryInterface.bulkInsert('payment_type', [
        {
            payment_type_id: 'P01',
            payment_type_name: 'Full Payment',
            deposit_percentage: 100
        },
        {
            payment_type_id: 'P02',
            payment_type_name: 'Deposit',
            deposit_percentage: 50
        }
    ]);
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('payment_type');
}
