import { Request, Response, NextFunction } from 'express';
import { RoomModel, RoomTypeModel, AmenityModel } from "@hotel/models";
import { Op, WhereOptions } from "sequelize";

export const getRooms = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { minPrice, maxPrice, type } = req.query;

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
