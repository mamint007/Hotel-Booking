import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    NonAttribute
} from 'sequelize'

import { sequelize } from '../sequelize'
import { BookingModel } from './Booking'
import { RoomModel } from './Room'

export class BookingDetailModel extends Model<
    InferAttributes<BookingDetailModel>,
    InferCreationAttributes<BookingDetailModel>
> {
    declare booking_detail_id: string
    declare price_at_booking: number
    declare number_of_nights: number
    declare booking_id: string
    declare room_id: string

    declare booking?: NonAttribute<BookingModel>
    declare room?: NonAttribute<RoomModel>
}

BookingDetailModel.init(
    {
        booking_detail_id: {
            field: 'booking_detail_id',
            type: DataTypes.CHAR(7),
            primaryKey: true,
            allowNull: false
        },
        price_at_booking: {
            field: 'price_at_booking',
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        number_of_nights: {
            field: 'number_of_nights',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        booking_id: {
            field: 'booking_id',
            type: DataTypes.CHAR(7),
            allowNull: false
        },
        room_id: {
            field: 'room_id',
            type: DataTypes.CHAR(4),
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'booking_detail',
        modelName: 'booking_detail',
        timestamps: false
    }
)
