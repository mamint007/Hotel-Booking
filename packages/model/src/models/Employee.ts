import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    NonAttribute
} from 'sequelize'

import { sequelize } from '../sequelize'
import { RoleModel } from './Role'

export class EmployeeModel extends Model<
    InferAttributes<EmployeeModel>,
    InferCreationAttributes<EmployeeModel>
> {
    declare employee_id: string
    declare emp_firstname: string
    declare emp_lastname: string
    declare emp_sex: string
    declare emp_tel: string
    declare emp_email: string
    declare emp_password: string
    declare role_id: string
    declare role?: NonAttribute<RoleModel>
}

EmployeeModel.init(
    {
        employee_id: {
            field: 'employee_id',
            type: DataTypes.CHAR(4),
            primaryKey: true,
            allowNull: false
        },
        emp_firstname: {
            field: 'emp_firstname',
            type: DataTypes.STRING(50),
            allowNull: false
        },
        emp_lastname: {
            field: 'emp_lastname',
            type: DataTypes.STRING(50),
            allowNull: false
        },
        emp_sex: {
            field: 'emp_sex',
            type: DataTypes.CHAR(1),
            allowNull: false
        },
        emp_tel: {
            field: 'emp_tel',
            type: DataTypes.STRING(10),
            allowNull: false
        },
        emp_email: {
            field: 'emp_email',
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        emp_password: {
            field: 'emp_password',
            type: DataTypes.STRING(20),
            allowNull: false
        },
        role_id: {
            field: 'role_id',
            type: DataTypes.CHAR(3),
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'employee',
        modelName: 'employee',
        timestamps: false
    }
)
