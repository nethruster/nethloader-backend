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
    preventSessionExpire: Boolean
  ): String!
  login(
    email: String!
    password: String!
    preventSessionExpire: Boolean
  ): String!
  createUser(
    name: String!
    email: String!
    password: String!
    isAdmin: Boolean
  ): User!
  changeUserName(
    userId: String!
    newName: String!
  ): User!
  changeUserEmail(
    userId: String!
    newEmail: String!
  ): User!
  changeUserPassword(
    userId: String!
    oldPassword: String!
    newPassword: String!
  ): User!
  changeUserIsAdmin(
    userId: String!
    isAdmin: Boolean!
  ): User!
  renewUserApiKey(
    userId: String!
  ): User!
  deleteUser(
    userId: String!
  ): Boolean!
  deleteAllUserImages(
    userId: String!
  ): Boolean!
}
`
