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
    const targetDivs = $('div.col-lg-3.col-md-4.col-sm-6.col-xs-6');
    const result = [];

    targetDivs.each((index, divElement) => {
      const dtElement = $(divElement).find('dt');
      if (dtElement.text().trim() === 'MMR') {
        const ddElement = $(divElement).find('dd.rank-Iron');
        result.push(ddElement.text().trim());
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching HTML page:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
