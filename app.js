const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
  const query = req.body.cityName;
  const APIkey = 'd15fec289a46fbc03e43326f23c37f6d';
  const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=' + APIkey + '&units=metric';

  if (!query) {
    // No city name provided
    res.send('Please enter a city name.');
    return;
  }

  https.get(url, (response) => {
    let responseData = '';

    response.on('data', (data) => {
      responseData += data;
    });

    response.on('end', () => {
      try {
        const weatherData = JSON.parse(responseData);
        const temperature = weatherData.main.temp;
        const humidity = weatherData.main.humidity;
        const pressure = weatherData.main.pressure;
        const description = weatherData.weather[0].description;

        const resultHTML = `
        <div style="display: flex; flex-direction: column; align-items: center;background-color: #8EC5FC;     background-image: linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%);">
        <h1 style="color: #0B2559;">Current Weather in ${query} is:</h1>
        <div style="display: flex; flex-direction: column; align-items: center;">
          <p style=" font-size:20px">Temperature: ${temperature} °C</p>
          <p style="font-size:20px">Humidity: ${humidity} %</p>
          <p style="font-size:20px">Pressure: ${pressure} mb</p>
          <p>Description: ${description}</p>
        </div>
      </div>
        `;

        res.send(resultHTML);
      } catch (error) {
        res.status(404).send('Error 404: City not found.');
      }
    });
  }).on('error', (error) => {
    // HTTP request error
    res.status(500).send('Error: An error occurred while retrieving weather data.');
  });
});

app.listen(3000, () => console.log('Our server is running at port 3000'));

