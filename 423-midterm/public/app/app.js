var _db;

function initFirebase() {
  console.log("firebase ready");

  _db = firebase.firestore();
}

function initListeners() {
  console.log("listeners ready");

  $("#submit").click(function () {
    let name = $("#name").val();
    let age = $("#age").val();
    let color = $("#color").val();

    let Obj = { name: name, age: age, color: color };

    _db
      .collection("Midterm")
      .add(Obj)
      .then(function (doc) {
        console.log("added document: " + doc.id);
      });

    $("#name").val("");
    $("#age").val("");
    $("#color").val("");
  });

  $("#retrieve").click(function () {
    $(".content").html("");

    _db
      .collection("Midterm")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          $(".content").append(`<div class="container">
            <p>Name: ${doc.data().name}</p>
            <p>Age: ${doc.data().age}</p>
            <p>Favorite Color: ${doc.data().color}</p>
            </div>`);
        });
      });
  });
}

$("document").ready(function () {
  try {
    initFirebase();
    initListeners();
  } catch {
    console.error("failed to load functions");
  }
});
