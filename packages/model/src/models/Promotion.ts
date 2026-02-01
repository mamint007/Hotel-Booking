import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    NonAttribute
} from 'sequelize'

import { sequelize } from '../sequelize'
import { EmployeeModel } from './Employee'

export class PromotionModel extends Model<
    InferAttributes<PromotionModel>,
    InferCreationAttributes<PromotionModel>
> {
    declare promo_id: string
    declare promo_name: string
    declare discount_value: number
    declare usage_per_user: number
    declare promo_start_date: Date
    declare promo_end_date: Date
    declare promo_detail: string
    declare is_active: string
    declare employee_id: string

    declare employee?: NonAttribute<EmployeeModel>
}

PromotionModel.init(
    {
        promo_id: {
            field: 'promo_id',
            type: DataTypes.CHAR(7),
            primaryKey: true,
            allowNull: false
        },
        promo_name: {
            field: 'promo_name',
            type: DataTypes.STRING(50),
            allowNull: false
        },
        discount_value: {
            field: 'discount_value',
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        usage_per_user: {
            field: 'usage_per_user',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        promo_start_date: {
            field: 'promo_start_date',
            type: DataTypes.DATE,
            allowNull: false
        },
        promo_end_date: {
            field: 'promo_end_date',
            type: DataTypes.DATE,
            allowNull: false
        },
        promo_detail: {
            field: 'promo_detail',
            type: DataTypes.STRING(255),
            allowNull: false
        },
        is_active: {
            field: 'is_active',
            type: DataTypes.CHAR(1),
            allowNull: false
        },
        employee_id: {
            field: 'employee_id',
            type: DataTypes.CHAR(4),
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'promotion',
        modelName: 'promotion',
        timestamps: false
    }
)
