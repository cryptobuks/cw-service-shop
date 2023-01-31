const { db } = require('@cowellness/cw-micro-service')()

const Schema = db.shop.Schema

const newSchema = new Schema(
  {
    ownerId: {
      type: String
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active'
    },
    name: {
      type: String
    },
    date: [{
      startDate: {
        type: Date
      },
      endDate: {
        type: Date
      }
    }],
    time: [{
      startTime: {
        type: String
      },
      endTime: {
        type: String
      }
    }],
    maxQuantity: {
      type: String
    },
    usedQuantity: {
      type: String,
      default: 0
    },
    type: {
      type: String,
      enum: ['amount', 'percent']
    },
    value: {
      type: Number
    },
    target: {
      type: Object
    },
    isForAllProducts: {
      type: Boolean
    },
    items: {
      type: [{
        type: {
          type: String,
          enum: ['subscription', 'product']
        },
        itemId: String
      }]
    },
    createdFrom: {
      type: String
    },
    updatedFrom: {
      type: String
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date
    }
  },
  { timestamps: true }
)

module.exports = db.shop.model('Discount', newSchema)
