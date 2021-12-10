var _db;

function initFirebase() {
  _db = firebase.firestore();

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("user");
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var providerData = user.providerData;
      var uid = user.uid;
      displayGeneral();
    } else {
      console.log("logged out");
      displayGeneral();
    }
  });
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
}

function login() {
  let email = $("#li--email").val();
  let password = $("#li--pw").val();

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      $("#li--email").val("");
      $("#li--pw").val("");
      // Signed in
      var user = userCredential.user;
      hideModal();
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
}

function signup() {
  let fName = $("#fName").val();
  let lName = $("#lName").val();
  let email = $("#email").val();
  let password = $("#pw").val();

  let name = fName + " " + lName;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // updateUser(name);

      $("#fname").val("");
      $("#lname").val("");
      $("#email").val("");
      $("#pw").val("");
      // Signed in
      var user = userCredential.user;
      // ...
      hideModal();
      console.log("account created");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
      console.log(errorMessage);
    });
}

function googleLogin() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;

      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      hideModal();
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      console.log(errorMessage);
    });
}

function initListeners() {
  $(".indie").click(function (e) {
    $("#content").html("");
    queryMusic("Indie");
  });

  $(".pop").click(function (e) {
    $("#content").html("");
    queryMusic("Pop");
  });

  $(".rap").click(function (e) {
    $("#content").html("");
    queryMusic("Rap");
  });

  $(".all").click(function (e) {
    displayGeneral();
  });

  $(".modal__bg").click(function (e) {
    hideModal();
  });
}

function showModal() {
  $(".modal").css("display", "flex");
}

function hideModal() {
  $(".modal").css("display", "none");
}

function displayMusic(doc) {
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

function queryMusic(genre) {
  const user = firebase.auth().currentUser;

  if (user) {
    _db
      .collection("Albums")
      .where("Genre", "==", genre)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          displayMusic(doc);
        });
      });
  } else {
    _db
      .collection("Albums")
      .where("Genre", "==", genre)
      .limit(3)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          displayMusic(doc);
        });
      });
  }
}

function displayGeneral() {
  const user = firebase.auth().currentUser;
  $("#content").html("");
  let albums = _db.collection("Albums");

  if (user) {
    albums.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        displayMusic(doc);
        // console.log("premium version");
      });
    });
  } else {
    albums
      .where("Genre", "==", "Pop")
      .limit(3)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          displayMusic(doc);
        });
      });

    albums
      .where("Genre", "==", "Rap")
      .limit(3)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          displayMusic(doc);
        });
      });

    albums
      .where("Genre", "==", "Indie")
      .limit(3)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          displayMusic(doc);
        });
      });
  }
}

$("document").ready(function () {
  try {
    initFirebase();
    initListeners();
  } catch {
    console.error("failed to load functions");
  }
});
