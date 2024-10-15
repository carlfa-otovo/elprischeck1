const fetch = require('node-fetch');
const fs = require('fs');

async function fetchElectricityPrices(year, month, day, priceClass) {
  const apiUrl = `https://www.elprisetjustnu.se/api/v1/prices/${year}/${month}-${day}_${priceClass}.json`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.map(item => ({
      hour: item.time.split("-")[0],
      price: item.price / 1000, // Convert price to SEK/kWh
    }));
  } catch (error) {
    console.error("Error fetching electricity prices:", error);
    return [];
  }
}

async function updateData() {
  const today = new Date();
  const year = today.getFullYear();
  const month = ("0" + (today.getMonth() + 1)).slice(-2);
  const day = ("0" + today.getDate()).slice(-2);
  const priceClass = 'SE3'; // You can change this to SE1, SE2, or SE4

  const data = await fetchElectricityPrices(year, month, day, priceClass);

  if (data.length > 0) {
    fs.writeFileSync(`data/${year}-${month}-${day}.json`, JSON.stringify(data, null, 2));
    console.log(`Data saved for ${year}-${month}-${day}`);
  } else {
    console.log(`No data fetched for ${year}-${month}-${day}`);
  }
}

updateData();
