import { Request, Response, NextFunction } from 'express';
import { BookingModel, BookingDetailModel, ReviewModel, MemberModel, ReviewDetailModel, sequelize } from "@hotel/models";
import { ServiceError } from "@hotel/helpers"

export const createReview = () => async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
        const { booking_id, rating, review_text } = req.body;
        const { id: member_id } = res.locals.user;

        if (!booking_id || !rating) {
            await transaction.rollback();
            return res.status(400).json({
                res_code: '0400',
                res_desc: 'Booking ID and rating are required'
            });
        }

        // Check if booking exists and belongs to user
        const booking = await BookingModel.findOne({
            where: { booking_id, member_id },
            include: [{
                model: BookingDetailModel,
                as: 'booking_details',
                limit: 1
            }],
            transaction
        });

        if (!booking) {
            await transaction.rollback();
            return res.status(404).json({
                res_code: '0404',
                res_desc: 'Booking not found'
            });
        }

        if (booking.is_review === 'Y') {
            await transaction.rollback();
            return res.status(400).json({
                res_code: '0400',
                res_desc: 'This booking has already been reviewed'
            });
        }

        // Get room_id from the first booking detail
        const room_id = booking.booking_details?.[0]?.room_id;
        if (!room_id) {
            await transaction.rollback();
            return res.status(400).json({
                res_code: '0400',
                res_desc: 'Room information not found for this booking'
            });
        }

        // Generate Review ID
        const lastReview = await ReviewModel.findOne({ order: [['review_id', 'DESC']], transaction });
        let nextReviewId = 'R000001';
        if (lastReview) {
            const lastIdNum = parseInt(lastReview.review_id.substring(1));
            if (!isNaN(lastIdNum)) {
                nextReviewId = `R${(lastIdNum + 1).toString().padStart(6, '0')}`;
            }
        }

        // 1. Create Review Header (Actual DB: review_id, review_date, member_id)
        await ReviewModel.create({
            review_id: nextReviewId,
            review_date: new Date(),
            member_id: member_id
        }, { transaction });

        // 2. Create Review Detail (Actual DB: rating, review_id, room_id, booking_id, comment)
        await ReviewDetailModel.create({
            review_id: nextReviewId,
            rating: rating,
            room_id: room_id,
            booking_id: booking_id,
            comment: review_text
        }, { transaction });

        // Update Booking is_review status
        booking.is_review = 'Y';
        await booking.save({ transaction });

        await transaction.commit();

        res.locals.response = {
            res_code: '0000',
            res_desc: 'Review submitted successfully'
        };
        next();

    } catch (error) {
        await transaction.rollback();
        console.error('Review Error:', error);
        next(error);
    }
}
