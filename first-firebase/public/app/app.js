// this gonna b our database
var _db;

function initFirebase() {
  firebase
    .auth()
    .signInAnonymously()
    .then(() => {
      // Signed in..
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      _db = [];
    });
  // associated _db with our firebase firestore
  _db = firebase.firestore();
}

function initListeners() {
  $("#qDB").click(function (e) {
    // we are making a query here for the documents on the database
    // here the where is important, its what we are searching for
    _db
      .collection("Names")
      .where("fName", ">=", "abby")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          console.log("name" + doc.data().fName + doc.id);
        });
      });
  });

  $(".submitBtn").click(function (e) {
    let fn = $("#fName").val();
    // shove the name into an object
    let fnObj = { fName: fn };
    // create a collection, or grab it if it exists. collection is like a named array of objects
    _db
      .collection("Names")
      .add(fnObj)
      .then(
        function (doc) {
          console.log("added doc " + doc.id);
        },
        function (error) {
          console.log("error ", error);
        }
      );

    $("#fName").val("");
  });

  $(".getBtn").click(function (e) {
    _db
      .collection("Names")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          console.log(doc.data().fName);
        });
      });
  });
}

$("document").ready(function () {
  try {
    let app = firebase.app();
    initFirebase();
    initListeners();
  } catch {
    console.error(e);
  }
});
