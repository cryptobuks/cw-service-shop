const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class DiscountActions
 * @classdesc Actions Discount
 */
class DiscountActions {
  async getDiscounts (data, reply) {
    const discounts = await ctr.discount.getDiscounts(data)

    return reply.cwSendSuccess({
      data: {
        discounts
      }
    })
  }

  async createDiscount (data, reply) {
    try {
      const discount = await ctr.discount.createDiscount(data)

      return reply.cwSendSuccess({
        data: {
          discount
        }
      })
    } catch (error) {
      return reply.cwSendFail({
        message: error.message
      })
    }
  }

  async updateDiscount (data, reply) {
    try {
      const discount = await ctr.discount.updateDiscount(data)

      return reply.cwSendSuccess({
        data: {
          discount
        }
      })
    } catch (error) {
      return reply.cwSendFail({
        message: error.message
      })
    }
  }

  async deleteDiscount (data, reply) {
    try {
      const deleted = await ctr.discount.deleteDiscount(data)

      return reply.cwSendSuccess({
        data: {
          deleted: !!deleted
        }
      })
    } catch (error) {
      return reply.cwSendFail({
        message: error.message
      })
    }
  }
}

module.exports = DiscountActions
