const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray')
const sampleData = { login: 'EDevLevy',
id: 48997332,
node_id: 'MDQ6VXNlcjQ4OTk3MzMy',
avatar_url: 'https://avatars1.githubusercontent.com/u/48997332?v=4',
gravatar_id: '',
url: 'https://api.github.com/users/EDevLevy',
html_url: 'https://github.com/EDevLevy',
followers_url: 'https://api.github.com/users/EDevLevy/followers',
following_url:
 'https://api.github.com/users/EDevLevy/following{/other_user}',
gists_url: 'https://api.github.com/users/EDevLevy/gists{/gist_id}',
starred_url:
 'https://api.github.com/users/EDevLevy/starred{/owner}{/repo}',
subscriptions_url: 'https://api.github.com/users/EDevLevy/subscriptions',
organizations_url: 'https://api.github.com/users/EDevLevy/orgs',
repos_url: 'https://api.github.com/users/EDevLevy/repos',
events_url: 'https://api.github.com/users/EDevLevy/events{/privacy}',
received_events_url: 'https://api.github.com/users/EDevLevy/received_events',
type: 'User',
site_admin: false,
name: 'Edgard Levy',
company: null,
blog: 'https://www.linkedin.com/in/edgardlevy',
location: 'Rio Preto - MG',
email: null,
hireable: null,
bio: 'Desenvolvedor (Artesão) de códigos, idéias e soluçôes :-)',
public_repos: 18,
public_gists: 0,
followers: 1,
following: 2,
created_at: '2019-03-27T16:01:32Z',
updated_at: '2020-01-09T20:45:26Z' }

module.exports = {

  async index (req,res){
    const devs = await Dev.find()
    res.json(devs);
  },

  async store (req, res) {
    const {github_username,techs,latitude,longitude} = req.body;

    let dev = await Dev.findOne({ github_username});

    if (!dev){
      const techsArray = parseStringAsArray(techs)
      const response = await axios.get(`https://api.github.com/users/${github_username}`)
      const {name = login, avatar_url,bio} = response.data//sampleData;

      const location = {
        type:'Point',
        coordinates:[longitude,latitude]
      }

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs:techsArray,
        location

      })

    }
    res.json(dev)
  }
}
