const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class CategoryActions
 * @classdesc Actions Category
 */
class CategoryActions {
  async getCategories (data, reply) {
    const categories = await ctr.category.find(data)
    return reply.cwSendSuccess({
      data: {
        categories
      }
    })
  }

  /**
   * Create category
   * @param {*} data
   * @param {*} reply
   */
  async createCategory (data, reply) {
    try {
      const category = await ctr.category.findOrCreate(data)

      reply.cwSendSuccess({
        message: 'Category has been saved successfully.',
        _message: '_responses.saved_successfully',
        data: {
          category
        }
      })
    } catch (error) {
      reply.cwSendFail({
        message: error.message,
        _message: error._message ? error._message : null
      })
    }
  }

  /**
   * Set Ctegory
   * @param {} data
   * @param {*} reply
   * @returns
   */
  async setCategory (data, reply) {
    try {
      const updated = await ctr.category.findOneAndUpdate({ _id: data.categoryId }, data)

      if (!updated) {
        return reply.cwSendFail({
          message: 'Category not found',
          _message: '_errors.not_found'
        })
      }
      reply.cwSendSuccess({
        message: 'Category has been updated successfully.',
        _message: '_responses.saved_successfully',
        data: {
          category: updated
        }
      })
    } catch (error) {
      reply.cwSendFail({
        message: error.message,
        _message: error._message ? error._message : null
      })
    }
  }

  /**
   * Delete a Category
   * @param {*} data
   * @param {*} reply
   * @returns
   */
  async deleteCategory (data, reply) {
    try {
      const deleted = await ctr.category.deleteCategory(data)

      if (!deleted) {
        return reply.cwSendFail({
          message: 'Category could not be deleted because it has children.',
          _message: '_responses.color.delete_failed'
        })
      }
      return reply.cwSendSuccess({
        message: 'Category has been deleted successfully.',
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

module.exports = CategoryActions
