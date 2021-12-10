var _db;
var currentBuild = "";
var currentAbility = "";
// the max amount of EVs a pokemon can earn is 510, but a max of 252 per stat for it to count.
var evCount = 0;
var evArray = [0, 0, 0, 0, 0, 0];
var statArray = [0, 0, 0, 0, 0, 0];

// user authentication functions
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
      var phoneNumber = user.phoneNumber;
      var uid = user.uid;

      $("#login").css("display", "none");
      $("#logout").css("display", "block");

      route();
    } else {
      console.log("user signed out");
      $("#login").css("display", "block");
      $("#logout").css("display", "none");
    }
  });
}

function updateProfile(username) {
  firebase.auth().currentUser.updateProfile({ displayName: username });
}

function login() {
  let email = $("#lemail").val();
  let pw = $("#lpw").val();

  firebase
    .auth()
    .signInWithEmailAndPassword(email, pw)
    .then((userCredential) => {
      _db = firebase.firestore();
      let userID = userCredential.user.uid;
      // console.log("logged in ", userCredential.user);

      var docRef = _db.collection("FinalUsers").doc(userID);

      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());

            let userProfile = doc.data();
            window.location.hash = "#/home";
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });

      $("#email").val("");
      $("#lpw").val("");
    });
}

function signup() {
  let fn = $(`#fname`).val();
  let ln = $(`#lname`).val();
  let username = $(`#username`).val();
  let email = $(`#email`).val();
  let password = $(`#pw`).val();

  if (username != "") {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        updateProfile(username);

        let userObj = {
          firstName: fn,
          lastName: ln,
          username: username,
          email: email,
        };
        _db
          .collection("FinalUsers")
          .doc(user.uid)
          .set(userObj)
          .then(function (doc) {
            console.log("User id: " + user.uid);
          });
        console.log("finished creating account");
      });
  }
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("User signed out");
      // put to load back into launch page and clear all information about user
    })
    .catch((error) => {
      console.log(error.errorMessage);
    });
}

function route() {
  let hash = window.location.hash;
  let pgID = hash.replace("#/", "");

  if (pgID == "") {
    MODEL.pgChange("launch", chBackground);
    clear();
  } else if (pgID == "home") {
    MODEL.pgChange(pgID, loadHome);
    clear();
  } else if (pgID == "edit") {
    MODEL.pgChange(pgID, loadView);
  } else if (pgID == "profile") {
    MODEL.pgChange(pgID, loadUser);
  } else {
    MODEL.pgChange(pgID, chBackground);
    clear();
  }

  console.log(currentBuild, evArray, currentAbility, evCount);
}

function initListeners() {
  $(window).on("hashchange", route);
  route();
  console.log("hello");
}

function getData(active) {
  let pokemon = $(`#search`).val();

  // this is to ensure that the active ability for a pokemon being edited will stay the active, otherwise the default term "ability will be what appears first"
  if (active == "") {
    $(`#ability`).html(`<option>ability</option>`);
  } else {
    $(`#ability`).html(`<option>${active}</option>`);
  }
  $.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`, function (data) {
    // console.log(data);

    let typeStr = "";

    $.each(data.types, function (index, type) {
      typeStr = typeStr + " " + `${type.type.name}`;
    });

    $(`#type`).val(typeStr);

    $.each(data.abilities, function (index, ability) {
      $(`#ability`).append(`<option>${ability.ability.name}</option>`);
    });

    $.each(data.stats, function (index, stat) {
      $(`#stat${index} p`).html(`${stat.base_stat + statArray[index]}`);
      $(`#fill${index}`).css("width", `${stat.base_stat + statArray[index]}`);
    });
    $.each(evArray, function (index, ev) {
      $(`#ev${index}`).val(`${ev}`);
    });
  });
}

function addEv(index) {
  if (evCount < 510) {
    if (evArray[index] < 252) {
      evArray[index] = evArray[index] + 4;

      currentAbility = $(`#ability`).val();
      getData(currentAbility);

      evCount = evCount + 4;
      statArray[index] = evArray[index] / 4;
    }
  }
}

function subEv(index) {
  if (evArray[index] > 0) {
    evArray[index] = evArray[index] - 4;

    currentAbility = $(`#ability`).val();
    getData(currentAbility);

    evCount = evCount - 4;
    statArray[index] = evArray[index] / 4;
  }
}

