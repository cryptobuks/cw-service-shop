const { db, rabbitmq, es, envPrefix, _, ctr } = require('@cowellness/cw-micro-service')()
const constants = require('./product.constants')
const sharp = require('sharp')
/**
 * @class ProductController
 * @classdesc Controller Product
 */
class ProductController {
  constructor () {
    this.Product = db.shop.model('Product')
    this.schemaTypes = db.shop.Types
  }

  /**
   * Upload product image
   * @param {*} param0 {base64, filename}
   * @returns uploaded file data
   */
  async uploadImage ({ base64, filename }) {
    const bufferData = await sharp(Buffer.from(base64, 'base64'))
      .resize(800)
      .jpeg({ quality: 80 })
      .toBuffer()
    const { data } = await rabbitmq.sendAndRead('/files/post', {
      filename,
      binData: bufferData.toString('base64')
    })

    rabbitmq.send('/files/optimize', {
      _id: data._id
    })
    return data
  }

  /**
   * Creates a Product
   * @param {*} param0 Product model data
   * @returns created product data
   */
  async createProduct ({ _user, isVirtual, name, description, manufacturer, categories = [], details, items = [], createdFrom, isPublished }) {
    const categoryIds = await this.hydrateCategories(categories, _user.profileId)
    const hydratedItems = await this.hydrateItems(items, _user.profileId)

    const product = await this.Product.create({
      ownerId: _user.profileId,
      isVirtual,
      name,
      description,
      manufacturer,
      categoryIds,
      details,
      items: hydratedItems.map(item => ({
        ...item,
        quantity: 0
      })),
      createdFrom,
      isPublished,
      publishedAt: isPublished ? Date.now() : null
    })

    await Promise.all(hydratedItems.map(item => {
      return ctr.movement.addMovement({
        ownerId: _user.profileId,
        productId: product._id,
        itemId: item._id,
        supplierId: item.lastSupplierId,
        cost: item.lastCost,
        quantity: item.quantity
      })
    }))

    return this.Product.findOne({ _id: product._id })
  }

  /**
   * Update or create categories
   * @param {*} categories array of objects
   * @param {*} profileId profileId
   * @returns list of category ids
   */
  async hydrateCategories (categories, profileId) {
    const existing = categories.filter(cat => !!cat._id).map(cat => cat._id)
    const newCategories = await Promise.all(categories.filter(cat => cat.name && !cat._id)
      .map(cat => ctr.category.create({ name: cat.name, onlyForGymId: profileId })))
    const categoryIds = newCategories.map(cat => cat._id)

    return [...existing, ...categoryIds]
  }

  /**
   * Update or create item, size and color
   * @param {*} items array of items
   * @param {*} profileId profileId
   * @returns list of formatted items
   */
  async hydrateItems (items, profileId) {
    return Promise.all(
      items.map(item => {
        return Promise.resolve()
          .then(async () => {
            if (!item._id) {
              item._id = this.schemaTypes.ObjectId()
            }
            if (item.size?._id) {
              item.sizeId = item.size._id
            } else if (item.size?.name) {
              const size = await ctr.size.findOrCreate({
                _user: {
                  profileId
                },
                name: item.color.name
              })
              item.sizeId = size._id
            }
            if (item.color?._id) {
              item.colorId = item.color._id
            } else if (item.color?.name) {
              const color = await ctr.color.findOrCreate({
                _user: {
                  profileId
                },
                name: item.color.name
              })
              item.colorId = color._id
            }
            return item
          })
      })
    )
  }

  /**
   * Updates product item.quantity from movement
   * @param {*} param0 movement data
   * @returns product
   */
  updateItemMovement (movement) {
    const set = {}
    if (movement.supplierId) {
      set['items.$[item].lastSupplierId'] = movement.supplierId
    }
    if (movement.cost) {
      set['items.$[item].lastCost'] = movement.cost
    }
    return this.Product.findOneAndUpdate({
      _id: movement.productId
    }, {
      $set: set,
      $inc: {
        'items.$[item].quantity': movement.quantity
      }
    }, {
      arrayFilters: [{
        'item._id': movement.itemId
      }]
    })
  }

