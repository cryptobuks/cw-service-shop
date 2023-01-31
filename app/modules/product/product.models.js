const itemsSchema = require('./subschema/items.subschema')
const { db, ctr } = require('@cowellness/cw-micro-service')()

const Schema = db.shop.Schema

const productSchema = new Schema(
  {
    ownerId: {
      type: String
    },
    isVirtual: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: false
    },
    name: {
      type: String
    },
    description: {
      type: String
    },
    manufacturer: {
      type: String
    },
    categoryIds: {
      type: [String]
    },
    details: {
      type: String
    },
    items: [itemsSchema],
    createdFrom: {
      type: String
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    publishedAt: {
      type: Date
    },
    isDeleted: {
      type: Boolean
    },
    deletedAt: {
      type: Date
    }
  },
  { timestamps: true }
)
productSchema.post('save', doc => ctr.product.updateEsIndex(doc))
productSchema.post('findOneAndUpdate', doc => ctr.product.updateEsIndex(doc))

module.exports = db.shop.model('Product', productSchema)
