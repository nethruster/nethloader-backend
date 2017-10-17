const { GraphQLError } = require('graphql');

const bcrypt = require('bcrypt');
const db = require('../../models');
const tokenUtils = require('../../utils/token');

module.exports = {
  Query: {
    users: (parent, args, { currentUser }) => {
      if (currentUser) {
        if (args.id === currentUser.id || args.email === currentUser.email) {
          return currentUser;
        }

        if (currentUser.isAdmin) {
          return db.User.findOne({ where: args })
        } else {
          throw new GraphQLError("Unauthorized")
        }
      } else {
        throw new GraphQLError("Unauthorized")
      }
    },
    user: (parent, args, { currentUser }) => {
      if (currentUser && currentUser.isAdmin) {
        return db.User.findAll({ where: args })
      } else {
        throw new GraphQLError("Unauthorized")
      }
    }
  },
  Mutation: {
    login: async (parent, args) => {
      let user = await db.User.findOne({
        where: {
          email: args.email
        }
      });

      if (await bcrypt.compare(args.password, user.password)) {
        return await tokenUtils.generateUserToken(user, '1d');
      }

      throw new Error("Not valid email or password");
    },
    register: async (parent, args) => {
      let user = await db.User.create({
        name: args.name,
        email: args.email,
        password: await bcrypt.hash(args.password, 12),
      })

      return await tokenUtils.generateUserToken(user, '1d');
    }
  }
}