  /**
   * Updates Product
   * @param {*} param0 Product model data
   * @returns updated product data
   */
  async updateProduct ({ _user, productId, isVirtual, name, description, manufacturer, categories = [], details, items = [], createdFrom, isPublished }) {
    const product = await this.Product.findOne({
      ownerId: _user.profileId,
      _id: productId
    })

    if (!product) {
      return null
    }

    const categoryIds = await this.hydrateCategories(categories, _user.profileId)
    const hydratedItems = await this.hydrateItems(items, _user.profileId)

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
      }),
      createdFrom,
      isPublished,
      publishedAt: isPublished ? Date.now() : null
    })
    await product.save()
    await Promise.all(hydratedItems.map(item => {
      // if quantity changed
      if (item.quantityValue) {
        return ctr.movement.addMovement({
          ownerId: _user.profileId,
          productId: product._id,
          itemId: item._id,
          supplierId: item.lastSupplierId,
          cost: item.lastCost,
          quantity: item.quantityValue
        })
      }
      return item
    }))
    return this.Product.findOne({ _id: product._id })
  }

  /**
   * Lists all current user products
   * @returns list of products
   */
  async getProducts ({ _user }) {
    return this.Product.find({
      ownerId: _user.profileId
    })
  }

  /**
   * Get Single product
   * @returns single product
   */
  async getProduct ({ _user, productId }) {
    return this.Product.find({
      ownerId: _user.profileId,
      _id: productId
    })
  }

  async deleteProduct ({ _user, productId }) {
    const product = await this.Product.findOne({
      ownerId: _user.profileId,
      _id: productId
    })

    if (!product) {
      return null
    }
    product.isDeleted = true
    product.deletedAt = Date.now()
    await es.delete({
      index: envPrefix + constants.productsIndex,
      id: productId
    })
    return product.save()
  }

  /**
   * Suggest product name based on input text
   * @param {*} param0 {text}
   * @returns list of product names
   */
  async suggestName ({ _user, text }) {
    const result = await es.search({
      index: envPrefix + constants.productsIndex,
      body: {
        size: 10,
        query: {
          bool: {
            must: [
              {
                bool: {
                  should: [
                    {
                      match: {
                        ownerId: _user.profileId
                      }
                    },
                    {
                      bool: {
                        must_not: {
                          exists: {
                            field: 'ownerId'
                          }
                        }
                      }
                    }
                  ]
                }
              },
              {
                query_string: {
                  fields: ['name'],
                  query: '*' + text + '*'
                }
              }
            ]
          }
        }
      }
    })
    const products = _.get(result, 'hits.hits', [])

    if (!products.length) {
      return []
    }
    return products.map(product => product._source)
  }

  /**
   * Suggest product description based on input text
   * @param {*} param0 {text}
   * @returns list of product description
   */
  async suggestDescription ({ _user, text }) {
    const result = await es.search({
      index: envPrefix + constants.productsIndex,
      body: {
        size: 10,
        query: {
          bool: {
            must: [
              {
                bool: {
                  should: [
                    {
                      match: {
                        ownerId: _user.profileId
                      }
                    },
                    {
                      bool: {
                        must_not: {
                          exists: {
                            field: 'ownerId'
                          }
                        }
                      }
                    }
                  ]
                }
              },
              {
                query_string: {
                  fields: ['description'],
                  query: '*' + text + '*'
                }
              }
            ]
          }
        }
      }
    })
    const products = _.get(result, 'hits.hits', [])

    if (!products.length) {
      return []
    }
    return products.map(product => product._source)
  }

  /**
   * Suggest companies with at least 1 product
   * @param {*} param0 {text}
   * @returns list of profiles
   */
  async suggestSuppliers ({ text }) {
    const result = await es.search({
      index: envPrefix + 'profiles',
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  typeCode: ['CO', 'CW', 'CU'].join(' OR ')
                }
              },
              {
                query_string: {
                  fields: ['displayName'],
                  query: '*' + text + '*'
                }
              }
            ]
          }
        }
      }
    })
    const profiles = _.get(result, 'hits.hits', [])

    if (!profiles.length) {
      return []
    }
    const companiesWithProduct = await this.Product.distinct('ownerId', {
      ownerId: profiles.map(profile => profile._id)
    })

    return profiles.filter(profile => companiesWithProduct.includes(profile._id)).map(profile => ({
      _id: profile._id,
      name: profile._source.displayName
    }))
  }

  /**
   * Update product ES index
   * @param product
   */
  async updateEsIndex (product) {
    if (product.isDeleted) return
    const body = {
      id: product._id,
      type: 'product',
      ownerId: product.ownerId,
      name: product.name,
      description: product.description,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }

    return es.index({
      index: envPrefix + constants.productsIndex,
      id: product._id.toString(),
      body: body
    })
  }
}

module.exports = ProductController
