const axios = require("axios");

const ssyoutube = async (url) => {
  return axios.post("https://ssyoutube.com/api/convert", {
    url: url,
  }).then(res => res.data);
};

module.exports = {
  ssyoutube
}