import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes
} from 'sequelize'

import { sequelize } from '../sequelize'

export class PaymentTypeModel extends Model<
    InferAttributes<PaymentTypeModel>,
    InferCreationAttributes<PaymentTypeModel>
> {
    declare payment_type_id: string
    declare payment_type_name: string
    declare deposit_percentage: number
}

PaymentTypeModel.init(
    {
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
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'payment_type',
        modelName: 'payment_type',
        timestamps: false
    }
)
