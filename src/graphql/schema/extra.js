module.exports = `
type Query {
  IsCurrentSessionValid: Boolean
  supportedImageExtensions: [String]
  supportedVideoExtensions: [String]
  unprocessableExtensions: [String]
}
`
