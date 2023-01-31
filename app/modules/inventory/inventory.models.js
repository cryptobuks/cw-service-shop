const { db } = require('@cowellness/cw-micro-service')()

const constants = require('./inventory.constant')

const Schema = db.shop.Schema

const newSchema = new Schema(
  {
    name: {
      type: String
    },
    ownerId: {
      type: String
    },
    inventoryCost: {
      type: String,
      enum: constants.inventoryCost
    },
    items: [{
      productId: {
        type: String
      },
      quantity: {
        type: String
      },
      stockValue: {
        type: Number
      },
      createdAt: {
        type: Date,
        default: new Date()
      },
      createdFrom: {
        type: String
      }
    }]
  },
  { timestamps: true }
)

module.exports = db.shop.model('Inventory', newSchema)
