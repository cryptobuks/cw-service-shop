const { db, log, rabbitmq, _, ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class ColorController
 * @classdesc Controller Color
 */
class ColorController {
  constructor () {
    this.Color = db.shop.model('Color')
  }

  /**
   * getColors
   * @param {Object} data
   */
  async find ({ _user }) {
    const colors = await this.Color.find({
      $or: [
        {
          isHiddenForCw: false
        },
        {
          onlyForGymId: _user.profileId
        }
      ]
    }).lean()
    // get from rabbitmq
    const regex = '^_color'
    const { data } = await rabbitmq.sendAndRead('/settings/i18nEntry/get', {
      key: regex
    })

    const result = colors.map(color => {
      const key = this.translationKey(color.name)
      const entry = data.find(t => t.key === key)

      color.translations = _.get(entry, 'translations', {})
      return color
    })

    return result
  }

  /**
   * converts a name to translation key
   * @param {string} name
   */
  translationKey (name) {
    const slug = _.kebabCase(name)
    return (`_color.${slug}`)
  }

  /**
   * Create color
   * @param {object} data create color
   */

  async create ({ onlyForGymId, isTranslated, translations, name }) {
    // get the profile of the user.
    const key = this.translationKey(name)
    const color = await this.Color.create({
      name,
      isHiddenForCw: !!onlyForGymId,
      onlyForGymId,
      isTranslated
    })

    if (isTranslated && translations) {
      translations.en = name
      await rabbitmq.send('/settings/i18nEntry/create', {
        key,
        translations
      })
    }

    log.info('create color')
    log.info(color)
    return {
      ...color.toJSON(),
      translations
    }
  }

  /**
   * getTypeCode
   * Get the typecode of the profile.
   */
  async getTypeCode (profileId) {
    return ctr.category.getTypeCode(profileId)
  }

  /**
   * createColor
   * @param {Object} data
   */
  async findOrCreate (data) {
    const profileId = data._user.profileId
    const typeCode = await this.getTypeCode(profileId)
    const onlyForGymId = typeCode !== 'CH' ? profileId : null
    const color = await this.Color.findOne({ name: data.name })

    if (!color) {
      return this.create({ ...data, onlyForGymId })
    }
    log.info('Created new color')
    log.info(color)
    return color
  }

  /**
   * find
   * @param {Object} data
   */
  async findOneAndUpdate (filter, data) {
    const profileId = data._user.profileId
    const typeCode = await this.getTypeCode(profileId)
    const onlyForGymId = typeCode !== 'CH' ? profileId : null

    const color = await this.Color.findOne(filter)
    if (!color) return null
    if (color.isTranslated && !data.translations && !data.isTranslated) {
      const oldKey = this.translationKey(color.name)
      // delete from rabbitmq
      log.info('delete translation in queue')
      await rabbitmq.send('/settings/i18nEntry/delete', {
        key: oldKey
      })
    }

    if (data.translations && color.isTranslated && data.isTranslated) {
      const oldKey = this.translationKey(color.name)
      // delete from rabbitmq
      await rabbitmq.send('/settings/i18nEntry/delete', {
        key: oldKey
      })
      const newKey = this.translationKey(data.name)
      data.translations.en = data.name
      data.isTranslated = true
      // create in rabbit mq
      log.info('create translation in queue')
      await rabbitmq.send('/settings/i18nEntry/create', {
        key: newKey,
        translations: data.translations
      })
    }

    if (data.translations && !color.isTranslated && data.isTranslated) {
      const newKey = this.translationKey(data.name)
      data.translations.en = data.name
      // create in rabbit mq
      await rabbitmq.send('/settings/i18nEntry/create', {
        key: newKey,
        translations: data.translations
      })
    }

    Object.assign(color, { ...data, onlyForGymId })
    await color.save()
    log.info('updated color')
    log.info({
      ...color.toJSON(),
      translations: data.translations
    })
    return {
      ...color.toJSON(),
      translations: data.translations
    }
  }

  /**
   *
   * deleteColor- delete color
   * @param {Object} data
   */
  async deleteColor ({ colorId }) {
    const color = await this.Color.findOne({ _id: colorId })
    if (!color) return null
    const oldKey = color.name
    // TODO -- check if color is associated with a product
    if (color.isTranslated) {
      await rabbitmq.send('/settings/i18nEntry/delete', {
        key: oldKey
      })
    }
    await this.Color.deleteOne({ _id: colorId })
    log.info('delete color')
    log.info(color)
    return color
  }
}

module.exports = ColorController
