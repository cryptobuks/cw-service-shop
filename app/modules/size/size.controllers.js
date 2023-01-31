const { db, log, _, rabbitmq, ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class SizeController
 * @classdesc Controller Size
 */
class SizeController {
  constructor () {
    this.Size = db.shop.model('Size')
  }

  /**
   * getsizes
   * @param {Object} data
   */
  async find ({ _user }) {
    const sizes = await this.Size.find({
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
    const regex = '^_size'
    const { data } = await rabbitmq.sendAndRead('/settings/i18nEntry/get', {
      key: regex
    })
    log.info('fetch translation')
    log.info(data)

    const result = sizes.map(size => {
      const key = this.translationKey(size.name)
      const entry = data.find(t => t.key === key)

      size.translations = _.get(entry, 'translations', {})
      return size
    })

    return result
  }

  /**
   * converts a name to translation key
   * @param {string} name
   */
  translationKey (name) {
    const slug = _.kebabCase(name)

    return (`_size.${slug}`)
  }

  /**
   * getTypeCode
   * Get the typecode of the profile.
   */
  async getTypeCode (profileId) {
    return ctr.category.getTypeCode(profileId)
  }

  /**
   * Create size
   * @param {object} data create size
   */

  async create ({ onlyForGymId, isTranslated, translations, name }) {
    const key = this.translationKey(name)
    const size = await this.Size.create({
      name,
      isHiddenForCw: !!onlyForGymId,
      onlyForGymId,
      isTranslated
    })

    if (translations) {
      translations.en = name
      log.info('create translation in queue')
      await rabbitmq.send('/settings/i18nEntry/create', {
        key,
        translations
      })
    }
    log.info('create size')
    log.info(size)
    return {
      ...size.toJSON(),
      translations
    }
  }

  /**
   * createsize
   * @param {Object} data
   */
  async findOrCreate (data) {
    const profileId = data._user.profileId
    const typeCode = await this.getTypeCode(profileId)
    const onlyForGymId = typeCode !== 'CH' ? profileId : null
    const size = await this.Size.findOne({ name: data.name })
    if (!size) {
      return this.create({ ...data, onlyForGymId })
    }
    log.info('Created new size')
    log.info(size)
    return size
  }

  /**
   * fin
   * @param {Object} data
   */
  async findOneAndUpdate (filter, data) {
    const profileId = data._user.profileId
    const typeCode = await this.getTypeCode(profileId)
    const onlyForGymId = typeCode !== 'CH' ? profileId : null

    const size = await this.Size.findOne(filter)
    if (!size) return null

    if (size.isTranslated && !data.translations && !data.isTranslated) {
      const oldKey = this.translationKey(size.name)
      log.info('delete translation in queue')
      await rabbitmq.send('/settings/i18nEntry/delete', {
        key: oldKey
      })
    }

    if (data.translations && size.isTranslated && data.isTranslated) {
      const oldKey = this.translationKey(size.name)
      await rabbitmq.send('/settings/i18nEntry/delete', {
        key: oldKey
      })
      const newKey = this.translationKey(data.name)
      data.translations.en = data.name
      // create in rabbit mq
      log.info('create translation in queue')
      await rabbitmq.send('/settings/i18nEntry/create', {
        key: newKey,
        translations: data.translations
      })
    }

    if (data.translations && !size.isTranslated && data.isTranslated) {
      const newKey = this.translationKey(data.name)
      data.translations.en = data.name
      // create in rabbit mq
      await rabbitmq.send('/settings/i18nEntry/create', {
        key: newKey,
        translations: data.translations
      })
    }

    Object.assign(size, { ...data, onlyForGymId })
    await size.save()
    log.info('updated size')
    log.info({
      ...size.toJSON(),
      translations: data.translations
    })
    return {
      ...size.toJSON(),
      translations: data.translations
    }
  }

  /**
   *
   * deletesize- delete size
   * @param {Object} data
   */
  async deleteSize ({ sizeId }) {
    const size = await this.Size.findOne({ _id: sizeId })
    if (!size) return null
    const oldKey = size.name
    // TODO -- check if size is associated with a product
    if (size.isTranslated) {
      await rabbitmq.send('/settings/i18nEntry/delete', {
        key: oldKey
      })
    }
    await this.Size.deleteOne({ _id: sizeId })
    log.info('delete size')
    log.info(size)
    return size
  }
}

module.exports = SizeController
