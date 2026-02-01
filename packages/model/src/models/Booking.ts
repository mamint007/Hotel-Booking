import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    NonAttribute
} from 'sequelize'

import { sequelize } from '../sequelize'
import { MemberModel } from './Member'
import { BookingDetailModel } from './BookingDetail'

export class BookingModel extends Model<
    InferAttributes<BookingModel>,
    InferCreationAttributes<BookingModel>
> {
    declare booking_id: string
    declare create_datetime: Date
    declare booking_status: string
    declare is_review: string
    declare member_id: string
    declare payment_type_id: string
    declare promo_id: string | null

    declare member?: NonAttribute<MemberModel>
    declare booking_details?: NonAttribute<BookingDetailModel[]>
}

BookingModel.init(
    {
        booking_id: {
            field: 'booking_id',
            type: DataTypes.CHAR(7),
            primaryKey: true,
            allowNull: false
        },
        create_datetime: {
            field: 'create_datetime',
            type: DataTypes.DATE,
            allowNull: false
        },
        booking_status: {
            field: 'booking_status',
            type: DataTypes.CHAR(1),
            allowNull: false
        },
        is_review: {
            field: 'is_review',
            type: DataTypes.CHAR(1),
            allowNull: false
        },
        member_id: {
            field: 'member_id',
            type: DataTypes.CHAR(7),
            allowNull: false
        },
        payment_type_id: {
            field: 'payment_type_id',
            type: DataTypes.CHAR(3),
            allowNull: false
        },
        promo_id: {
            field: 'promo_id',
            type: DataTypes.CHAR(7),
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: 'booking',
        modelName: 'booking',
        timestamps: false
    }
)
