module.exports = `
type Image {
  id: String
  extension: String
  user: User
  createdAt: String
}
type Query {
  images(
    id: String,
    extension: String
  ): [Image]
  
  image(id: String!): Image
}
type Mutation {
  uploadImage: Image
  deleteImage(id: String!): Boolean
}
`
