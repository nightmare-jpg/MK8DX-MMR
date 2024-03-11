const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing id parameter' });
  }

  const url = `https://www.mk8dx-lounge.com/PlayerDetails/${id}`;
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Find the h1 element within the specified div
    let h1Text = $('div.container h1').first().text().trim();

    // Remove surrounding quotes if present
    h1Text = h1Text.replace(/^"(.*)"$/, '$1');

    // Do something with the extracted h1 text
    console.log(h1Text);

    // Return the h1 text in the API response
    return res.status(200).json(h1Text);
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
