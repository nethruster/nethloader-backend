const { GraphQLError } = require('graphql');

const db = require('../../models');

module.exports = {
  Query: {
    images: (parent, args, { currentUser }) => {
      if (currentUser && (args.UserId === currentUser.id || currentUser.isAdmin)) {
        db.Image.findAll({ where: args });
      } else {
        throw new GraphQLError("Unauthorized");
      }
    },
    image: (parent, args) => {
      return db.Image.findOne({ where: args });
    }
  }
}