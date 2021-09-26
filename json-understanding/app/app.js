function getData() {
  $.getJSON("../data/data.json", function (data) {
    // console.log(data);
    $.each(data, function (idx, obj) {
      console.log(obj.last_name);

      $("#content").append(`
      <div class="item">
        <h2>${obj.id}</h2>
        <p>${obj.last_name}</p>
        <p>${obj.email}</p>
        <p>${obj.gender}</p>
        <div class="car">
          <p>Car Name(s): ${obj.car_model.car_name}</p>
        </div>
        <p>${obj.city}</p>
      </div>
      `);
    });
  });
}

$(document).ready(function () {
  getData();
});
