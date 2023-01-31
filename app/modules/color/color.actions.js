const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class ColorActions
 * @classdesc Actions Color
 */
class ColorActions {
  async getColors (data, reply) {
    const colors = await ctr.color.find(data)
    return reply.cwSendSuccess({
      data: {
        colors
      }
    })
  }

  async createColor (data, reply) {
    try {
      const color = await ctr.color.findOrCreate(data)

      reply.cwSendSuccess({
        message: 'Color has been saved successfully.',
        _message: '_responses.saved_successfully',
        data: {
          color
        }
      })
    } catch (error) {
      reply.cwSendFail({
        message: error.message,
        _message: error._message ? error._message : null
      })
    }
  }

  async setColor (data, reply) {
    try {
      const updated = await ctr.color.findOneAndUpdate({ _id: data.colorId }, data)

      if (!updated) {
        return reply.cwSendFail({
          message: 'Color not found',
          _message: '_errors.not_found'
        })
      }
      reply.cwSendSuccess({
        message: 'Color has been saved successfully.',
        _message: '_responses.saved_successfully',
        data: {
          color: updated
        }
      })
    } catch (error) {
      reply.cwSendFail({
        message: error.message,
        _message: error._message ? error._message : null
      })
    }
  }

  async deleteColor (data, reply) {
    try {
      const deleted = await ctr.color.deleteColor(data)

      if (!deleted) {
        return reply.cwSendFail({
          message: 'Color could not be deleted because it has children.',
          _message: '_responses.color.delete_failed'
        })
      }
      return reply.cwSendSuccess({
        message: 'Color has been deleted successfully.',
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

module.exports = ColorActions
