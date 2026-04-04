import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    NonAttribute
} from 'sequelize'

import { sequelize } from '../sequelize'
import { AdditionalChargeModel } from './AdditionalCharge'
import { CheckInCheckOutModel } from './CheckInCheckOut'

export class BookingAdditionalChargeModel extends Model<
    InferAttributes<BookingAdditionalChargeModel>,
    InferCreationAttributes<BookingAdditionalChargeModel>
> {
    declare charge_id: string
    declare stay_id: string

    declare charge?: NonAttribute<AdditionalChargeModel>
    declare stay?: NonAttribute<CheckInCheckOutModel>
}

BookingAdditionalChargeModel.init(
    {
        charge_id: {
            field: 'charge_id',
            type: DataTypes.CHAR(3),
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'additional_charges',
                key: 'charge_id'
            }
        },
        stay_id: {
            field: 'stay_id',
            type: DataTypes.CHAR(7),
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'checkin_checkout',
                key: 'stay_id'
            }
        }
    },
    {
        sequelize,
        tableName: 'booking_additional_charge',
        modelName: 'booking_additional_charge',
        timestamps: false
    }
)
