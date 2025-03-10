// Replace these with your actual API keys where needed
const newsAPIKey = "YOUR_NEWS_API_KEY";
const stocksAPIKey = "YOUR_ALPHA_VANTAGE_API_KEY";

// Function to get weather data from Open-Meteo (no API key required)
function getWeather() {
  const latitude = 40.7128;    // Example: New York City latitude
  const longitude = -74.0060;  // Example: New York City longitude

  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
    .then(response => response.json())
    .then(data => {
      const weather = data.current_weather;
      const temp = weather.temperature;
      const windspeed = weather.windspeed;
      
      // Mapping for a few weather codes (add more if needed)
      const weatherDescriptions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast"
      };
      const description = weatherDescriptions[weather.weathercode] || "Unknown conditions";

      document.getElementById("weather-content").innerHTML = `
        <p>Temperature: ${temp}°C</p>
        <p>Condition: ${description}</p>
        <p>Wind speed: ${windspeed} km/h</p>
      `;
    })
    .catch(error => {
      console.error("Weather API error:", error);
      document.getElementById("weather-content").innerHTML = "Error loading weather data.";
    });
}

// Function to get general news headlines using NewsAPI
function getNews() {
  fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsAPIKey}`)
    .then(response => response.json())
    .then(data => {
      let headlines = data.articles.slice(0, 5)
        .map(article => `<li>${article.title}</li>`)
        .join('');
      document.getElementById("news-content").innerHTML = `<ul>${headlines}</ul>`;
    })
    .catch(error => {
      console.error("News API error:", error);
      document.getElementById("news-content").innerHTML = "Error loading news.";
    });
}

// Function to get tech news headlines using NewsAPI
function getTechNews() {
  fetch(`https://newsapi.org/v2/everything?q=technology&sortBy=publishedAt&apiKey=${newsAPIKey}`)
    .then(response => response.json())
    .then(data => {
      let headlines = data.articles.slice(0, 5)
        .map(article => `<li>${article.title}</li>`)
        .join('');
      document.getElementById("tech-content").innerHTML = `<ul>${headlines}</ul>`;
    })
    .catch(error => {
      console.error("Tech news API error:", error);
      document.getElementById("tech-content").innerHTML = "Error loading tech news.";
    });
}

// Function to get stock data using Alpha Vantage
function getStocks() {
  const symbol = "AAPL"; 
  fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${stocksAPIKey}`)
    .then(response => response.json())
    .then(data => {
      const quote = data["Global Quote"];
      if (quote) {
        document.getElementById("stocks-content").innerHTML = `
          <p>${symbol} Price: $${parseFloat(quote["05. price"]).toFixed(2)}</p>
          <p>Change: ${quote["09. change"]} (${quote["10. change percent"]})</p>
        `;
      } else {
        document.getElementById("stocks-content").innerHTML = "No data available.";
      }
    })
    .catch(error => {
      console.error("Stocks API error:", error);
      document.getElementById("stocks-content").innerHTML = "Error loading stock data.";
    });
}

// Function to get NASA's Astronomy Picture of the Day (APOD)
// Uses the free DEMO_KEY (you can replace it with your own if needed)
function getNasaAPOD() {
  fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
    .then(response => response.json())
    .then(data => {
      let html = `<h3>${data.title}</h3>`;
      if (data.media_type === 'image') {
        html += `<img src="${data.url}" alt="${data.title}" style="max-width:100%;">`;
      } else if (data.media_type === 'video') {
        html += `<iframe src="${data.url}" frameborder="0" allowfullscreen style="width:100%; height:300px;"></iframe>`;
      }
      html += `<p>${data.explanation}</p>`;
      document.getElementById("nasa-content").innerHTML = html;
    })
    .catch(error => {
      console.error("NASA APOD API error:", error);
      document.getElementById("nasa-content").innerHTML = "Error loading NASA APOD.";
    });
}

// Function to get top Hacker News stories
function getHackerNews() {
  fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    .then(response => response.json())
    .then(ids => {
      // Limit to the first 5 stories
      const top5 = ids.slice(0, 5);
      return Promise.all(top5.map(id => 
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(response => response.json())
      ));
    })
    .then(stories => {
      let html = '<ul>';
      stories.forEach(story => {
         html += `<li><a href="${story.url}" target="_blank">${story.title}</a></li>`;
      });
      html += '</ul>';
      document.getElementById("hacker-content").innerHTML = html;
    })
    .catch(error => {
      console.error("Hacker News API error:", error);
      document.getElementById("hacker-content").innerHTML = "Error loading Hacker News.";
    });
}

// Call all widget functions when the page loads
window.onload = function() {
  getWeather();
  getNews();
  getTechNews();
  getStocks();
  getNasaAPOD();
  getHackerNews();

  // Optionally, refresh data every 10 minutes:
  setInterval(() => {
    getWeather();
    getNews();
    getTechNews();
    getStocks();
    getNasaAPOD();
    getHackerNews();
  }, 10 * 60 * 1000);
};
