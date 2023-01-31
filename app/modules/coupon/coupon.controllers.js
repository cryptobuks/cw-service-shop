const { db, _ } = require('@cowellness/cw-micro-service')()
const { customAlphabet } = require('nanoid')
const cdigit = require('cdigit')
const constants = require('./coupon.constants')
const nanoid = customAlphabet(constants.nanoIdAlphabets, constants.nanoIdLength)
/**
 * @class CouponController
 * @classdesc Controller Coupon
 */
class CouponController {
  constructor () {
    this.Coupon = db.shop.model('Coupon')
  }

  getCoupons ({ _user }) {
    return this.Coupon.find({
      ownerId: _user.profileId,
      isDeleted: false
    })
  }

  async createCoupon ({ _user, status, name, date, time, maxQuantity, value, target, isFixed, labelFixed, prefix, items, createdFrom, updatedFrom }) {
    const couponData = {
      ownerId: _user.profileId,
      status,
      name,
      date,
      time,
      maxQuantity,
      value,
      target,
      isFixed,
      items,
      createdFrom,
      updatedFrom
    }
    couponData.coupons = [{ coupon: labelFixed }]
    if (!isFixed) {
      if (prefix) {
        const prefixExist = await this.prefixExists(_user.profileId, prefix)

        if (prefixExist) {
          throw new Error('Prefix already exist')
        }
      }
      couponData.coupons = this.generateCoupons(maxQuantity, prefix)
    }
    return this.Coupon.create(couponData)
  }

  async updateCoupon ({ _user, couponId, status, name, date, time, maxQuantity, value, target, isFixed, labelFixed, prefix, items, createdFrom, updatedFrom }) {
    const coupon = await this.Coupon.findOne({
      _id: couponId,
      ownerId: _user.profileId
    })
    if (!coupon) {
      return null
    }
    if (isFixed) {
      const fixedCoupon = _.first(coupon.coupons)

      if (fixedCoupon.sharedAt) {
        throw new Error('Can not update shared coupon')
      }
      coupon.coupons = [{ coupon: labelFixed }]
    }
    if (maxQuantity > coupon.maxQuantity && !isFixed) {
      if (prefix) {
        const prefixExist = await this.prefixExists(_user.profileId, prefix, coupon._id)

        if (prefixExist) {
          throw new Error('Prefix already exist')
        }
      }
      const moreCoupons = this.generateCoupons(maxQuantity - coupon.maxQuantity, prefix)
      moreCoupons.forEach(c => {
        coupon.coupons.push(c)
      })
    }
    this.setStatus(coupon, status, date)
    coupon.set({
      name,
      date,
      time,
      maxQuantity,
      value,
      target,
      isFixed,
      labelFixed,
      items,
      createdFrom,
      updatedFrom
    })
    return coupon.save()
  }

  generateCoupons (quantity, prefix) {
    prefix = prefix || nanoid(3)
    const coupons = []
    for (let i = 0; i < quantity; i++) {
      const randomCode = nanoid()
      const checkDigit = cdigit.mod37_36.generate(randomCode)
      const coupon = `${prefix}-${checkDigit}`.toUpperCase()

      coupons.push({
        coupon
      })
    }
    return coupons
  }

  async deleteCoupon ({ _user, couponId }) {
    const coupon = await this.Coupon.findOne({
      _id: couponId,
      ownerId: _user.profileId
    })
    if (!coupon) {
      return null
    }
    const currentDate = new Date()
    const startDate = _.get(_.minBy(coupon.date, 'startDate'), 'startDate')
    const shouldDelete = startDate ? currentDate < new Date(startDate) : false

    if (!shouldDelete) {
      throw new Error('Coupon validity period set')
    }

    coupon.isDeleted = true
    coupon.deletedAt = Date.now()
    return coupon.save()
  }

  async prefixExists (ownerId, prefix, couponId = null) {
    const coupon = await this.Coupon.findOne({
      _id: {
        $ne: couponId
      },
      ownerId,
      'coupons.coupon': new RegExp(`^${prefix}`)
    })

    return !!coupon
  }

  async setStatus (coupon, newStatus, date) {
    const currentDate = new Date()
    const validPeriod = date.map(d => currentDate >= new Date(d.startDate) && currentDate <= new Date(d.endDate)).filter(d => !d).length

    if (newStatus === 'suspended' && coupon.status === 'active' && validPeriod) {
      coupon.status = newStatus
    }
    if (newStatus === 'active' && coupon.status === 'suspended' && validPeriod) {
      coupon.status = newStatus
    }
    return coupon
  }
}

module.exports = CouponController
