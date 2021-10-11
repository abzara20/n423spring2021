var _db;

function initFirebase() {
  firebase
    .auth()
    .signInAnonymously()
    .then(() => {
      // signing in anonymously
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      _db = [];
    });
  _db = firebase.firestore();
}

function initListeners() {
  // create listener to filter by each category
  $(".indie").click(function (e) {
    // console.log("indie click");  ///test

    // have to clear content here every click, because in other function the loop will not let them display
    $("#content").html("");

    _db
      .collection("Albums")
      .where("Genre", "==", "Indie")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          displayMusic(doc);
        });
      });
  });

  $(".pop").click(function (e) {
    $("#content").html("");

    _db
      .collection("Albums")
      .where("Genre", "==", "Pop")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          displayMusic(doc);
        });
      });
  });

  $(".rap").click(function (e) {
    $("#content").html("");

    _db
      .collection("Albums")
      .where("Genre", "==", "Rap")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          displayMusic(doc);
        });
      });
  });

  $(".all").click(function (e) {
    $("#content").html("");

    _db
      .collection("Albums")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          displayMusic(doc);
        });
      });
  });
}
// this function will clear and display the music by the filters
function displayMusic(doc) {
  // clear current content

  // display new content
  $("#content").append(`
            <div class='album'>
            <h1>${doc.data().Title}</h1>
            <h3>${doc.data().Artist}</h3>
            <div class="photo" style="background-image: url(${
              doc.data().Photo
            })"></div>
            <p>${doc.data().Genre}</p>
            </div>`);
}

// this function displays all albums as initial load
function initPage() {
  _db
    .collection("Albums")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        $("#content").append(`
            <div class='album'>
            <h1>${doc.data().Title}</h1>
            <h3>${doc.data().Artist}</h3>
            <div class="photo" style="background-image: url(${
              doc.data().Photo
            })"></div>
            <p>${doc.data().Genre}</p>
            </div>`);
      });
    });
}

$("document").ready(function () {
  try {
    initFirebase();
    initListeners();
    initPage();
  } catch {
    console.error("failed to load functions");
  }
});
