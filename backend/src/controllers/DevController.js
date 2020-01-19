const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray')
const { findConnections,sendMessage } = require('../websocket');



module.exports = {

  async index(req, res) {
    const devs = await Dev.find()
    res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const techsArray = parseStringAsArray(techs)
      const response = await axios.get(`https://api.github.com/users/${github_username}`)
      const { name = login, avatar_url, bio } = response.data//sampleData;

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      }

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location

      })

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      )

      sendMessage(sendSocketMessageTo,'new-dev',dev)

    }
    return res.json(dev)
  },

  async delete(req,res){
    const {id} = req.params;

    await Dev.findByIdAndDelete(id,(err,dev)=>{
      if (err) {
        console.error(err)
        return res.status(500).json({message:'erro ao excluir o registro'})
      }
      if (!dev){
        return res.status(400).json({message:'registro nao encontrado'})
      }

      const sendSocketMessageTo = findConnections(null,dev.techs)

      sendMessage(sendSocketMessageTo,'del-dev',dev._id)

      return res.send();

    })
  }
}
