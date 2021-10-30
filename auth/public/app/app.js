function initListeners() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("user");

      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var providerData = user.providerData;
      var phoneNumber = user.phoneNumber;
      var uid = user.uid;
      // ...
      $(".username").html(`Hello ${displayName}`);
      $(".photo").html(`<img src="${photoURL}" alt="user photo">`);
      //   console.log("phoneNumber " + phoneNumber);
    } else {
      console.log("logged out");
      // User is signed out
      // ...
    }
  });
}

function updateUser(disName) {
  firebase.auth().currentUser.updateProfile({ displayName: disName });
}

function signInGoogle() {
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

function signOut() {
  console.log("signed out");

  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
}

function login() {
  console.log("logged in");
  let email = $("#liemail").val();
  let password = $("#lipw").val();

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      $("#liemail").val("");
      $("#lipw").val("");
      // Signed in
      var user = userCredential.user;
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
}

function create() {
  let fName = $("#fName").val();
  let lName = $("#lName").val();
  let email = $("#email").val();
  let password = $("#pw").val();

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      let fullName = fName + " " + lName;
      updateUser(fullName, "3178675309");

      $("#fName").val("");
      $("#lName").val("");
      $("#email").val("");
      $("#pw").val("");
      // Signed in
      var user = userCredential.user;
      // ...
      console.log("account created");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
      console.log(errorMessage);
    });

  console.log("created account");
}

$(document).ready(function () {
  try {
    let app = firebase.app;
    // initFirebase();
    initListeners();
  } catch {
    console.log("error on the try");
  }
});
