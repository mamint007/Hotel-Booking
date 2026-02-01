import { RoleModel } from './models/Role'
import { MemberModel } from './models/Member'
import { EmployeeModel } from './models/Employee'
import { RoomTypeModel } from './models/RoomType'
import { RoomModel } from './models/Room'
import { BookingModel } from './models/Booking'
import { BookingDetailModel } from './models/BookingDetail'
import { PaymentTypeModel } from './models/PaymentType'
import { PromotionModel } from './models/Promotion'

import { PaymentModel } from './models/Payment'

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

RoomTypeModel.hasMany(RoomModel, {
    foreignKey: 'room_type_id',
    sourceKey: 'room_type_id',
    as: 'rooms'
});

RoomModel.belongsTo(RoomTypeModel, {
    foreignKey: 'room_type_id',
    targetKey: 'room_type_id',
    as: 'room_type'
});

MemberModel.hasMany(BookingModel, {
    foreignKey: 'member_id',
    sourceKey: 'member_id',
    as: 'bookings'
});

BookingModel.belongsTo(MemberModel, {
    foreignKey: 'member_id',
    targetKey: 'member_id',
    as: 'member'
});

BookingModel.hasMany(BookingDetailModel, {
    foreignKey: 'booking_id',
    sourceKey: 'booking_id',
    as: 'booking_details'
});

BookingDetailModel.belongsTo(BookingModel, {
    foreignKey: 'booking_id',
    targetKey: 'booking_id',
    as: 'booking'
});

RoomModel.hasMany(BookingDetailModel, {
    foreignKey: 'room_id',
    sourceKey: 'room_id',
    as: 'booking_details'
});

BookingDetailModel.belongsTo(RoomModel, {
    foreignKey: 'room_id',
    targetKey: 'room_id',
    as: 'room'
});

PaymentTypeModel.hasMany(BookingModel, {
    foreignKey: 'payment_type_id',
    sourceKey: 'payment_type_id',
    as: 'bookings'
});

BookingModel.belongsTo(PaymentTypeModel, {
    foreignKey: 'payment_type_id',
    targetKey: 'payment_type_id',
    as: 'payment_type'
});

PromotionModel.hasMany(BookingModel, {
    foreignKey: 'promo_id',
    sourceKey: 'promo_id',
    as: 'bookings'
});

BookingModel.belongsTo(PromotionModel, {
    foreignKey: 'promo_id',
    targetKey: 'promo_id',
    as: 'promotion'
});

EmployeeModel.hasMany(PromotionModel, {
    foreignKey: 'employee_id',
    sourceKey: 'employee_id',
    as: 'promotions'
});

PromotionModel.belongsTo(EmployeeModel, {
    foreignKey: 'employee_id',
    targetKey: 'employee_id',
    as: 'employee'
});

BookingModel.hasMany(PaymentModel, {
    foreignKey: 'booking_id',
    sourceKey: 'booking_id',
    as: 'payments'
});

PaymentModel.belongsTo(BookingModel, {
    foreignKey: 'booking_id',
    targetKey: 'booking_id',
    as: 'booking'
});

EmployeeModel.hasMany(PaymentModel, {
    foreignKey: 'employee_id',
    sourceKey: 'employee_id',
    as: 'processed_payments'
});

PaymentModel.belongsTo(EmployeeModel, {
    foreignKey: 'employee_id',
    targetKey: 'employee_id',
    as: 'employee'
});

export * from './sequelize'
export * from './models/Member'
export * from './models/Role'
export * from './models/Employee'
export * from './models/RoomType'
export * from './models/Room'
export * from './models/Booking'
export * from './models/BookingDetail'
export * from './models/PaymentType'
export * from './models/Promotion'
export * from './models/Payment'
