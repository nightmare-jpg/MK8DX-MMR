const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000; // You can change the port number as needed

app.get('/', (req, res) => {
    res.send('Hello, your server is running!');
  });
  
  app.get('/mmr', (req, res) => {
    const { id } = req.query; // Get the 'id' parameter from the query string
  
    if (!id) {
      return res.status(400).json({ error: 'Missing id parameter' });
    }
  
    const url = `https://www.mk8dx-lounge.com/PlayerDetails/${id}`;
  
    axios.get(url)
      .then(response => {
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
  
        res.json({result});
      })
      .catch(error => {
        console.error('Error fetching HTML page:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
