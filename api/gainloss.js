const axios = require('axios')
const cheerio = require('cheerio')

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
    
        let gainLossValue = null;
    
        targetDivs.each((index, divElement) => {
          const dtElement = $(divElement).find('dt');
          const ddElement = $(divElement).find('dd');
    
          dtElement.each((i, dt) => {
            if ($(dt).text().trim() === 'Gain/Loss (Last 10)') {
              // Find the corresponding dd element next to the matched dt
              const nextDD = $(dt).next('dd');
              
              // Extract the text from the dd element and remove double quotes
              gainLossValue = nextDD.text().trim().replace(/"/g, '');
            }
          });
        });
    
        res.json(gainLossValue);
    } catch (error) {
        console.error('Error fetching HTML page:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
