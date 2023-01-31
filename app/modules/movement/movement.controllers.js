const { db, ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class MovementController
 * @classdesc Controller Movement
 */
class MovementController {
  constructor () {
    this.Movement = db.shop.model('Movement')
  }

  /**
   * Create a stock entry
   * @param {*} param0 {ownerId, productId, itemId, supplierId, cost, quantity, note}
   * @returns stock movement
   */
  async addMovement ({ ownerId, productId, itemId, supplierId, cost, quantity, note }) {
    const movement = await this.Movement.create({
      ownerId, productId, itemId, supplierId, cost, quantity, note
    })

    await ctr.product.updateItemMovement(movement)
    return movement
  }
}

module.exports = MovementController
