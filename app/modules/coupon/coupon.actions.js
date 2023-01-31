const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class CouponActions
 * @classdesc Actions Coupon
 */
class CouponActions {
  async getCoupons (data, reply) {
    const coupons = await ctr.coupon.getCoupons(data)

    return reply.cwSendSuccess({
      data: {
        coupons
      }
    })
  }

  async createCoupon (data, reply) {
    try {
      const coupon = await ctr.coupon.createCoupon(data)

      return reply.cwSendSuccess({
        data: {
          coupon
        }
      })
    } catch (error) {
      return reply.cwSendFail({
        message: error.message
      })
    }
  }

  async updateCoupon (data, reply) {
    try {
      const coupon = await ctr.coupon.updateCoupon(data)

      return reply.cwSendSuccess({
        data: {
          coupon
        }
      })
    } catch (error) {
      return reply.cwSendFail({
        message: error.message
      })
    }
  }

  async deleteCoupon (data, reply) {
    try {
      const deleted = await ctr.coupon.deleteCoupon(data)

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

module.exports = CouponActions
