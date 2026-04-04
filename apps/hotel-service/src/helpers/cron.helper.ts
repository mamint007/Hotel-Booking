import cron from 'node-cron';
import { Op } from 'sequelize';
import { BookingModel, PaymentModel, CancelModel, sequelize } from '@hotel/models';
import winston from './winston';

export const initCronJobs = () => {
    // Run every hour at minute 0
    // cron.schedule('0 * * * *', async () => {
    
    // Run every 1 minute for testing (original: 0 * * * * or */5 * * * *)
    cron.schedule('*/1 * * * *', async () => {
        winston.info('Cron Job: Checking for expired bookings...');
        const transaction = await sequelize.transaction();
        try {
            const now = new Date();

            // 1. Find Expired Payments (status 'P' or 'U' and due_time < now)
            const expiredPayments = await PaymentModel.findAll({
                where: {
                    payment_status: { [Op.in]: ['P', 'U'] },
                    payment_due_time: {
                        [Op.lt]: now
                    }
                },
                transaction
            });

            if (expiredPayments.length > 0) {
                winston.info(`Cron Job: Found ${expiredPayments.length} expired payments. Processing cancellation...`);

                // Fetch last ID once outside the loop to avoid duplicate ID issues within the same transaction
                const lastCancel = await CancelModel.findOne({ order: [['cancel_id', 'DESC']], transaction });
                let nextIdNum = 1;
                if (lastCancel) {
                    const lastIdNum = parseInt(lastCancel.cancel_id);
                    if (!isNaN(lastIdNum)) {
                        nextIdNum = lastIdNum + 1;
                    }
                }

                for (const payment of expiredPayments) {
                    try {
                        const booking = await BookingModel.findByPk(payment.booking_id, { transaction });
                        
                        if (booking && (booking.booking_status === 'P' || booking.booking_status === 'U')) {
                            const nextCancelId = nextIdNum.toString().padStart(7, '0');
                            nextIdNum++;

                            // 1. Update status
                            payment.payment_status = 'C'; // Cancelled (was F)
                            await payment.save({ transaction });

                            booking.booking_status = 'C'; // Cancelled
                            await booking.save({ transaction });

                            // 2. Create Cancel Record
                            await CancelModel.create({
                                cancel_id: nextCancelId,
                                cancel_date: new Date(),
                                cancel_type: 'A', // Automation
                                booking_id: booking.booking_id
                            }, { transaction });

                            winston.info(`Cron Job: Successfully cancelled booking ${booking.booking_id} (ID: ${nextCancelId})`);
                        } else {
                            winston.info(`Cron Job: Booking ${payment.booking_id} already processed or not found. Skipping.`);
                            // Just mark payment failed if booking state already changed elsewhere
                            payment.payment_status = 'C';
                            await payment.save({ transaction });
                        }
                    } catch (itemError) {
                        winston.error(`Cron Job: Error processing booking ${payment.booking_id}:`, itemError);
                    }
                }
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            winston.error('Cron Job Critical Error (Transaction Rolled Back):', error);
        }
    });

    winston.info('Cron Jobs initialized successfully.');
};
