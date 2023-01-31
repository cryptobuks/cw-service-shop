const { db, envPrefix, es, ctr } = require('@cowellness/cw-micro-service')()
const constants = require('../product/product.constants')
// const allowedType = ['CH', 'CW', 'CU']
/**
 * @class ProductTemplateController
 * @classdesc Controller ProductTemplate
 */
class ProductTemplateController {
  constructor () {
    this.ProductTemplate = db.shop.model('ProductTemplate')
  }

  /**
   * Create Product template
   * @param {*} param0 product template data
   * @returns template
   */
  async createTemplate ({ _user, isVirtual, name, description, manufacturer, categories = [], details, items = [] }) {
    this.checkAccess(_user)
    const categoryIds = await ctr.product.hydrateCategories(categories, null)
    const hydratedItems = await ctr.product.hydrateItems(items, null)

    return this.ProductTemplate.create({
      isVirtual,
      name,
      description,
      manufacturer,
      categoryIds,
      details,
      items: hydratedItems.map(item => ({
        ...item,
        quantity: 0
      }))
    })
  }

  checkAccess (user) {
    // if (!allowedType.includes(user.typeCode)) {
    //   throw new Error('Access denied')
    // }
  }

  /**
   * Create Product template
   * @param {*} param0 product template data
   * @returns template
   */
  async updateTemplate ({ _user, templateId, isVirtual, name, description, manufacturer, categories = [], details, items = [] }) {
    this.checkAccess(_user)
    const product = await this.ProductTemplate.findOne({
      _id: templateId
    })

    if (!product) {
      return null
    }

    const categoryIds = await ctr.product.hydrateCategories(categories, null)
    const hydratedItems = await ctr.product.hydrateItems(items, null)

    product.set({
      isVirtual,
      name,
      description,
      manufacturer,
      categoryIds,
      details,
      items: hydratedItems.map(item => {
        const productItem = product.items.find(i => i._id.toString() === item._id.toString())
        const isQuantityChange = productItem?.quantity !== item.quantity
        if (isQuantityChange) {
          item.quantityValue = item.quantity
        }
        item.quantity = productItem.quantity
        return item
      })
    })
    return product.save()
  }

  /**
   * Lists all current user products
   * @returns list of products
   */
  async getTemplates ({ _user }) {
    this.checkAccess(_user)
    return this.ProductTemplate.find()
  }

  /**
   * Delete a template by id
   * @param {*} param0 {templateId}
   * @returns delete count
   */
  async deleteTemplate ({ _user, templateId }) {
    this.checkAccess(_user)
    const deleted = await this.ProductTemplate.deleteOne({
      _id: templateId
    })

    await this.deleteEsIndex(templateId)
    return deleted.deletedCount
  }

  /**
   * Delete es index docs
   * @param {*} templateId
   * @returns es stats
   */
  async deleteEsIndex (templateId) {
    return es.deleteByQuery({
      index: envPrefix + constants.productsIndex,
      body: {
        query: {
          prefix: {
            id: templateId
          }
        }
      }
    })
  }

  /**
   * Update template ES index
   * @param template
   */
  async updateEsIndex (template) {
    await this.deleteEsIndex(template._id.toString())
    const languages = Object.keys(template.name)
    const docs = languages.map(lang => {
      const body = {
        id: template._id,
        type: 'template',
        name: template.name[lang],
        description: template.description[lang],
        createdAt: template.createdAt,
        updatedAt: template.updatedAt
      }
      return es.index({
        index: envPrefix + constants.productsIndex,
        id: `${template._id}-${lang}`,
        body: body
      })
    })

    return Promise.all(docs)
  }
}

module.exports = ProductTemplateController
