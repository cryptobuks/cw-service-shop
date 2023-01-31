const { db } = require('@cowellness/cw-micro-service')()

const Schema = db.shop.Schema

const colorSchema = new Schema(
  {
    name: {
      type: String
    },
    onlyForGymId: {
      type: String,
      default: null
    },
    isTranslated: {
      type: Boolean,
      default: false
    },
    isHiddenForCw: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

colorSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next({
      message: 'Name should be unique',
      _message: '_errors.Color.name_unique'
    })
  } else {
    next(error)
  }
})

module.exports = db.shop.model('Color', colorSchema)
