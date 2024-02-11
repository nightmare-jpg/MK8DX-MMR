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
    const rankClasses = ['rank-Iron', 'rank-Sapphire', 'rank-Bronze', 'rank-Silver', 'rank-Gold', 'rank-Platinum', 'rank-Ruby', 'rank-Diamond', 'rank-Master', 'rank-Grandmaster'];
    let mmrValues = [];

    rankClasses.forEach(rankClass => {
      targetDivs.each((index, divElement) => {
        const dtElement = $(divElement).find('dt');
        if (dtElement.text().trim() === 'MMR') {
          const ddElements = $(divElement).find(`dd.${rankClass}`);
          ddElements.each((i, ddElement) => {
            const mmrValue = parseInt($(ddElement).text().trim(), 10);
            if (!isNaN(mmrValue)) {
              mmrValues.push(mmrValue);
            }
          });
        }
      });
    });

    if (mmrValues.length === 1) {
      mmrValues = mmrValues[0];
    }

    res.json(mmrValue);
  } catch (error) {
    console.error('Error fetching HTML page:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};