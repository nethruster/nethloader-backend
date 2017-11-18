const { GraphQLError } = require('graphql')

const bcrypt = require('bcrypt')
const db = require('../../models')
const tokenUtils = require('../../utils/token')

module.exports = {
  User: {
    images: user => user.getImages()
  },
  Query: {
    users: (parent, args, { currentUser }) => {
      if (currentUser) {
        if (args.id === currentUser.id || args.email === currentUser.email) {
          return currentUser
        }

        if (currentUser.isAdmin) {
          return db.User.findAll({ where: args })
        } else {
          throw new GraphQLError('Unauthorized')
        }
      } else {
        throw new GraphQLError('Unauthorized')
      }
    },
    user: (parent, args, { currentUser }) => {
      if (currentUser) {
        if (args.id === currentUser.id || args.email === currentUser.email) {
          return currentUser
        } else if (currentUser.isAdmin) {
          return db.User.findOne({ where: args })
        } else {
          throw new GraphQLError('Unauthorized')
        }
      } else {
        throw new GraphQLError('Unauthorized')
      }
    }
  },
  Mutation: {
    login: async (parent, args) => {
      let user = await db.User.findOne({
        where: {
          email: args.email
        }
      })

      if (await bcrypt.compare(args.password, user.password)) {
        return tokenUtils.generateUserToken(user, '1d')
      }

      throw new Error('Not valid email or password')
    },
    register: async (parent, args) => {
      let user = await db.User.create({
        id: db.User.generateId(),
        name: args.name,
        email: args.email,
        apiKey: db.User.generateApiKey(),
        sessionSignature: db.User.generateSessionSignature(),
        password: await bcrypt.hash(args.password, 12)
      })

      return tokenUtils.generateUserToken(user, '1d')
    }
  }
}
