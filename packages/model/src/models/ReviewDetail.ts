import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    NonAttribute
} from 'sequelize'

import { sequelize } from '../sequelize'
import type { ReviewModel } from './Review'

export class ReviewDetailModel extends Model<
    InferAttributes<ReviewDetailModel>,
    InferCreationAttributes<ReviewDetailModel>
> {
    declare review_id: string
    declare rating: number
    declare room_id: string
    declare booking_id: string
    declare comment: string | null

    declare review?: NonAttribute<ReviewModel>
}

ReviewDetailModel.init(
    {
        review_id: {
            field: 'review_id',
            type: DataTypes.CHAR(7),
            primaryKey: true,
            allowNull: false
        },
        rating: {
            field: 'rating',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        room_id: {
            field: 'room_id',
            type: DataTypes.CHAR(7),
            allowNull: false
        },
        booking_id: {
            field: 'booking_id',
            type: DataTypes.CHAR(7),
            allowNull: false
        },
        comment: {
            field: 'comment',
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: 'review_detail',
        modelName: 'review_detail',
        timestamps: false
    }
)
