const { GraphQLError } = require('graphql')

const addImage = require('../../utils/add-image')
const removeImage = require('../../utils/remove-image')
const db = require('../../models')

module.exports = {
  Image: {
    user: image => {
      return image.getUser()
      .then(user => ({
        id: user.id,
        name: user.name
      }))
      .catch(err => {
        console.error(err);
        throw new GraphQLError('Error while processing')
      });
    }
  },
  Query: {
    images: async (parent, args, { currentUser }) => {
      if (currentUser && (args.userId === currentUser.id || currentUser.isAdmin)) {
        try {
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
        } catch (err) {
          console.error(err)
          throw new GraphQLError('Error while processing')
        }
      } else {
        throw new GraphQLError('Unauthorized')
      }
    },
    countImages: async (parent, args, { currentUser }) => {
      try {
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
      } catch (err) {
        console.error(err)
        throw new GraphQLError('Error while processing')
      }
    },
    image: (parent, args) => {
      try {
        return db.Image.findOne({ where: args })
      } catch (err) {
        console.error(err)
        throw new GraphQLError('Error while processing')
      }
    }
  },
  Mutation: {
    uploadImage: (parent, args, { currentUser, file }) => {
      if (!currentUser) throw new GraphQLError('Unauthorized')
      try {
        return addImage(currentUser, file)
          .catch(err => {
            console.error(err)
            throw new GraphQLError('Error while processing')
          })
      } catch (err) {
        console.error(err)
        throw new GraphQLError('Error while processing')
      }
    },
    deleteImage: async (parent, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Unauthorized')
      }
      try {
        let image = await db.Image.findOne({ where: { id: args.id } })
        await removeImage(image)
        return true
      } catch (err) {
        console.error(err)
        throw new GraphQLError('Error while processing')
      }
    }
  }
}
