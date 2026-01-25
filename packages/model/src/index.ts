import { RoleModel } from './models/Role'
import { EmployeeModel } from './models/Employee'

// Define Relationships
RoleModel.hasMany(EmployeeModel, {
    foreignKey: 'role_id',
    sourceKey: 'role_id',
    as: 'employees'
});

EmployeeModel.belongsTo(RoleModel, {
    foreignKey: 'role_id',
    targetKey: 'role_id',
    as: 'role'
});

export * from './sequelize'
export * from './models/Member'
export * from './models/Role'
export * from './models/Employee'
