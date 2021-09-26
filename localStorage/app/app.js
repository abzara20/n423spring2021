// creating an obj array, can also be made in listener
var Students = [];

function initSite() {
  if (localStorage) {
    // checking to see if we have local storage
    console.log("I have it");
    if (localStorage) {
      let rememberName = JSON.parse(localStorage.getItem("Remember"));
      if (rememberName.remember) {
        $("#fName").val(rememberName.fName);
        $("#lName").val(rememberName.lName);
      }
    }

    // creating a small json object saved to local storage
    // localStorage.setItem("students", JSON.stringify({ name: "Abi" }));

    // getting the object named students (from json) and displaying it in the console
    // console.log(localStorage.getItem("students"));
  } else {
    console.log("Crap i don't have it");
  }
}

function initListener() {
  $("#submit").click(function (e) {
    e.preventDefault();

    let fn = $("#fName").val();
    let ln = $("#lName").val();
    let email = $("#email").val();
    let checkbox = $("#checkbox").is(":checked");

    let Obj = { fName: fn, lName: ln, email: email, remember: checkbox };

    // console.log(fn + " " + ln);

    // let studentName = fn + " " + ln;
    // let stuObj = { name: studentName, email: email };
    // console.log(stuObj);

    // here we are adding students to the array by pushing and logging it to see it work
    // Students.push(stuObj);
    // console.log(Students);

    // adds array to local storage, this one can grow so it'll have all the objs
    if (checkbox) {
      localStorage.setItem("Remember", JSON.stringify(Obj));
      console.log(localStorage.getItem("Remember"));
    } else {
      localStorage.setItem("Remember", JSON.stringify(Obj));
      console.log("Chose not to remember");
    }

    // this one only does one, and it overrides the existing value
    // localStorage.setItem("students", JSON.stringify(stuObj));

    $("#fName").val("");
    $("#lName").val("");
    $("#email").val("");
  });
}

$(document).ready(function () {
  initSite();
  initListener();
});
