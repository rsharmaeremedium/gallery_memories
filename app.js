// 🔥 Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDRGLcmWJs6Hl-wpseKyBNDQWUI7N36cmI",
  authDomain: "gallery-memories.firebaseapp.com",
  projectId: "gallery-memories",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

let gallery = document.getElementById("gallery");

// Login
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => {
      document.getElementById("user").innerText =
        "Welcome " + result.user.displayName;
      loadImages();
    })
    .catch(err => alert(err.message));
}

// Logout
function logout() {
  auth.signOut();
  document.getElementById("user").innerText = "";
  gallery.innerHTML = "";
}

// Upload
document.getElementById("upload").addEventListener("change", function(e) {
  const user = auth.currentUser;
  if (!user) return alert("Login first!");

  let files = e.target.files;

  for (let file of files) {
    let reader = new FileReader();
    reader.onload = function(event) {
      let img = document.createElement("img");
      img.src = event.target.result;
      gallery.appendChild(img);

      saveImage(event.target.result);
    };
    reader.readAsDataURL(file);
  }
});

// Save per user
function saveImage(data) {
  const user = auth.currentUser;
  let key = "memories_" + user.uid;

  let images = JSON.parse(localStorage.getItem(key) || "[]");
  images.push({data, date: new Date()});
  localStorage.setItem(key, JSON.stringify(images));
}

// Load per user
function loadImages() {
  const user = auth.currentUser;
  if (!user) return;

  let key = "memories_" + user.uid;
  let images = JSON.parse(localStorage.getItem(key) || "[]");

  gallery.innerHTML = "";

  images.forEach(imgData => {
    let img = document.createElement("img");
    img.src = imgData.data;
    gallery.appendChild(img);
  });
}

// Auto login state
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("user").innerText =
      "Welcome " + user.displayName;
    loadImages();
  }
});

// Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js');
}
