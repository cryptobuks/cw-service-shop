const { db } = require('@cowellness/cw-micro-service')()

const Schema = db.shop.Schema

const newSchema = new Schema(
  {
    name: {
      type: String
    },
    onlyForGymId: {
      type: String,
      default: null
    },
    isHiddenForCw: {
      type: Boolean,
      default: false
    },
    isTranslated: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

module.exports = db.shop.model('Size', newSchema)
