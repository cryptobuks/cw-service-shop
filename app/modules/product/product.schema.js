const productProperties = {
  isVirtual: {
    type: 'boolean'
  },
  isActive: {
    type: 'boolean'
  },
  name: {
    type: 'string'
  },
  description: {
    type: 'string'
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
    type: 'string'
  },
  items: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        target: {
          type: 'string'
        },
        vatRateId: {
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
        price: {
          type: 'number'
        },
        publicPrice: {
          type: 'boolean'
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
        },
        lastSupplierId: {
          type: 'string'
        },
        lastCost: {
          type: 'number'
        },
        isActive: {
          type: 'boolean'
        }
      }
    }
  },
  createdFrom: {
    type: 'string'
  },
  isPublished: {
    type: 'boolean'
  }
}
module.exports = {
  uploadImage: {
    schema: {
      tags: ['Product'],
      summary: 'Upload product image',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['base64', 'filename'],
        properties: {
          base64: {
            type: 'string',
            typeof: 'Base64'
          },
          filename: {
            type: 'string'
          }
        }
      }
    }
  },
  createProduct: {
    schema: {
      tags: ['Product'],
      summary: 'Create a product',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['name'],
        properties: productProperties
      }
    }
  },
  updateProduct: {
    schema: {
      tags: ['Product'],
      summary: 'Update a product',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['productId', 'name', 'items'],
        properties: {
          ...productProperties,
          productId: {
            type: 'string'
          }
        }
      }
    }
  },
  deleteProduct: {
    schema: {
      tags: ['Product'],
      summary: 'Delete a product',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['productId'],
        properties: {
          productId: {
            type: 'string'
          }
        }
      }
    }
  },
  getProducts: {
    schema: {
      tags: ['Product'],
      summary: 'List all products',
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
  getProduct: {
    schema: {
      tags: ['Product'],
      summary: 'Get product',
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
  suggestSuppliers: {
    schema: {
      tags: ['Product'],
      summary: 'Suggest product suppliers',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['text'],
        properties: {
          text: {
            type: 'string'
          }
        }
      }
    }
  },
  suggestName: {
    schema: {
      tags: ['Product'],
      summary: 'Suggest product names',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['text'],
        properties: {
          text: {
            type: 'string'
          }
        }
      }
    }
  },
  suggestDescription: {
    schema: {
      tags: ['Product'],
      summary: 'Suggest product description',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['text'],
        properties: {
          text: {
            type: 'string'
          }
        }
      }
    }
  }
}
