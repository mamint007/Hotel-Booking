
import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
} from 'sequelize'

import { sequelize } from '../sequelize'

export class AmenityModel extends Model<
    InferAttributes<AmenityModel>,
    InferCreationAttributes<AmenityModel>
> {
    declare amenity_id: string
    declare amenity_name: string
    declare amenity_icon: string | null
}

AmenityModel.init(
    {
        amenity_id: {
            field: 'amenity_id',
            type: DataTypes.CHAR(3),
            primaryKey: true,
            allowNull: false
        },
        amenity_name: {
            field: 'amenity_name',
            type: DataTypes.STRING(50),
            allowNull: false
        },
        amenity_icon: {
            field: 'amenity_icon',
            type: DataTypes.STRING(255),
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: 'amenity',
        modelName: 'amenity',
        timestamps: false
    }
)
