import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes
} from 'sequelize'

import { sequelize } from '../sequelize'

export class RoleModel extends Model<
    InferAttributes<RoleModel>,
    InferCreationAttributes<RoleModel>
> {
    declare role_id: string
    declare role_name: string
    declare is_active: string
}

RoleModel.init(
    {
        role_id: {
            field: 'role_id',
            type: DataTypes.CHAR(3),
            primaryKey: true,
            allowNull: false
        },
        role_name: {
            field: 'role_name',
            type: DataTypes.STRING(50),
            allowNull: false
        },
        is_active: {
            field: 'is_active',
            type: DataTypes.CHAR(1),
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'role',
        modelName: 'role',
        timestamps: false
    }
)
