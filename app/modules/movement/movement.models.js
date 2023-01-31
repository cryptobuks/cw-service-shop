const { db } = require('@cowellness/cw-micro-service')()

const Schema = db.shop.Schema

const newSchema = new Schema(
  {
    ownerId: {
      type: String
    },
    productId: {
      type: String
    },
    itemId: {
      type: String
    },
    supplierId: {
      type: String
    },
    cost: {
      type: Number
    },
    quantity: {
      type: Number
    },
    note: {
      type: String
    }
  },
  { timestamps: true }
)

module.exports = db.shop.model('Movement', newSchema)
