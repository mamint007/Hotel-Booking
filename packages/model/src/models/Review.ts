import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    NonAttribute
} from 'sequelize'

import { sequelize } from '../sequelize'
import { BookingModel } from './Booking'
import { MemberModel } from './Member'
import type { ReviewDetailModel } from './ReviewDetail'

export class ReviewModel extends Model<
    InferAttributes<ReviewModel>,
    InferCreationAttributes<ReviewModel>
> {
    declare review_id: string
    declare review_date: Date
    declare member_id: string

    declare member?: NonAttribute<MemberModel>
    declare review_detail?: NonAttribute<ReviewDetailModel>
}

ReviewModel.init(
    {
        review_id: {
            field: 'review_id',
            type: DataTypes.CHAR(7),
            primaryKey: true,
            allowNull: false
        },
        review_date: {
            field: 'review_date',
            type: DataTypes.DATE,
            allowNull: false
        },
        member_id: {
            field: 'member_id',
            type: DataTypes.CHAR(7),
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'review',
        modelName: 'review',
        timestamps: false
    }
)
