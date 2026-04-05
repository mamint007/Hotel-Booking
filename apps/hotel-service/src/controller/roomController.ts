import { Request, Response, NextFunction } from 'express';
import { RoomModel, RoomTypeModel, AmenityModel, AdditionalChargeModel, PromotionModel, CheckInCheckOutModel, BookingDetailModel, BookingModel, ReviewModel, MemberModel, ReviewDetailModel } from "@hotel/models";
import { ServiceError } from "@hotel/helpers"
import AdminMasterError from '../constants/errors/admin.error.json'
import { Op, WhereOptions } from "sequelize";

export const getRooms = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { minPrice, maxPrice, type, checkIn, checkOut } = req.query;

        // Base query
        const whereClause: WhereOptions<any> = {
            room_status: 'A' // Only available rooms
        };

        // Filter by price range if provided
        if (minPrice || maxPrice) {
            whereClause.price_per_night = {};
            if (minPrice) whereClause.price_per_night[Op.gte] = Number(minPrice);
            if (maxPrice) whereClause.price_per_night[Op.lte] = Number(maxPrice);
        }

        // Filter out rooms that are booked on overlapping dates
        if (checkIn && checkOut) {
            const checkInDate = new Date(checkIn as string);
            const checkOutDate = new Date(checkOut as string);

            // Find room_ids that have overlapping bookings
            const bookedDetails = await BookingDetailModel.findAll({
                include: [
                    {
                        model: BookingModel,
                        as: 'booking',
                        required: true,
                        where: {
                            booking_status: { [Op.notIn]: ['C'] } // exclude cancelled
                        },
                        include: [
                            {
                                model: CheckInCheckOutModel,
                                as: 'stay_details',
                                required: true,
                                where: {
                                    [Op.and]: [
                                        { checkin_date: { [Op.lt]: checkOutDate } },
                                        { checkout_date: { [Op.gt]: checkInDate } }
                                    ]
                                }
                            }
                        ]
                    }
                ],
                attributes: ['room_id']
            });

            const bookedRoomIds = bookedDetails.map((d: any) => d.room_id);

            if (bookedRoomIds.length > 0) {
                whereClause.room_id = { [Op.notIn]: bookedRoomIds };
            }
        }

        const includeClause: any[] = [{
            model: RoomTypeModel,
            as: 'room_type',
            attributes: ['room_type_name'],
            required: true // Inner join ensures we only get rooms with a valid type
        }, {
            model: AmenityModel,
            as: 'amenities',
            attributes: ['amenity_name', 'amenity_icon'],
            through: { attributes: [] }
        }];

        // Filter by Room Type if provided (and not 'ALL ROOM')
        if (type && type !== 'ALL ROOM') {
            includeClause[0].where = { room_type_name: type };
        }

        const rooms = await RoomModel.findAll({
            where: whereClause,
            include: includeClause,
            order: [['price_per_night', 'ASC']]
        });

        res.locals.rooms = rooms;
        next();
    } catch (error) {
        next(error);
    }
}


export const getAdditionalCharges = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const charges = await AdditionalChargeModel.findAll();
        res.locals.additionalCharges = charges;
        next();
    } catch (error) {
        next(error);
    }
}

export const validateCoupon = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { couponCode } = req.body;
        const memberId = req.user?.id || req.user?.member_id;

        if (!couponCode) {
            return next(new ServiceError(AdminMasterError.ERR_COUPON_CODE_REQUIRED));
        }

        const now = new Date();
        const promo = await PromotionModel.findOne({
            where: {
                promo_name: couponCode,
                is_active: 'A',
                promo_start_date: { [Op.lte]: now },
                promo_end_date: { [Op.gte]: now }
            }
        });

        if (!promo) {
            return next(new ServiceError(AdminMasterError.ERR_COUPON_INVALID_OR_EXPIRED));
        }

        // Check if user has exceeded their individual usage limit
        if (memberId) {
            const usageCount = await BookingModel.count({
                where: {
                    member_id: memberId,
                    promo_id: promo.promo_id,
                    booking_status: { [Op.ne]: 'C' } // Exclude cancelled bookings
                }
            });

            if (usageCount >= promo.usage_per_user) {
                return next(new ServiceError(AdminMasterError.ERR_PROMOTION_USER_QUOTA_EXCEEDED || AdminMasterError.ERR_PROMOTION_QUOTA_EXCEEDED));
            }
        }

        res.locals.promo = promo;
        next();

    } catch (error) {
        next(error);
    }
}

export const getReviews = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviews = await ReviewModel.findAll({
            include: [{
                model: MemberModel,
                as: 'member',
                attributes: ['m_firstname', 'm_lastname']
            }, {
                model: ReviewDetailModel,
                as: 'review_detail',
                attributes: ['rating', 'comment']
            }],
            order: [['review_date', 'DESC']],
            limit: 10
        });
        res.locals.reviews = reviews;
        next();
    } catch (error) {
        next(error);
    }
}

export const getPromotions = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const now = new Date();
        const promotions = await PromotionModel.findAll({
            where: {
                is_active: 'A',
                promo_start_date: { [Op.lte]: now },
                promo_end_date: { [Op.gte]: now }
            },
            order: [['promo_start_date', 'DESC']]
        });
        res.locals.promotions = promotions;
        next();
    } catch (error) {
        next(error);
    }
}
