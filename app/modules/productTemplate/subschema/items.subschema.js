const { db } = require('@cowellness/cw-micro-service')()
const Schema = db.shop.Schema
const constants = require('../../product/product.constants')
const itemsSchema = new Schema(
  {
    target: {
      type: String,
      enum: constants.target
    },
    sizeId: {
      type: String
    },
    colorId: {
      type: String
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
    isSelfService: {
      type: Boolean
    }
  },
  { timestamps: true }
)

module.exports = itemsSchema
