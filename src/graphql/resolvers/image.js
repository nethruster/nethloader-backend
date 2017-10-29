const { GraphQLError } = require('graphql');
const mime = require('mime-types');

const saveImage = require('../../utils/save-image')
const db = require('../../models');

module.exports = {
  Image: {
    user: image => image.getUser()
  },
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
  },
  Mutation: {
    uploadImage: async (parent, args, {currentUser, files }) => {
      if(!currentUser) throw new GraphQLError("Unauthorized");

      let file = files[0];
      let ext = mime.extension(file.mimetype);
      let img = await currentUser.createImage({
        extension: ext
      });
      await saveImage(img.id, ext, file.buffer);

      return img;
    }
  }
}
