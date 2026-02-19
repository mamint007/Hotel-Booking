
import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    ForeignKey,
} from 'sequelize'

import { sequelize } from '../sequelize'
import { RoomModel } from './Room'
import { AmenityModel } from './Amenity'

export class RoomTypeDetailModel extends Model<
    InferAttributes<RoomTypeDetailModel>,
    InferCreationAttributes<RoomTypeDetailModel>
> {
    declare room_id: ForeignKey<string>
    declare amenity_id: ForeignKey<string>
}

RoomTypeDetailModel.init(
    {
        room_id: {
            field: 'room_id',
            type: DataTypes.CHAR(4),
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'room',
                key: 'room_id'
            }
        },
        amenity_id: {
            field: 'amenity_id',
            type: DataTypes.CHAR(3),
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'amenity',
                key: 'amenity_id'
            }
        }
    },
    {
        sequelize,
        tableName: 'room_type_detail',
        modelName: 'room_type_detail',
        timestamps: false
    }
)
