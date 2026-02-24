import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes
} from 'sequelize'

import { sequelize } from '../sequelize'

export class AdditionalChargeModel extends Model<
    InferAttributes<AdditionalChargeModel>,
    InferCreationAttributes<AdditionalChargeModel>
> {
    declare charge_id: string
    declare charge_name: string
    declare charge_amount: number
    declare charge_unit: string
}

AdditionalChargeModel.init(
    {
        charge_id: {
            field: 'charge_id',
            type: DataTypes.CHAR(3),
            primaryKey: true,
            allowNull: false
        },
        charge_name: {
            field: 'charge_name',
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        charge_amount: {
            field: 'charge_amount',
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        charge_unit: {
            field: 'charge_unit',
            type: DataTypes.STRING(50),
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: 'additional_charges',
        modelName: 'additional_charges',
        timestamps: false
    }
)
