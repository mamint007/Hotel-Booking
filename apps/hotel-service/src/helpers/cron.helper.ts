import cron from 'node-cron';
import { Op } from 'sequelize';
import { BookingModel, PaymentModel, CancelModel, sequelize } from '@hotel/models';
import winston from './winston';

export const initCronJobs = () => {
    // Run every hour at minute 0
    // cron.schedule('0 * * * *', async () => {
    
    // For testing and more frequent checks, every 5 minutes could be better
    cron.schedule('*/5 * * * *', async () => {
        winston.info('Cron Job: Checking for expired bookings...');
        const transaction = await sequelize.transaction();
        try {
            const now = new Date();

            // 1. Find Expired Payments (status 'P' and due_time < now)
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
                winston.info(`Cron Job: Found ${expiredPayments.length} expired payments. Cancelling...`);

                for (const payment of expiredPayments) {
                    const booking = await BookingModel.findByPk(payment.booking_id, { transaction });
                    
                    if (booking && (booking.booking_status === 'P' || booking.booking_status === 'U')) {
                        // 1. Generate Cancel ID
                        const lastCancel = await CancelModel.findOne({ order: [['cancel_id', 'DESC']], transaction });
                        let nextCancelId = '0000001';
                        if (lastCancel) {
                            const lastIdNum = parseInt(lastCancel.cancel_id);
                            if (!isNaN(lastIdNum)) {
                                nextCancelId = (lastIdNum + 1).toString().padStart(7, '0');
                            }
                        }

                        // 2. Update status
                        payment.payment_status = 'F'; // Expired
                        await payment.save({ transaction });

                        booking.booking_status = 'C'; // Cancelled
                        await booking.save({ transaction });

                        // 3. Create Cancel Record
                        await CancelModel.create({
                            cancel_id: nextCancelId,
                            cancel_date: new Date(),
                            cancel_type: 'A', // Automation
                            booking_id: booking.booking_id
                        }, { transaction });

                        winston.info(`Cron Job: Cancelled booking ${booking.booking_id} and recorded in Cancel table.`);
                    } else {
                        // If booking not found or already cancelled, just mark payment failed
                        payment.payment_status = 'F';
                        await payment.save({ transaction });
                    }
                }
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            winston.error('Cron Job Error:', error);
        }
    });

    winston.info('Cron Jobs initialized successfully.');
};