function save() {
  let moveset = [];

  for (let i = 0; i < 4; i++) {
    moveset[i] = $(`#move${i + 1}`).val();
  }

  let trainer = firebase.auth().currentUser;

  let buildObj = {
    trainer: trainer.uid,
    name: $(`#bName`).val(),
    pokemon: $(`#search`).val(),
    ability: $(`#ability`).val(),
    item: $(`#item`).val(),
    evs: evArray,
    moveset: moveset,
  };

  console.log(buildObj);
  _db
    .collection("pokemon")
    .add(buildObj)
    .then(function (doc) {
      console.log("added document: ", doc);
      window.location.hash = "#/home";
    });
}

function clear() {
  evArray = [0, 0, 0, 0, 0, 0];
  evCount = 0;
  currentAbility = "";
  currentBuild = "";
}

// functions to load proper informations to pages
function loadView() {
  chBackground("edit");
  _db
    .collection("pokemon")
    .doc(currentBuild)
    .get()
    .then((doc) => {
      $(`#search`).val(`${doc.data().pokemon}`);
      $(`#bName`).val(`${doc.data().name}`);
      $(`#item`).val(`${doc.data().item}`);

      currentAbility = doc.data().ability;
      evArray = doc.data().evs;

      $.each(evArray, function (index, ev) {
        statArray[index] = ev / 4;
      });

      $.each(doc.data().moveset, function (index, move) {
        $(`#move${index + 1}`).val(`${move}`);
      });
      getData(currentAbility);
    });
}

function edit() {
  let moveset = [];

  for (let i = 0; i < 4; i++) {
    moveset[i] = $(`#move${i + 1}`).val();
  }

  let trainer = firebase.auth().currentUser;

  let buildObj = {
    trainer: trainer.uid,
    name: $(`#bName`).val(),
    pokemon: $(`#search`).val(),
    ability: $(`#ability`).val(),
    item: $(`#item`).val(),
    evs: evArray,
    moveset: moveset,
  };

  console.log(buildObj);
  _db
    .collection("pokemon")
    .doc(currentBuild)
    .set(buildObj)
    .then(() => {
      console.log("document changed");
      window.location.hash = "#/home";
    });
}

function delBuild() {
  _db
    .collection("pokemon")
    .doc(currentBuild)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
      window.location.hash = "#/home";
    });
}
// end edit form functions

function loadHome() {
  $(`.pokemonContainer`).html("");
  chBackground("home");

  let builds = _db.collection("pokemon");
  let trainer = firebase.auth().currentUser;

  builds
    .where("trainer", "==", trainer.uid)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        displayBuild(doc);
      });
    });
}

function displayBuild(doc) {
  $(`.pokemonContainer`).append(`
  <div class="buildContainer" onclick="editPg('${doc.id}')">
  <h3>${doc.data().name}</h3>
  <p>${doc.data().pokemon}</p>
  </div>`);
}
// end homepage functions

function loadUser() {
  chBackground("profile");
  let user = firebase.auth().currentUser;
  $(".username").val(`${user.displayName}`);
  $("#userEmail").val(`${user.email}`);
  _db
    .collection("FinalUsers")
    .doc(user.uid)
    .get()
    .then((doc) => {
      // $("#idContainer").append(doc.id);
      $("#userFN").val(`${doc.data().firstName}`);
      $("#userLN").val(`${doc.data().lastName}`);
      console.log(doc.firstName, doc.lastName);
    });
}

function updateUser() {
  let user = firebase.auth().currentUser;

  if ($(".username").val() != user.displayName) {
    updateProfile($(".username").val());
  }

  if ($("#userPW").val() != "") {
    let newPassword = $("#userPW").val();
    user
      .updatePassword(newPassword)
      .then(() => {
        console.log("New Password Set.");
        // Update successful.
      })
      .catch((error) => {
        // An error ocurred
        console.log(error.Message);
      });
  }
  _db
    .collection("FinalUsers")
    .doc(user.uid)
    .update({
      firstName: $("#userFN").val(),
      lastName: $("#userLN").val(),
      username: $(".username").val(),
    })
    .then(() => {
      window.alert("profile changed");
    });
}

// create the function to get the document's id to load the correct information
function editPg(id) {
  window.location.hash = "#/edit";
  currentBuild = id;
}

function chBackground(pg) {
  document.getElementById("wrapper").className = "wrapper--" + pg;
  if (pg == "home" || pg == "profile") {
    $("nav a").addClass("light");
  } else {
    $("nav a").removeClass("light");
  }
}

$(document).ready(function () {
  try {
    initListeners();
    initFirebase();
  } catch {
    console.log("fail on startup");
  }
});
