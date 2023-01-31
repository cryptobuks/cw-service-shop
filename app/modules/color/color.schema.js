
const defaultBody = {
  type: 'object',
  required: ['name', 'isTranslated'],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      description: 'name of color'
    },
    isTranslated: {
      type: 'boolean',
      description: 'Status of translation'
    },
    translations: {
      type: 'object',
      properties: {
        it: {
          type: 'string'
        }
      }
    }

  }
}

module.exports = {
  getColors: {
    schema: {
      tags: ['Color'],
      summary: 'Get a list of colors',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object'
      }
    }
  },
  createColor: {
    schema: {
      tags: ['Color'],
      summary: 'Create a new Color',
      security: [
        {
          authorization: []
        }
      ],
      body: defaultBody
    }
  },
  setColor: {
    schema: {
      tags: ['Color'],
      summary: 'Update an existing color',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['colorId', 'name', 'isTranslated'],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            description: 'name of color'
          },
          isTranslated: {
            type: 'boolean',
            description: 'Status of translation'
          },
          translations: {
            type: 'object',
            properties: {
              it: {
                type: 'string'
              }
            }
          },
          isHiddenForCw: {
            type: 'boolean',
            description: 'Hidden for CW'
          },
          colorId: {
            type: 'string',
            description: 'Color id'
          }
        }
      }
    }
  },
  deleteColor: {
    schema: {
      tags: ['Color'],
      summary: 'Delete an existing color',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['colorId'],
        properties: {
          colorId: {
            type: 'string',
            description: 'Id of the Color'
          }

        }
      }
    }
  }

}
