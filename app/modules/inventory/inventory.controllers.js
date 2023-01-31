const { db } = require('@cowellness/cw-micro-service')()

/**
 * @class InventoryController
 * @classdesc Controller Inventory
 */
class InventoryController {
  constructor () {
    this.Inventory = db.shop.model('Inventory')
  }

  find () {
    return this.Inventory.find({})
  }
}

module.exports = InventoryController
