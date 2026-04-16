// 🔥 Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDRGLcmWJs6Hl-wpseKyBNDQWUI7N36cmI",
  authDomain: "gallery-memories.firebaseapp.com",
  projectId: "gallery-memories",
};


firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const storage = firebase.storage();

let gallery = document.getElementById("gallery");

// LOGIN
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .catch(err => alert(err.message));
}

// LOGOUT
function logout() {
  auth.signOut();
}

// BUTTONS
window.onload = () => {
  document.getElementById("loginBtn").onclick = login;
  document.getElementById("logoutBtn").onclick = logout;

  document.getElementById("uploadBtn").onclick = () => {
    document.getElementById("upload").click();
  };
};

// AUTH STATE
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("user").innerText =
      "Welcome " + user.displayName;

    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("logoutBtn").style.display = "inline-block";

    loadImages();
  } else {
    document.getElementById("user").innerText = "";
    gallery.innerHTML = "";

    document.getElementById("loginBtn").style.display = "inline-block";
    document.getElementById("logoutBtn").style.display = "none";
  }
});

// UPLOAD
document.getElementById("upload").addEventListener("change", function(e) {
  const user = auth.currentUser;
  if (!user) return alert("Login first!");

  let files = e.target.files;

  for (let file of files) {
    let fileName = Date.now() + "_" + file.name;

    let ref = storage.ref("memories/" + user.uid + "/" + fileName);

    ref.put(file).then(() => {
      ref.getDownloadURL().then(url => {
        displayImage(url);
      });
    });
  }
});

// DISPLAY IMAGE
function displayImage(url) {
  let img = document.createElement("img");
  img.src = url;

  img.onclick = () => openViewer(url);

  gallery.appendChild(img);
}

// LOAD IMAGES
function loadImages() {
  const user = auth.currentUser;
  if (!user) return;

  const listRef = storage.ref("memories/" + user.uid);

  listRef.listAll().then(res => {
    gallery.innerHTML = "";

    res.items.forEach(item => {
      item.getDownloadURL().then(url => {
        displayImage(url);
      });
    });
  });
}

// VIEWER
function openViewer(url) {
  document.getElementById("viewerImg").src = url;
  document.getElementById("viewer").style.display = "flex";
}

function closeViewer() {
  document.getElementById("viewer").style.display = "none";
}