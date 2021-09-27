var Students = [];

function initSite() {
  // checks to see if the local storage is available when the site is ready
  if (localStorage) {
    console.log("Local storage present");
  } else {
    console.log("Local storage not detected");
  }
}

function initListeners() {
  // function to save data to the local storage
  $("#submit").click(function (e) {
    let fn = $("#fn").val();
    let ln = $("#ln").val();
    let age = $("#age").val();
    let email = $("#email").val();
    let phone = $("#phone").val();
    //   getting the info for the classes, and putting them in an array
    let classes = $("#classes").val();
    let schedule = classes.split(",");

    // grabbing all the data and putting it into an object
    let Obj = {
      fName: fn,
      lName: ln,
      age: age,
      email: email,
      phone: phone,
      classes: schedule,
    };
    // console.log(Obj);

    // pushes the student object to the array of students to be added to local storage
    Students.push(Obj);

    // sends the item to local storage, then console logs the local storage
    localStorage.setItem("Students", JSON.stringify(Students));
    console.log("local: " + localStorage.getItem("Students"));

    // empties the values on the inputs
    $("#fn").val("");
    $("#ln").val("");
    $("#age").val("");
    $("#phone").val("");
    $("#email").val("");
    $("#classes").val("");
  });
  $("#display").click(function (e) {
    // clears current list from display
    $(".display-container").html("");
    //   gets the JSON string from the local storage
    let studentList = JSON.parse(localStorage.getItem("Students"));
    console.log(studentList);
    $.each(studentList, function (inx, student) {
      $(".display-container").append(`
        <div class="display-container__item">
        <h2>Student</h2>
            <p>First Name: ${student.fName}</p>
            <p>Last Name: ${student.lName}</p>
            <p>Age: ${student.age}</p>
            <p>Phone: ${student.phone}</p>
            <p>Email: ${student.email}</p>
            <p>Classes: ${student.classes}</p>
        </div>
        `);
    });
  });
}

$(document).ready(function () {
  initSite();
  initListeners();
});
