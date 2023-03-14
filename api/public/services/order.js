/* eslint-disable chai-friendly/no-unused-expressions */
import db from '../../src/models/index.js';
import authorization from '../../utils/general/authorizationfunc.js';
import { Op } from 'sequelize';

class OrderServices {

	static async getAll (req) {

		try {

			const where = {};

			if (req.body.ids && req.body.ids.length > 0) {
				where.id = {
					[Op.in]: req.body.ids
				};
			}

			else if ( req.body.date && req.body.date.length > 0) {
				where.date = {
					[Op.between]: req.body.date
				};
			}

			let auth = await authorization.authorizeUser(req, 1);
			if (auth.type === true){
				let orders = await db.orders.findAll({where, order: [ [ 'id', 'DESC' ] ]});
				return {type: true, data: orders, message: 'Succesfully Orders Retrieved'};
			}
			else {
				let orders = await db.orders.findAll({
					where: {
						customer_id: req.session.userid
					}
				});
				return {type: true, data: orders, message: 'Succesfully Orders Retrieved'};
			}

		}

		catch (err) {

			return {type: false, data: null, message: `Error while Paginating Orders: ${err}`};

		}

	}

	static async getOrderById (req) {

		try {
			let auth = await authorization.authorizeUser(req, 1);
			let {id} = req.params;
			if (auth.type === true){
				let orders = await db.orders.findByPk(id);
				return {type: true, data: orders, message: 'Succesfully Orders Retrieved'};
			}
			else {
				let orders = await db.orders.findAll({
					where: {
						customer_id: req.session.userid,
						id: id
					}
				});
				if (orders.length > 0){
					return {type: true, data: orders, message: 'Succesfully Orders Retrieved'};
				}
				else {
					return {type: false, data: null, message: 'Order not found'};
				}
			}
		}

		catch (err) {

			return {type: false, data: null, message: `Error while Paginating Orders: ${err}`};

		}

	}
    
	static async create (req) {
		try {
			let createdOrder = await db.orders.create({
				date: req.body.date,
				customer_id: req.body.customer_id,
				created_at: new Date()
			});

			return { type: true, data: createdOrder, message: 'Succesfully Order Created'};
		}
		catch (err){

			return { type: false, message: `Error while creating Order: ${err}` };
		
		}
	}
    
	static async delete (req) {

		try {
			
			let auth = await authorization.authorizeUser(req, 2);
			let {id} = req.params;
			if (auth.type === true){
				let deletedOrder = await db.orders.findByPk(id);
			
				if (deletedOrder) {
					await deletedOrder.update({is_removed: true});
					return {type: true, message: 'Succesfully Order Deleted'};
				}
			
				else {
					return {type: false, message: 'Order not found'};
				}
			}
			else {
				let deletedOrder = await db.orders.findAll({
					where: {
						customer_id: req.session.userid,
						id: id
					}
				});
				if (deletedOrder.length > 0){
					await deletedOrder[0].update({is_removed: true});
					return {type: true, message: 'Succesfully Order Deleted'};
				}
				else {
					return {type: false, message: 'Order not found'};
				}
			}
		
		}
		
		catch (err) {
		
			return { type: false, message: `Error while deleting Order: ${err}` };
		
		}
	}

	/*
	 * static async getMyOrder (req) {
	 * 	try {
	 * 		let id = req.session.userid;
	 * 		let orders = await db.orders.findByPk(id);
	 * 		return {type: true, data: orders, message: 'Succesfully Orders Retrieved'};
	 * 	}
	 * 	catch (err) {
	 * 		return {type: false, data: null, message: `Error while Paginating Orders: ${err}`};
	 * 	}
	 * }
	 */

	/*
	 * static async deleteMyOrder (req) {
	 * 	try {
	 * 		let id = req.session.userid;
	 * 		let deletedOrder = await db.orders.findByPk(id);
	 * 		if (deletedOrder) {
	 * 			await deletedOrder.update({is_removed: true});
	 * 			return {type: true, message: 'Succesfully Order Deleted'};
	 * 		}
	 * 		else {
	 * 			return {type: false, message: 'Order not found'};
	 * 		}
	 * 	}
	 * 	catch (err) {
	 * 		return {type: false, data: null, message: `Error while Paginating Orders: ${err}`};
	 * 	}
	 * }
	 */

}

export default OrderServices;