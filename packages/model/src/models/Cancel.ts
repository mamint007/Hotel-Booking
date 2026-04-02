import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
} from 'sequelize'

import { sequelize } from '../sequelize'

export class CancelModel extends Model<
    InferAttributes<CancelModel>,
    InferCreationAttributes<CancelModel>
> {
    declare cancel_id: string
    declare cancel_date: Date
    declare cancel_type: string // 'A' = Automation, 'M' = Member
    declare booking_id: string
}

CancelModel.init(
    {
        cancel_id: {
            field: 'cancel_id',
            type: DataTypes.CHAR(7),
            primaryKey: true,
            allowNull: false
        },
        cancel_date: {
            field: 'cancel_date',
            type: DataTypes.DATE,
            allowNull: false
        },
        cancel_type: {
            field: 'cancel_type',
            type: DataTypes.CHAR(1),
            allowNull: false
        },
        booking_id: {
            field: 'booking_id',
            type: DataTypes.CHAR(7),
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'cancel',
        modelName: 'cancel',
        timestamps: false
    }
)
