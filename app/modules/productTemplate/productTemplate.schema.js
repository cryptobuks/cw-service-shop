const productProperties = {
  isVirtual: {
    type: 'boolean'
  },
  name: {
    type: 'object',
    properties: {
      en: {
        type: 'string'
      }
    }
  },
  description: {
    type: 'object',
    properties: {
      en: {
        type: 'string'
      }
    }
  },
  manufacturer: {
    type: 'string'
  },
  categories: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        _id: {
          type: 'string'
        },
        name: {
          type: 'string'
        }
      }
    }
  },
  details: {
    type: 'object',
    properties: {
      en: {
        type: 'string'
      }
    }
  },
  items: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        target: {
          type: 'string'
        },
        size: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            name: {
              type: 'string'
            }
          }
        },
        color: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            name: {
              type: 'string'
            }
          }
        },
        quantity: {
          type: 'number'
        },
        pictures: {
          type: 'array',
          items: {
            type: 'object',
            required: ['imageId', 'filename'],
            properties: {
              imageId: {
                type: 'string'
              },
              filename: {
                type: 'string'
              }
            }
          }
        },
        barCode: {
          type: 'string'
        }
      }
    }
  }
}
module.exports = {
  createTemplate: {
    schema: {
      tags: ['Template'],
      summary: 'Create a product template',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['name', 'description', 'items'],
        properties: productProperties
      }
    }
  },
  updateTemplate: {
    schema: {
      tags: ['Template'],
      summary: 'Update a product template',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['templateId', 'name', 'description', 'items'],
        properties: {
          ...productProperties,
          templateId: {
            type: 'string'
          }
        }
      }
    }
  },
  deleteTemplate: {
    schema: {
      tags: ['Template'],
      summary: 'Delete a product template',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['templateId'],
        properties: {
          templateId: {
            type: 'string'
          }
        }
      }
    }
  },
  getTemplates: {
    schema: {
      tags: ['Template'],
      summary: 'List all product templates',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object'
      }
    }
  }
}
