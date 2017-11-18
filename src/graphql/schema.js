const path = require('path')
const {makeExecutableSchema} = require('graphql-tools')
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas')

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, 'schema')))
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, 'resolvers')))

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
})
