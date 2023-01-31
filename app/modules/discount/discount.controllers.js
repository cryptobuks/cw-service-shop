const { db, _ } = require('@cowellness/cw-micro-service')()

/**
 * @class DiscountController
 * @classdesc Controller Discount
 */
class DiscountController {
  constructor () {
    this.Discount = db.shop.model('Discount')
  }

  getDiscounts ({ _user }) {
    return this.Discount.find({
      ownerId: _user.profileId,
      isDeleted: false
    })
  }

  createDiscount ({ _user, status, name, date, time, maxQuantity, type, value, target, items, createdFrom, updatedFrom }) {
    return this.Discount.create({
      ownerId: _user.profileId,
      status,
      name,
      date,
      time,
      maxQuantity,
      type,
      value,
      target,
      items,
      createdFrom,
      updatedFrom
    })
  }

  async updateDiscount ({ _user, discountId, status, name, date, time, maxQuantity, type, value, target, items, createdFrom, updatedFrom }) {
    const discount = await this.Discount.findOne({
      _id: discountId,
      ownerId: _user.profileId
    })

    if (!discount) {
      return null
    }
    this.setStatus(discount, status, date)
    discount.set({
      ownerId: _user.profileId,
      name,
      date,
      time,
      maxQuantity,
      type,
      value,
      target,
      items,
      createdFrom,
      updatedFrom
    })
    return discount.save()
  }

  async deleteDiscount ({ _user, discountId }) {
    const discount = await this.Discount.findOne({
      _id: discountId,
      ownerId: _user.profileId
    })
    if (!discount) {
      return null
    }
    const currentDate = new Date()
    const startDate = _.get(_.minBy(discount.date, 'startDate'), 'startDate')
    const shouldDelete = startDate ? currentDate < new Date(startDate) : false

    if (!shouldDelete) {
      throw new Error('Discount validity period set')
    }
    discount.isDeleted = true
    discount.deletedAt = Date.now()
    return discount.save()
  }

  async setStatus (discount, newStatus, date) {
    const currentDate = new Date()
    const validPeriod = date.map(d => currentDate >= new Date(d.startDate) && currentDate <= new Date(d.endDate)).filter(d => !d).length

    if (newStatus === 'suspended' && discount.status === 'active' && validPeriod) {
      discount.status = newStatus
    }
    if (newStatus === 'active' && discount.status === 'suspended' && validPeriod) {
      discount.status = newStatus
    }
    return discount
  }
}

module.exports = DiscountController
