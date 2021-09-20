function formSubmit() {
  $("#submit").click(function (e) {
    e.preventDefault();
    // console.log("form submit");

    let city = $("#city").val();
    let daysNum = $("#daysNum").val();
    console.log(city + ", " + daysNum);

    getData(city, daysNum);
  });
}

function getData(city, days) {
  $.get(
    `http://api.weatherapi.com/v1/forecast.json?key=b2401d84f56a456db04203011211309&q=${city}&days=${days}&aqi=yes&alerts=no`,
    function (data) {
      let locationName = data.location.name;
      let region = data.location.region;
      let country = data.location.country;
      let lastUpdate = data.current.last_updated;

      //   console.log(
      //     locationName + " " + region + " " + country + " " + lastUpdate
      //   );
      //   let forecastLength = days - 1;

      //   let location = "data.location.";
      //   let region2 = "region";
      //   console.log(eval(location + region2));

      $("#locale").html(
        `<h1>${locationName}</h1>
          <h2>${region}</h2>
          <h2>${country}</h2>
          <h4>Last Updated: ${lastUpdate}</h4>`
      );

      var displayArray = "";

      for (let i = 0; i < days; i++) {
        let fDay = data.forecast.forecastday[i].date;

        let maxC = data.forecast.forecastday[i].day.maxtemp_c;
        let minC = data.forecast.forecastday[i].day.mintemp_c;

        let maxF = data.forecast.forecastday[i].day.maxtemp_f;
        let minF = data.forecast.forecastday[i].day.mintemp_f;

        let avgC = data.forecast.forecastday[i].day.avgtemp_c;
        let avgF = data.forecast.forecastday[i].day.avgtemp_f;

        let maxWindMph = data.forecast.forecastday[i].day.maxwind_mph;
        let maxWindKph = data.forecast.forecastday[i].day.maxwind_kph;

        let precipMm = data.forecast.forecastday[i].day.totalprecip_mm;
        let precipIn = data.forecast.forecastday[i].day.totalprecip_in;
        let avgHumid = data.forecast.forecastday[i].day.avghumidity;

        let rainChance = data.forecast.forecastday[i].day.daily_chance_of_rain;
        let snowChance = data.forecast.forecastday[i].day.daily_chance_of_snow;

        let conditionTxt = data.forecast.forecastday[i].day.condition.text;
        let icon = data.forecast.forecastday[i].day.condition.icon;

        let display = `<div class="forecast__day">
        <h2>${fDay}</h2>
        <img src="${icon}" alt="weather icon" />
        <h4>${conditionTxt}</h4>
        <div class ="container">
            <div class="temp">
                <h4>Celsius</h4>
                <p>Avg: ${avgC}</p>
                <p>Min: ${minC}</p>
                <p>Max: ${maxC}</p>
            </div>

            <div class="temp">
                <h4>Farenheit</h4>
                <p>Avg: ${avgF}</p>
                <p>Min: ${minF}</p>
                <p>Max: ${maxF}</p>
            </div>
        </div>

        <div class="wind">
          <p>Max Wind Speed (MPH): ${maxWindMph}</p>
          <p>Max Wind Speed (KPH): ${maxWindKph}</p>
        </div>

        <div class="humid">
          <p>Precipitation (mm): ${precipMm}</p>
          <p>Precipitation (in): ${precipIn}</p>
          <p>Average Humidity: ${avgHumid}%</p>
        </div>
        <div class="chance">
          <p>Chance of Rain: ${rainChance}%</p>
          <p>Chance of Snow: ${snowChance}%</p>
        </div>
      </div>

      <script src="lib/jquery-3.6.0.min.js"></script>
      <script src="app/app.js"></script>
    </div>`;

        displayArray = displayArray + display;
      }

      $(".forecast").html(displayArray);
    }
  ).fail(function (e) {
    console.log(e);
  });
}

$(document).ready(function () {
  formSubmit();
});
