/* eslint-disable no-unused-vars */
/* eslint-disable chai-friendly/no-unused-expressions */
import db from '../../src/models/index.js';
import { Op } from 'sequelize';

class ItemServices {

	static async getAll (req) {

		try {
			
			let where = {};

			if (req.body.ids && req.body.ids.length > 0) {
				where.id = {
					[Op.in]: req.body.ids
				};
			}

			else if (req.body.price && req.body.price.length > 0) {
				where.price = {
					[Op.between]: [ req.body.price.min, req.body.price.max ]
				};
			}

			let items = await db.items.findAll({where, order: [ [ 'id', 'DESC' ] ]});
			return {type: true, data: items, message: 'Succesfully Items Retrieved'};
		
		}
		
		catch (err) {
		
			return {type: false, data: null, message: `Error while Paginating Items: ${err}`};
		
		}
	}
    
	static async create (req) {
		
		try {
		
			let createdItem = await db.items.create({
				name: req.body.name,
				price: req.body.price,
				created_at: new Date()
			});
		
			return {  type: true, data: createdItem, message: 'Succesfully Item Created'};
		
		}
		
		catch (err) {
		
			return {type: false, data: null, message: `Error while creating Item: ${err}`};
		
		}
	}
    
	static async delete (req) {
		
		try {
		
			let {id} = req.params;
			let deletedItem = await db.items.findByPk(id);
		
			if (deletedItem) {
		
				await deletedItem.update({is_removed: true});
				return { type: true, data: deletedItem, message: 'Succesfully Item Deleted'};
		
			}
		
			else {
		
				return { type: false, data: null, message: 'Item not found'};
		
			}
		}
		
		catch (err) {
		
			return {type: false, data: null, message: `Error while deleting Item: ${err}`};
		
		}
	}

}

export default ItemServices;