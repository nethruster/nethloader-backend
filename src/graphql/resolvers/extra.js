module.exports = {
  Query: {
    IsCurrentSessionValid: (parent, args, { currentUser }) => !!currentUser
  }
}
