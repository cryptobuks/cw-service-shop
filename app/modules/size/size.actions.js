const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class SizeActions
 * @classdesc Actions Size
 */
class SizeActions {
  async getSizes (data, reply) {
    const sizes = await ctr.size.find(data)
    return reply.cwSendSuccess({
      data: {
        sizes
      }
    })
  }

  async createSize (data, reply) {
    try {
      const size = await ctr.size.findOrCreate(data)

      reply.cwSendSuccess({
        message: 'Size has been saved successfully.',
        _message: '_responses.saved_successfully',
        data: {
          size
        }
      })
    } catch (error) {
      reply.cwSendFail({
        message: error.message,
        _message: error._message ? error._message : null
      })
    }
  }

  async setSize (data, reply) {
    try {
      const updated = await ctr.size.findOneAndUpdate({ _id: data.sizeId }, data)
      if (!updated) {
        return reply.cwSendFail({
          message: 'Size not found',
          _message: '_errors.not_found'
        })
      }
      reply.cwSendSuccess({
        message: 'Size has been saved successfully.',
        _message: '_responses.saved_successfully',
        data: {
          size: updated
        }
      })
    } catch (error) {
      reply.cwSendFail({
        message: error.message,
        _message: error._message ? error._message : null
      })
    }
  }

  async deleteSize (data, reply) {
    try {
      const deleted = await ctr.size.deleteSize(data)

      if (!deleted) {
        return reply.cwSendFail({
          message: 'Size could not be deleted because it has children.',
          _message: '_responses.size.delete_failed'
        })
      }
      return reply.cwSendSuccess({
        message: 'Size has been deleted successfully.',
        _message: '_responses.deleted_successfully'
      })
    } catch (error) {
      reply.cwSendFail({
        message: error.message,
        _message: error._message ? error._message : null
      })
    }
  }
}

module.exports = SizeActions
