
function Page(type, itemField) {
  return `
  type ${type}Page{
      totalCount: Int
      ${itemField}: [${type}]
  }
  `
}

module.exports = {
  Page
}
