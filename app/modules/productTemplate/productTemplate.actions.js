const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class ProductTemplateActions
 * @classdesc Actions ProductTemplateActions
 */
class ProductTemplateActions {
  async createTemplate (data, reply) {
    try {
      const template = await ctr.productTemplate.createTemplate(data)

      return reply.cwSendSuccess({
        data: {
          template
        }
      })
    } catch (error) {
      return reply.cwSendFail({
        message: error.message
      })
    }
  }

  async updateTemplate (data, reply) {
    try {
      const template = await ctr.productTemplate.updateTemplate(data)

      return reply.cwSendSuccess({
        data: {
          template
        }
      })
    } catch (error) {
      return reply.cwSendFail({
        message: error.message
      })
    }
  }

  async getTemplates (data, reply) {
    try {
      const templates = await ctr.productTemplate.getTemplates(data)

      return reply.cwSendSuccess({
        data: {
          templates
        }
      })
    } catch (error) {
      return reply.cwSendFail({
        message: error.message
      })
    }
  }

  async deleteTemplate (data, reply) {
    try {
      const deleted = await ctr.productTemplate.deleteTemplate(data)

      return reply.cwSendSuccess({
        data: {
          deleted: !!deleted
        }
      })
    } catch (error) {
      return reply.cwSendFail({
        message: error.message
      })
    }
  }
}

module.exports = ProductTemplateActions
