const {getConfigSection} = require('../utils/config')
const publicDomain = (getConfigSection('server')).publicDomain

module.exports = function(req, res) {
    if (!req.query.apikey) return res.status(400).send("Missing apikey")
    if (req.query.apikey.length !== 24) return res.status(400).send("Invalid apikey")

    return res.status(200).send({
        "Name": "Nethloader",
        "DestinationType": "ImageUploader",
        "RequestURL": `${publicDomain}/api`,
        "FileFormName": "file",
        "Headers": {
          "api-key": req.query.apikey
        },
        "URL": "$json:data.link$",
        "ThumbnailURL": "$json:data.thumb$"
      })
}
