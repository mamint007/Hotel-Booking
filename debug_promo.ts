
import { PromotionModel, EmployeeModel } from './packages/model/src/index';

async function test() {
    try {
        const promotions = await PromotionModel.findAll({
            include: [{
                model: EmployeeModel,
                as: 'employee',
                attributes: ['emp_firstname', 'emp_lastname']
            }],
            order: [['promo_id', 'ASC']]
        });
        console.log('Success:', promotions.length);
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
