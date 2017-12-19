const { GraphQLError } = require('graphql')
const mime = require('mime-types')

const saveImage = require('../../utils/save-image')
const generateMediaThumbnail = require('../../utils/generate-thumbnail')
const removeImage = require('../../utils/remove-image')
const db = require('../../models')

module.exports = {
  Image: {
    user: image => image.getUser()
  },
  Query: {
    images: async (parent, args, { currentUser }) => {
      if (currentUser && (args.userId === currentUser.id || currentUser.isAdmin)) {
        let query = { where: {} }
        if (args.offset) {
          query.offset = args.offset
        }
        if (args.orderBy) {
          query.order = [[args.orderBy]]
        }
        if (args.orderDirection) {
          if (query.order) {
            query.order[0][1] = args.orderDirection
          } else {
            query.order = [['id', args.orderDirection]]
          }
        }
        if (args.limit) {
          query.limit = args.limit
        }
        if (args.userId) {
          query.where.UserId = args.userId
        }
        if (args.extensions) {
          query.where.extension = args.extensions
        }
        if (args.beforeDate) {
          query.where.createdAt = {
            $lt: new Date(parseFloat(args.beforeDate))
          }
        }
        if (args.afterDate) {
          if (query.where.createdAt) {
            query.where.createdAt.$gt = new Date(parseFloat(args.afterDate))
          } else {
            query.where.createdAt = {
              $gt: new Date(parseFloat(args.afterDate))
            }
          }
        }
        let result = await db.Image.findAndCountAll(query)

        return {
          totalCount: result.count,
          images: result.rows
        }
      } else {
        throw new GraphQLError('Unauthorized')
      }
    },
    countImages: async (parent, args, { currentUser }) => {
      if (currentUser && (args.userId === currentUser.id || currentUser.isAdmin)) {
        let query = { where: {} }
        if (args.userId) {
          query.where.UserId = args.userId
        }
        if (args.extensions) {
          query.where.extension = args.extensions
        }
        if (args.beforeDate) {
          query.where.createdAt = {
            $lt: new Date(parseFloat(args.beforeDate))
          }
        }
        if (args.afterDate) {
          if (query.where.createdAt) {
            query.where.createdAt.$gt = new Date(parseFloat(args.afterDate))
          } else {
            query.where.createdAt = {
              $gt: new Date(parseFloat(args.afterDate))
            }
          }
        }
        return db.Image.count(query)
      } else {
        throw new GraphQLError('Unauthorized')
      }
    },
    image: (parent, args) => {
      return db.Image.findOne({ where: args })
    }
  },
  Mutation: {
    uploadImage: async (parent, args, { currentUser, files }) => {
      if (!currentUser) throw new GraphQLError('Unauthorized')

      let file = files[0]
      let ext = mime.extension(file.mimetype)
      let img = await currentUser.createImage({
        id: db.Image.generateId(),
        extension: ext
      })
      await saveImage(img.id, ext, file.buffer)
      await generateMediaThumbnail(img.id, ext, file.mimetype)

      return img
    },
    deleteImage: async (parent, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Unauthorized')
      }
      let image = await db.Image.findOne({ where: { id: args.id } })
      await removeImage(image)
      return true
    }
  }
}
