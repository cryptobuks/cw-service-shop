
const getCategories = {
  schema: {
    tags: ['Category'],
    summary: 'List all Category',
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
const createCategory = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['Category'],
    summary: 'Create a new Category',
    body: {
      type: 'object',
      required: ['name', 'translations'],
      properties: {
        name: {
          type: 'string',
          minLength: 1
        },
        translations: {
          type: 'object',
          properties: {
            it: {
              type: 'string'
            }
          }
        },
        parentId: {
          type: 'string',
          nullable: true
        },
        colors: {
          type: 'array',
          items: {
            type: 'string',
            typeof: 'ObjectId'
          },
          description: 'id of colors'
        },
        sizes: {
          type: 'array',
          items: {
            type: 'string',
            typeof: 'ObjectId'
          },
          description: 'id of sizes'
        }
      }
    }
  }
}
const setCategory = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['Category'],
    summary: 'Update a Category by id',
    body: {
      type: 'object',
      required: ['categoryId', 'name', 'translations'],
      properties: {
        name: {
          type: 'string',
          minLength: 1
        },
        translations: {
          type: 'object',
          properties: {
            it: {
              type: 'string'
            }
          }
        },
        parentId: {
          type: 'string',
          nullable: true
        },
        isHiddenForCw: {
          type: 'boolean',
          description: 'Hidden for CW'
        },
        colors: {
          type: 'array',
          items: {
            type: 'string',
            typeof: 'ObjectId'
          },
          description: 'id of colors'
        },
        sizes: {
          type: 'array',
          items: {
            type: 'string',
            typeof: 'ObjectId'
          },
          description: 'id of sizes'
        }
      }
    }
  }
}
const deleteCategory = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['Category'],
    summary: 'Delete a Category by id',
    body: {
      type: 'object',
      required: ['categoryId'],
      properties: {
        categoryId: {
          type: 'string',
          description: 'Category id',
          typeof: 'ObjectId'
        }
      }
    }
  }
}

module.exports = {
  getCategories,
  setCategory,
  createCategory,
  deleteCategory
}
