import { BookingModel, sequelize } from './packages/model/src/index';

async function checkBookings() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');
        const latest = await BookingModel.findOne({
            order: [['booking_id', 'DESC']]
        });
        if (latest) {
            console.log(`Booking ID: ${latest.booking_id}`);
            console.log(`Raw value: ${latest.create_datetime}`);
            console.log(`ISO: ${latest.create_datetime.toISOString()}`);
            console.log(`Local: ${latest.create_datetime.toLocaleString()}`);
        } else {
            console.log('No bookings found');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkBookings();
