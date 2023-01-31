const { db, mongodb, log, rabbitmq, _, envPrefix, es } = require('@cowellness/cw-micro-service')()

/**
 * @class CategoryController
 * @classdesc Controller Category
 */
class CategoryController {
  constructor () {
    this.Category = db.shop.model('Category')
  }

  /**
   * getCategories
   * @param {Object} data
   */
  async find ({ _user }) {
    const categories = await this.Category.find({
      $or: [
        {
          isHiddenForCw: false
        },
        {
          onlyForGymId: _user.profileId
        }
      ]
    })
      .populate('sizes')
      .populate('colors')
      .lean()

    // get from rabbitmq
    const regex = '^_category'
    const { data } = await rabbitmq.sendAndRead('/settings/i18nEntry/get', {
      key: regex
    })
    log.info('fetch translation')
    log.info(data)

    const result = categories.map(category => {
      const key = this.translationKey(category.name)
      const entry = data.find(t => t.key === key)

      category.translations = _.get(entry, 'translations', {})
      return category
    })
    log.info('get categories')
    log.info(result)
    return result
  }

  /**
   * converts a name to translation key
   * @param {string} name
   */
  translationKey (name) {
    const slug = _.kebabCase(name)

    return (`_category.${slug}`)
  }

  /**
   * Create category
   * @param {object} data create category
   */

  async create (data) {
    if (data.parentId && mongodb.shop.isValidObjectId(data.parentId)) {
      const parentExists = await this.Category.findOne({ _id: data.parentId })
        .populate('sizes')
        .populate('colors')
        .lean()

      if (!parentExists) {
        data.parentId = null
      }
    }

    const category = await this.Category.create({
      ...data,
      onlyForGymId: data.onlyForGymId
    })

    category.populate('sizes').populate('colors').execPopulate()
    const key = this.translationKey(data.name)

    if (data.translations) {
      data.translations.en = data.name
      await rabbitmq.send('/settings/i18nEntry/create', {
        key,
        translations: data.translations
      })
    }

    return {
      ...category.toJSON(),
      translations: data.translations
    }
  }

  /**
   * getTypeCode
   * Get the typecode of the profile.
   */
  async getTypeCode (profileId) {
    if (!profileId) return null
    const result = await es.search({
      index: envPrefix + 'profiles',
      body: {
        size: 1,
        query: {
          bool: {
            should: [
              {
                match: {
                  _id: profileId
                }
              }
            ]
          }
        }
      }
    })
    const profiles = _.get(result, 'hits.hits', [])

    if (!profiles.length) {
      return null
    }
    const profile = _.first(profiles)

    return profile._source.typeCode || null
  }

  /**
   * findOrcreate
   * @param {Object} data
   */
  async findOrCreate (data) {
    const profileId = data._user.profileId
    const typeCode = await this.getTypeCode(profileId)
    const onlyForGymId = typeCode !== 'CH' ? profileId : null

    const category = await this.Category.findOne({ name: data.name })
      .populate('sizes')
      .populate('colors')
      .lean()

    if (!category) {
      return this.create({ ...data, onlyForGymId })
    }
    const key = this.translationKey(data.name)
    const oldKey = this.translationKey(category.name)
    await rabbitmq.send('/settings/i18nEntry/delete', {
      key: oldKey
    })
    data.translations.en = data.name
    await rabbitmq.send('/settings/i18nEntry/create', {
      key,
      translations: data.translations
    })

    log.info('Created new category')
    log.info(category)

    return {
      ...category,
      translations: data.translations
    }
  }

  /**
   * fin
   * @param {Object} data
   */
  async findOneAndUpdate (filter, data) {
    const category = await this.Category.findOne(filter)

    if (!category) return null
    const oldKey = this.translationKey(category.name)
    const newKey = this.translationKey(data.name)
    await rabbitmq.send('/settings/i18nEntry/delete', {
      key: oldKey
    })

    data.translations.en = data.name
    await rabbitmq.send('/settings/i18nEntry/create', {
      key: newKey,
      translations: data.translations
    })
    Object.assign(category, data)
    await category.save()

    const categoryQuery = await this.Category.findOne(filter)
      .populate('sizes')
      .populate('colors')
      .lean()
    log.info('updated category')
    log.info(category)

    return {
      ...categoryQuery,
      translations: data.translations
    }
  }

  /**
   *
   * deleteCategory- delete category
   * @param {Object} data
   */
  async deleteCategory ({ categoryId }) {
    const category = await this.Category.findOne({ _id: categoryId })
    if (!category) return null
    // TODO -- check if category is associated with a product
    const oldKey = category.name
    await rabbitmq.send('/settings/i18nEntry/delete', {
      key: oldKey
    })
    await this.Category.deleteOne({ _id: categoryId })
    log.info('delete category')
    log.info(category)
    return category
  }
}

module.exports = CategoryController
