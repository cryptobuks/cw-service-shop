const itemsSchema = require('./subschema/items.subschema')
const { db, ctr } = require('@cowellness/cw-micro-service')()

const Schema = db.shop.Schema

const productSchema = new Schema(
  {
    isVirtual: {
      type: Boolean,
      default: false
    },
    name: {
      type: Object
    },
    description: {
      type: Object
    },
    manufacturer: {
      type: String
    },
    categoryIds: {
      type: [String]
    },
    details: {
      type: Object
    },
    items: [itemsSchema]
  },
  { timestamps: true }
)
productSchema.post('save', doc => ctr.productTemplate.updateEsIndex(doc))
productSchema.post('findOneAndUpdate', doc => ctr.productTemplate.updateEsIndex(doc))

module.exports = db.shop.model('ProductTemplate', productSchema)
