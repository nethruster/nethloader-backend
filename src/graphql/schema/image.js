const {Edge, Page} = require('./type-helpers/pagination');

module.exports = `
type Image {
  id: String
  extension: String
  user: User
  createdAt: String
}
${Page('Image', 'images')}
type Query {
  images(
    userId: String
    extension: String
    limit: Int
    offset: Int
  ): ImagePage
  
  image(id: String!): Image
}
type Mutation {
  uploadImage: Image
  deleteImage(id: String!): Boolean
}
`
