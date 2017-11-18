module.exports = `
type User {
  id: String
  name: String
  email: String
  apiKey: String
  isAdmin: Boolean
  images: [Image]
  createdAt: String
}
type Query {
  users(
    id: String,
    name: String,
    email: String,
    apiKey: String,
    isAdmin: Boolean
  ): [User] 

  user(id: String, email: String): User
}
type Mutation {
  register(
    name: String!
    email: String!
    password: String!
  ): String,
  login(
    email: String!
    password: String!
  ): String
}
`
