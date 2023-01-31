const { db } = require('@cowellness/cw-micro-service')()
const constants = require('../product.constants')
const Schema = db.shop.Schema

const itemsSchema = new Schema(
  {
    target: {
      type: String,
      enum: constants.target
    },
    vatRateId: {
      type: String
    },
    sizeId: {
      type: String
    },
    colorId: {
      type: String
    },
    quantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number
    },
    publicPrice: {
      type: Boolean
    },
    pictures: {
      type: [{
        imageId: String,
        filename: String
      }]
    },
    barCode: {
      type: String
    },
    lastSupplierId: {
      type: String
    },
    lastCost: {
      type: Number,
      default: 0
    },
    isSelfService: {
      type: Boolean
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

module.exports = itemsSchema
