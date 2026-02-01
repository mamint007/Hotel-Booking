import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    NonAttribute
} from 'sequelize'

import { sequelize } from '../sequelize'
import { BookingModel } from './Booking'
import { EmployeeModel } from './Employee'

export class PaymentModel extends Model<
    InferAttributes<PaymentModel>,
    InferCreationAttributes<PaymentModel>
> {
    declare payment_id: string
    declare payment_date: Date
    declare payment_status: string
    declare slip_url: string
    declare payment_due_time: Date
    declare booking_id: string
    declare employee_id: string | null

    declare booking?: NonAttribute<BookingModel>
    declare employee?: NonAttribute<EmployeeModel>
}

PaymentModel.init(
    {
        payment_id: {
            field: 'payment_id',
            type: DataTypes.CHAR(7),
            primaryKey: true,
            allowNull: false
        },
        payment_date: {
            field: 'payment_date',
            type: DataTypes.DATE,
            allowNull: false
        },
        payment_status: {
            field: 'payment_status',
            type: DataTypes.CHAR(1),
            allowNull: false
        },
        slip_url: {
            field: 'slip_url',
            type: DataTypes.STRING(255),
            allowNull: true // Might be null if not uploaded yet? schema didn't explicitly show
        },
        payment_due_time: {
            field: 'payment_due_time',
            type: DataTypes.DATE,
            allowNull: false // Assuming due time is always set
        },
        booking_id: {
            field: 'booking_id',
            type: DataTypes.CHAR(7),
            allowNull: false
        },
        employee_id: {
            field: 'employee_id',
            type: DataTypes.CHAR(4),
            allowNull: true // Employee might not be assigned immediately
        }
    },
    {
        sequelize,
        tableName: 'payment',
        modelName: 'payment',
        timestamps: false
    }
)
