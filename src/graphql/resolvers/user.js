const { GraphQLError } = require('graphql')

const bcrypt = require('bcrypt')
const db = require('../../models')
const tokenUtils = require('../../utils/token')
const createUser = require('../../utils/create-user')
const removeUser = require('../../utils/remove-user')
const removeImage = require('../../utils/remove-image')
const {getConfigSection} = require('../../utils/config')

const allowRegistration = (getConfigSection('server')).allowRegistration

module.exports = {
  User: {
    images: user => {
      try {
        return user.getImages()
      } catch (err) {
        console.error(err)
        throw new GraphQLError('Error while processing')
      }
    }
  },
  Query: {
    users: (parent, args, { currentUser }) => {
      if (currentUser) {
        if (args.id === currentUser.id || args.email === currentUser.email) {
          return currentUser
        }

        if (currentUser.isAdmin) {
          try {
            return db.User.findAll({ where: args })
          } catch (err) {
            console.error(err)
            throw new GraphQLError('Error while processing')
          }
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
          try {
            return db.User.findOne({ where: args })
          } catch (err) {
            console.error(err)
            throw new GraphQLError('Error while processing')
          }
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
      var user
      try {
        user = await db.User.findOne({
          where: {
            email: args.email
          }
        })
      } catch (err) {
        console.error(err)
        throw new GraphQLError('Error while processing')
      }
      if (!user) throw new GraphQLError('Unexistent user')
      try {
        if (await bcrypt.compare(args.password, user.password)) {
          return tokenUtils.generateUserToken(user, args.preventSessionExpire ? false : '1d')
        } else {
          throw new GraphQLError('Wrong password')
        }
      } catch (err) {
        if (err.message === 'Unexistent user' || err.message === 'Wrong password') throw err
        console.error(err)
        throw new GraphQLError('Error while processing')
      }
    },
    register: async (parent, args) => {
      if (!allowRegistration) throw new GraphQLError('Registration is not allowed in this instance')
      try {
        let user = await createUser({
          name: args.name,
          email: args.email,
          password: args.password
        })

        return tokenUtils.generateUserToken(user, args.preventSessionExpire ? false : '1d')
      } catch (err) {
        console.error(err)
        throw new GraphQLError('Error while processing')
      }
    },
    createUser: (parent, args, { currentUser }) => {
      if (!(currentUser && currentUser.isAdmin)) throw new GraphQLError('Unauthorized')
      try {
        return createUser({
          name: args.name,
          email: args.email,
          password: args.password,
          isAdmin: args.isAdmin
        })
      } catch (err) {
        console.error(err)
        throw new GraphQLError('Error while processing')
      }
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

      if ((currentUser.isAdmin && currentUser.id !== user.id) || await bcrypt.compare(args.oldPassword, user.password)) {
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
    changeUserIsAdmin: async (parent, args, { currentUser }) => {
      if (!(currentUser && currentUser.isAdmin)) throw new GraphQLError('Unauthorized')

      var user
      if (args.userId === currentUser.id) {
        user = currentUser
      } else {
        try {
          user = await db.User.findOne({
            where: {
              id: args.userId
            }
          })
        } catch (err) {
          console.error(err)
          throw new GraphQLError('Error while processing')
        }
        if (user === null) throw new GraphQLError('User not found')
      }

      return user.updateAttributes({
        isAdmin: args.isAdmin
      })
        .catch(err => {
          console.error(err)
          throw new GraphQLError('Error while processing')
        })
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
      try {
        if ((args.userId === currentUser.id) && await bcrypt.compare(args.password, currentUser.password)) {
          user = currentUser
        } else if (currentUser.isAdmin && (args.userId !== currentUser.id)) {
          user = await db.User.findOne({
            where: {
              id: args.userId
            }
          })
          if (user === null) throw new GraphQLError('User not found')
        } else {
          throw new GraphQLError('Unauthorized')
        }
      } catch (err) {
        if (err.message === 'Unauthorized') throw err
        throw new GraphQLError('Error while processing')
      }
      return removeUser(user)
        .then(() => true)
        .catch(err => {
          console.error(err)
          throw new GraphQLError('Error while processing')
        })
    },
    deleteAllUserImages: async (parent, args, { currentUser }) => {
      if (!currentUser) throw new GraphQLError('Unauthorized')

      var user
      try {
        if ((args.userId === currentUser.id) && await bcrypt.compare(args.password, currentUser.password)) {
          user = currentUser
        } else if (currentUser.isAdmin && (args.userId !== currentUser.id)) {
          user = await db.User.findOne({
            where: {
              id: args.userId
            }
          })

          if (user === null) throw new GraphQLError('User not found')
        } else {
          throw new GraphQLError('Unauthorized')
        }
      } catch (err) {
        if (err.message === 'Unauthorized') throw err
        throw new GraphQLError('Error while processing')
      }

      return user.getImages()
        .then(images => {
          let promises = images.map(removeImage)
          return Promise.all(promises)
        })
        .then(() => true)
        .catch(err => {
          console.error(err)
          throw new GraphQLError('Error while processing')
        })
    }
  }
}
