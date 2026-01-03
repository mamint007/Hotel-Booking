import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional
} from 'sequelize'

import { sequelize } from '../sequelize'
import bcrypt from 'bcryptjs'

export class MemberModel extends Model<
    InferAttributes<MemberModel>,
    InferCreationAttributes<MemberModel>
> {
    declare member_id: string
    declare m_firstname: string
    declare m_lastname: string
    declare m_sex: string
    declare m_tel: string
    declare m_email: string
    declare m_password: string

    // ใช้ตรวจสอบ password
    // public async matchPassword(enteredPassword: string): Promise<boolean> {
    //     return await bcrypt.compare(enteredPassword, this.m_password)
    // }
}

MemberModel.init(
    {
        member_id: {
            field: 'member_id',
            type: DataTypes.CHAR(7),
            primaryKey: true,
            allowNull: false
        },
        m_firstname: {
            field: 'm_firstname',
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        m_lastname: {
            field: 'm_lastname',
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        m_sex: {
            field: 'm_sex',
            type: DataTypes.CHAR(1),
            allowNull: false,
        },
        m_tel: {
            field: 'm_tel',
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        m_email: {
            field: 'm_email',
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        m_password: {
            field: 'm_password',
            type: DataTypes.STRING(20), // แนะนำให้ยาวขึ้นเพื่อ hash
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'member',
        modelName: 'member',
        timestamps: false,

        // hooks: {
        //     beforeCreate: async (member: MemberModel) => {
        //         if (member.m_password) {
        //             const salt = await bcrypt.genSalt(10)
        //             member.m_password = await bcrypt.hash(member.m_password, salt)
        //         }
        //     },
        //     beforeUpdate: async (member: MemberModel) => {
        //         if (member.changed('m_password')) {
        //             const salt = await bcrypt.genSalt(10)
        //             member.m_password = await bcrypt.hash(member.m_password, salt)
        //         }
        //     },
        // },
    }
)
