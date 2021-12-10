var _db;

function deleteFile() {
  let storageRef = firebase.storage().ref();
  let desertRef = storageRef.child("images/" + imageURL);
  desertRef
    .delete()
    .then(() => {
      console.log("deleted");
    })
    .catch((error) => {
      console.log("nope");
    });
}

function uploadFile() {
  let storageRef = firebase.storage().ref();
  let imageFile = $("#file").prop(`files`)[0];
  let image = storageRef.child(imageFile.name);

  const metadata = { contentType: imageFile.type };
  let date = Date.parse(new Date());

  const task = storageRef
    .child("images/" + date + imageFile.name)
    .put(imageFile, metadata);
  task
    .then((snapshot) => snapshot.ref.getDownloadURL())
    .then((url) => {
      console.log(url);
      imageURL = date + imageFile.name;
      $("#fbImage").attr("src", url);
    });

  console.log("upload", imageFile);
}

function createAccount() {
  let imageFile = $("#cafile").prop(`files`)[0];
  console.log(imageFile);

  if (imageFile != null) {
    let storageRef = firebase.storage().ref();
    let image = storageRef.child(imageFile.name);
    const metadata = { contentType: imageFile.type };
    let date = Date.parse(new Date());
    console.log("account created");

    let fn = $("#fname").val();
    let ln = $("#lname").val();
    let email = $("#email").val();
    let pw = $("#password").val();

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pw)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        let userID = user.uid;
        _db = firebase.firestore();

        // this is uploading the image
        const task = storageRef
          .child("images/" + date + imageFile.name)
          .put(imageFile, metadata);
        task
          .then((snapshot) => snapshot.ref.getDownloadURL())
          .then((url) => {
            console.log(url);
            let userObj = {
              firstname: fn,
              lastname: ln,
              email: email,
              userImageName: date + imageFile.name,
              userImageURL: url,
            };
            _db
              .collection("USERS")
              .doc(user.uid)
              .set(userObj)
              .then(function (doc) {
                console.log("User id: " + user.uid);
              });
            console.log("finished creating account");
          });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
      });
  } else {
    alert("You need to add an image!");
  }
}
function signout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("signout");
      $(".profie").empty();
    })
    .catch((error) => {
      console.log(error.errorMessage);
    });
}

function login() {
  let email = $("#lemail").val();
  let pw = $("#lpassword").val();

  firebase
    .auth()
    .signInWithEmailAndPassword(email, pw)
    .then((userCredential) => {
      _db = firebase.firestore();
      let userID = userCredential.user.uid;
      // console.log("logged in ", userCredential.user);

      var docRef = _db.collection("USERS").doc(userID);

      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());

            let userProfile = doc.data();

            $(".profile").append(
              `<input type="text" id="firstname" value="${userProfile.firstname}"> `
            );
            $(".profile").append(
              `<input type="text" id="lastname" value="${userProfile.lastname}"> `
            );
            $(".profile").append(
              `<input disabled type="text" id="pEmail" value="${userProfile.email}"> `
            );
            $(".profile").append(
              `<div class="profileImg"><img id="pImg" src="${userProfile.userImageURL}"></div> `
            );
            $(".profile").append(
              `<button onclick="edit('${userID}')"> Save Changes</button>`
            );
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });

      $("#email").val("");
      $("#password").val("");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
    });
}

function edit(userID) {
  let fn = $("#firstname").val();
  let ln = $("#lastname").val();

  console.log(userID);
  let profileObj = { firstname: fn, lastname: ln };
  var docRef = _db.collection("USERS").doc(userID);

  docRef
    .update(profileObj)
    .then((doc) => {
      console.log("doc ", doc);
    })
    .catch((error) => {
      console.error("Error writing document: ", error.errorMessage);
    });
}

function initFirebase() {
  firebase
    .auth()
    .signInAnonymously()
    .then(() => {
      console.log("logged in");
      // Signed in..
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
}

$(document).ready(function () {
  try {
    // initFirebase();
  } catch {
    console.log("error");
  }
});
