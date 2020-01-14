const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')
module.exports = {
  async index (req,res){
      //Busca todos os deves num raio de 10km
    //Buscar devs por technologia
    console.log(req.query)
    const {longitude,latitude,techs} = req.query;

    const techsArray = parseStringAsArray(techs)

    console.log(techsArray)

    const devs = await Dev.find({
      techs:{
        $in:techsArray
      },
      location:{
        $near:{
          $geometry:{
            type:'Point',
            coordinates:[longitude,latitude]
          },
          $maxDistance:10000
        }
      }
    })

    res.json({devs})
  }
}
