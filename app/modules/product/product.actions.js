const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class ProductActions
 * @classdesc Actions Product
 */
class ProductActions {
  async uploadImage (data, reply) {
    const image = await ctr.product.uploadImage(data)

    return reply.cwSendSuccess({
      data: {
        image
      }
    })
  }

  async createProduct (data, reply) {
    const product = await ctr.product.createProduct(data)

    return reply.cwSendSuccess({
      data: {
        product
      }
    })
  }

  async updateProduct (data, reply) {
    const product = await ctr.product.updateProduct(data)

    return reply.cwSendSuccess({
      data: {
        product
      }
    })
  }

  async getProducts (data, reply) {
    const products = await ctr.product.getProducts(data)

    return reply.cwSendSuccess({
      data: {
        products
      }
    })
  }

  async getProduct (data, reply) {
    const product = await ctr.product.getProduct(data)

    return reply.cwSendSuccess({
      data: {
        product
      }
    })
  }

  async suggestName (data, reply) {
    const suggestions = await ctr.product.suggestName(data)

    return reply.cwSendSuccess({
      data: {
        suggestions
      }
    })
  }

  async suggestDescription (data, reply) {
    const suggestions = await ctr.product.suggestDescription(data)

    return reply.cwSendSuccess({
      data: {
        suggestions
      }
    })
  }

  async suggestSuppliers (data, reply) {
    const manufacturers = await ctr.product.suggestSuppliers(data)

    return reply.cwSendSuccess({
      data: {
        manufacturers
      }
    })
  }

  async deleteProduct (data, reply) {
    const deleted = await ctr.product.deleteProduct(data)

    return reply.cwSendSuccess({
      data: {
        deleted: !!deleted
      }
    })
  }
}

module.exports = ProductActions
