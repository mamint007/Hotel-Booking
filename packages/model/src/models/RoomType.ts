import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional
} from 'sequelize'

import { sequelize } from '../sequelize'

export class RoomTypeModel extends Model<
    InferAttributes<RoomTypeModel>,
    InferCreationAttributes<RoomTypeModel>
> {
    declare room_type_id: string
    declare room_type_name: string
}

RoomTypeModel.init(
    {
        room_type_id: {
            field: 'room_type_id',
            type: DataTypes.CHAR(3),
            primaryKey: true,
            allowNull: false
        },
        room_type_name: {
            field: 'room_type_name',
            type: DataTypes.STRING(50),
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: 'room_type',
        modelName: 'room_type',
        timestamps: false
    }
)
