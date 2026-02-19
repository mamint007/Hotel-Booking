import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    NonAttribute
} from 'sequelize'

import { sequelize } from '../sequelize'
import { BookingModel } from './Booking'

export class CheckInCheckOutModel extends Model<
    InferAttributes<CheckInCheckOutModel>,
    InferCreationAttributes<CheckInCheckOutModel>
> {
    declare stay_id: string
    declare checkin_date: Date
    declare checkout_date: Date
    declare booking_id: string

    declare booking?: NonAttribute<BookingModel>
}

CheckInCheckOutModel.init(
    {
        stay_id: {
            field: 'stay_id',
            type: DataTypes.CHAR(7),
            primaryKey: true,
            allowNull: false
        },
        checkin_date: {
            field: 'checkin_date',
            type: DataTypes.DATE,
            allowNull: false
        },
        checkout_date: {
            field: 'checkout_date',
            type: DataTypes.DATE,
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
        tableName: 'checkin_checkout',
        modelName: 'checkin_checkout',
        timestamps: false
    }
)
