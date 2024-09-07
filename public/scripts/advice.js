document.getElementById('advice-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const city = document.getElementById('advice-city').value;
    const apiKey = 'a8309864ebc557e9c1846ef22a29ad10';  // Replace with your actual API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod === 200) {
            const locationName = data.name;
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;
            const humidity = data.main.humidity;
            const iconCode = data.weather[0].icon; // Get the weather icon code
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`; // Construct the icon URL

            // Generate agricultural advice based on weather data
            let adviceHtml = generateAgriculturalAdvice(weatherDescription, temperature, humidity, iconUrl);

            document.getElementById('advice-content').innerHTML = `<h3>Agricultural Advice for ${locationName}</h3>${adviceHtml}`;
        } else {
            document.getElementById('advice-content').innerHTML = `<p>Unable to retrieve weather data for ${city}. Please try again.</p>`;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('advice-content').innerHTML = '<p>Unable to retrieve weather data. Please try again later.</p>';
    }
});

// Function to generate agricultural advice with images
function generateAgriculturalAdvice(weatherDescription, temperature, humidity, iconUrl) {
    let adviceHtml = '';

    if (weatherDescription.includes('rain')) {
        adviceHtml += `<div><img src="${iconUrl}" alt="Rain icon"> Rain is expected. Ensure proper drainage in your fields to prevent waterlogging. Consider planting cover crops to improve soil health and reduce erosion.</div>`;
    }

    if (weatherDescription.includes('clear') || weatherDescription.includes('sun')) {
        adviceHtml += `<div><img src="${iconUrl}" alt="Sun icon"> Sunny and clear weather expected. This is a good time for irrigation and applying fertilizers. Also, consider checking the soil moisture regularly.</div>`;
    }

    if (temperature < 5) {
        adviceHtml += `<div><img src="${iconUrl}" alt="Frost icon"> Frost conditions are possible. Consider covering your crops to protect them from frost and avoid planting frost-sensitive crops.</div>`;
    } else if (temperature > 30) {
        adviceHtml += `<div><img src="${iconUrl}" alt="Heat icon"> High temperatures expected. Ensure adequate watering to prevent heat stress in crops. Mulching can help retain soil moisture and reduce soil temperature.</div>`;
    }

    if (humidity > 80) {
        adviceHtml += `<div><img src="${iconUrl}" alt="Humidity icon"> High humidity levels. Be on the lookout for fungal diseases and take preventive measures. Avoid overhead irrigation to reduce leaf wetness duration.</div>`;
    } else if (humidity < 30) {
        adviceHtml += `<div><img src="${iconUrl}" alt="Low humidity icon"> Low humidity levels. Monitor soil moisture and irrigate as necessary to avoid drought stress. Consider using organic mulch to maintain soil moisture levels.</div>`;
    }

    if (temperature > 20 && humidity < 50) {
        adviceHtml += `<div><img src="${iconUrl}" alt="Dry soil icon"> Soil may dry out quickly in these conditions. Regular soil testing can help in understanding the need for organic matter to retain moisture.</div>`;
    } else if (temperature < 15) {
        adviceHtml += `<div><img src="${iconUrl}" alt="Cool soil icon"> Cool temperatures may slow down soil microbial activity. Consider adding compost to maintain soil fertility.</div>`;
    }

    if (temperature > 30) {
        adviceHtml += `<div><img src="${iconUrl}" alt="Heat icon"> For heat-sensitive crops, consider using shade nets to reduce sun exposure. Plant drought-resistant crop varieties to cope with high temperatures.</div>`;
    } else if (temperature < 10) {
        adviceHtml += `<div><img src="${iconUrl}" alt="Cold crop icon"> Plant cold-tolerant crops during this period. Avoid planting crops that require warm soil temperatures.</div>`;
    }

    if (humidity < 40) {
        adviceHtml += `<div><img src="${iconUrl}" alt="Low humidity icon"> Low humidity and high temperatures can increase the need for irrigation. Drip irrigation is recommended to conserve water and provide efficient watering.</div>`;
    } else if (humidity > 70) {
        adviceHtml += `<div><img src="${iconUrl}" alt="High humidity icon"> High humidity may reduce the need for frequent irrigation. Focus on soil drainage and avoid overwatering.</div>`;
    }

    if (!adviceHtml) {
        adviceHtml = `<div><img src="${iconUrl}" alt="Stable weather icon"> Weather conditions are stable. Follow your regular farming practices.</div>`;
    }

    return adviceHtml;
}
