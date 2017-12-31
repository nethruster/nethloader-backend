const { GraphQLError } = require('graphql')

const bcrypt = require('bcrypt')
const db = require('../../models')
const tokenUtils = require('../../utils/token')
const removeImage = require('../../utils/remove-image')

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
        return tokenUtils.generateUserToken(user, args.preventSessionExpire ? false : '1d')
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

      return tokenUtils.generateUserToken(user, args.preventSessionExpire ? false : '1d')
    },
    changeUserName: async (parent, args, { currentUser }) => {
      if (!currentUser) throw new GraphQLError('Unauthorized')

      var user
      if (args.userId === currentUser.id) {
        user = currentUser
      } else if (currentUser.isAdmin) {
        user = await db.User.findOne({
          where: {
            id: args.userId
          }
        })
        if (user === null) throw new GraphQLError('User not found')
      } else {
        throw new GraphQLError('Unauthorized')
      }

      return user.updateAttributes({
        name: args.newName
      })
        .catch(err => {
          console.error(err)
          throw new GraphQLError('Error while processing')
        })
    },
    changeUserEmail: async (parent, args, { currentUser }) => {
      if (!currentUser) throw new GraphQLError('Unauthorized')

      var user
      if (args.userId === currentUser.id) {
        user = currentUser
      } else if (currentUser.isAdmin) {
        user = await db.User.findOne({
          where: {
            id: args.userId
          }
        })
        if (user === null) throw new GraphQLError('User not found')
      } else {
        throw new GraphQLError('Unauthorized')
      }

      return user.updateAttributes({
        email: args.newEmail
      })
        .catch(err => {
          console.error(err)
          throw new GraphQLError('Error while processing')
        })
    },
    changeUserPassword: async (parent, args, { currentUser }) => {
      if (!currentUser) throw new GraphQLError('Unauthorized')

      var user
      if (args.userId === currentUser.id) {
        user = currentUser
      } else if (currentUser.isAdmin) {
        user = await db.User.findOne({
          where: {
            id: args.userId
          }
        })
        if (user === null) throw new GraphQLError('User not found')
      } else {
        throw new GraphQLError('Unauthorized')
      }

      if (await bcrypt.compare(args.oldPassword, user.password)) {
        return user.updateAttributes({
          password: await bcrypt.hash(args.newPassword, 12),
          sessionSignature: db.User.generateSessionSignature()
        })
          .catch(err => {
            console.error(err)
            throw new GraphQLError('Error while processing')
          })
      } else {
        throw new GraphQLError('Incorrect password')
      }
    },
    renewUserApiKey: async (parent, args, { currentUser }) => {
      if (!currentUser) throw new GraphQLError('Unauthorized')

      var user
      if (args.userId === currentUser.id) {
        user = currentUser
      } else if (currentUser.isAdmin) {
        user = await db.User.findOne({
          where: {
            id: args.userId
          }
        })
        if (user === null) throw new GraphQLError('User not found')
      } else {
        throw new GraphQLError('Unauthorized')
      }

      return user.updateAttributes({
        apiKey: db.User.generateApiKey()
      })
        .catch(err => {
          console.error(err)
          throw new GraphQLError('Error while processing')
        })
    },
    deleteUser: async (parent, args, { currentUser }) => {
      if (!currentUser) throw new GraphQLError('Unauthorized')

      var user
      if (args.userId === currentUser.id) {
        user = currentUser
      } else if (currentUser.isAdmin) {
        user = await db.User.findOne({
          where: {
            id: args.userId
          }
        })
        if (user === null) throw new GraphQLError('User not found')
      } else {
        throw new GraphQLError('Unauthorized')
      }

      return user.getImages()
        .then(images => {
          let promises = images.map(removeImage)
          return Promise.all(promises)
        })
        .then(() => user.destroy())
        .then(() => true)
        .catch(err => {
          console.error(err)
          throw new GraphQLError('Error while processing')
        })
    }
  }
}
