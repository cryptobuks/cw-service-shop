const { db } = require('@cowellness/cw-micro-service')()

const Schema = db.shop.Schema

const categorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    sizes: [{
      type: Schema.Types.ObjectId,
      ref: 'Size'
    }],
    colors: [{
      type: Schema.Types.ObjectId,
      ref: 'Color'
    }],
    onlyForGymId: {
      type: String,
      default: null
    },
    isHiddenForCw: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

categorySchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next({
      message: 'Name should be unique',
      _message: '_errors.category.name_unique'
    })
  } else {
    next(error)
  }
})

module.exports = db.shop.model('Category', categorySchema)
