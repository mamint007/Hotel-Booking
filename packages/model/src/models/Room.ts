import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute
} from 'sequelize'

import { sequelize } from '../sequelize'
import { RoomTypeModel } from './RoomType'

export class RoomModel extends Model<
    InferAttributes<RoomModel>,
    InferCreationAttributes<RoomModel>
> {
    declare room_id: string
    declare room_number: string
    declare floor: number
    declare room_image: string | null
    declare price_per_night: number
    declare bed_type: string
    declare bed_quantity: number
    declare max_guest: number
    declare room_status: string
    declare room_type_id: string

    declare room_type?: NonAttribute<RoomTypeModel>
}

RoomModel.init(
    {
        room_id: {
            field: 'room_id',
            type: DataTypes.STRING(10),
            primaryKey: true,
            allowNull: false
        },
        room_number: {
            field: 'room_number',
            type: DataTypes.STRING(10),
            allowNull: false
        },
        floor: {
            field: 'floor',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        room_image: {
            field: 'room_image',
            type: DataTypes.STRING(255),
            allowNull: true
        },
        price_per_night: {
            field: 'price_per_night',
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        bed_type: {
            field: 'bed_type',
            type: DataTypes.CHAR(1),
            allowNull: false
        },
        bed_quantity: {
            field: 'bed_quantity',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        max_guest: {
            field: 'max_guest',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        room_status: {
            field: 'room_status',
            type: DataTypes.CHAR(1),
            allowNull: false
        },
        room_type_id: {
            field: 'room_type_id',
            type: DataTypes.CHAR(3),
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'room',
        modelName: 'room',
        timestamps: false
    }
)
