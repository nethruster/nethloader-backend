const {Page} = require('./type-helpers/pagination')

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
    extensions: [String]
    limit: Int
    offset: Int
    orderBy: String
    orderDirection: String
    beforeDate: String
    afterDate: String
  ): ImagePage
  
  countImages(
    userId: String
    extensions: [String]
    beforeDate: String
    afterDate: String
  ): Int

  image(id: String!): Image
}
type Mutation {
  uploadImage: Image
  deleteImage(id: String!): Boolean
}
`
