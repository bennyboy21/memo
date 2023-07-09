const firebaseConfig = {
    apiKey: "AIzaSyCuwZfSSZj8ZAJeOHc5KyVMoCLyVNpoHtg",
    authDomain: "riverwoodweek.firebaseapp.com",
    projectId: "riverwoodweek",
    storageBucket: "riverwoodweek.appspot.com",
    messagingSenderId: "1082778996477",
    appId: "1:1082778996477:web:2268b67f1c83116456b894",
    measurementId: "G-XSMTVCLVE2"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const storage = firebase.storage().ref();
const auth = firebase.auth()
var currentUserData = ""
var recentPFP = ""

function showBody() {
    document.querySelector("body").style.transition = ".5s"
    document.querySelector("body").style.opacity = "1"
    setTimeout(function() {
        document.querySelector("body").style.transition = "0s"
    }, 500)
}

function closeEditPage() {
    var photos = document.querySelectorAll(".posted-Img")
    document.querySelector("body").style.transition = ".5s"
    document.querySelector("body").style.opacity = 0

    setTimeout(function() {
        
        window.location = "../profile"
    }, 500)
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        user_info = auth.currentUser
        // User is signed in
        // console.log("User is signed in:", user);
        document.querySelector("body").style.transition = ".5s"
        document.querySelector("body").style.opacity = "1"

        // const user = firebase.auth().currentUser;
        // user.updateProfile({
        //     displayName: "BEN"
        // })

        database.ref("users/" + user.uid + "/images").once("value", function(snapshot) {
        
            // Initial start of the timer
            if(snapshot.val() != undefined) {
                document.getElementById("no-Memos-Container").style.display = "none"
                snapshot.forEach(function(child) {
                    showImg(child.val())
                })
                showBody()
            }
        })
      
        document.getElementById("profile-Img").setAttribute("src", user.photoURL)
        document.getElementById("img").setAttribute("src", user.photoURL)
        document.getElementById("name").textContent = user.displayName

        document.getElementById("username").textContent = "@" + user.email.split("@")[0]

        showBody()
        // console.log(user)
    } else {
        window.location = "../"
    }
});

// var imgURL = localStorage.getItem("profile_url")
// var user = localStorage.getItem("name")
// const search_name = localStorage.getItem("username")
// const uid = localStorage.getItem("uid")

// document.getElementById("img").setAttribute("src", imgURL)
// document.getElementById("profile-Img").setAttribute("src", imgURL)
// document.getElementById("name").textContent = user
// document.getElementById("username").textContent = "@" + search_name


// Function to upload data URL to Firebase Storage
function uploadImage(dataURL) {
    // Generate a unique filename for the image
    var filename = Math.floor(Date.now() / 1000) + '.png';

    // Create a reference to the image file in Firebase Storage
    var imageRef = storage.child(filename);

    // Convert the data URL to a Blob object
    var imageBlob = dataURLToBlob(dataURL);

    // Upload the Blob to Firebase Storage
    var uploadTask = imageRef.put(imageBlob);

    // Register an event handler for successful upload
    uploadTask.then(function(snapshot) {
        // Get the download URL of the uploaded image
        snapshot.ref.getDownloadURL().then(function(downloadURL) {
            var date = Math.floor(Date.now() / 1000)
            // Create an image element and set its source to the download URL
            var img = document.createElement('img');
            img.src = downloadURL;
            img.style.display = "none"

            // Append the image element to the document body or any desired location
            document.body.appendChild(img);

            console.log('Image uploaded and displayed successfully.');
            console.log('Image URL:', downloadURL);
            imgURLRecent = downloadURL
            checkImageLoaded(downloadURL)
            recentPFP = downloadURL
        });
    }).catch(function(error) {
        console.log('Error uploading image:', error);
        // document.getElementById("")
    });
}

function checkImageLoaded(url) {
    

    var img = new window.Image();
    img.src = url;
    img.onload = function() {
        setTimeout(function() {
            document.getElementById("img").style.opacity = "0"
            document.getElementById("profile-Img").style.opacity = "0"
            setTimeout(function() {
                document.getElementById("img").setAttribute("src", url)
                document.getElementById("profile-Img").setAttribute("src", url)
                setTimeout(function() {
                    document.getElementById("img").style.opacity = "1"
                    document.getElementById("profile-Img").style.opacity = "1"
                    document.getElementById("update-Button").style.opacity = "1"
                    document.getElementById("update-Button").removeAttribute("disabled", "")
                }, 1000)
            }, 500)
        }, 1500)
        // document.querySelector(".camera-Icon").style.fill = "rgb(10, 10, 10)"
    }
}

// Function to convert data URL to Blob
function dataURLToBlob(dataURL) {
    var arr = dataURL.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}

function convertFileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
    
        reader.onloadend = () => {
            resolve(reader.result);
        };
    
        reader.onerror = (error) => {
            reject(error);
        };
    
        reader.readAsDataURL(file);
    });
}

  
document.getElementById("Images").addEventListener("change", async (event) => {
    currentUserData = auth.currentUser
    const file = event.target.files[0];
  
    try {
        const dataURL = await convertFileToDataURL(file);
        uploadImage(dataURL);
    } catch (error) {
        console.error('Error converting file to data URL:', error);
    }
});

function updateProfile() {
    const user = firebase.auth().currentUser;
    user.updateProfile({
        photoURL: recentPFP
    }).then(function() {
        database.ref("users/" + currentUserData.uid).update({
            "profile_img":recentPFP
        }).then(function() {
            localStorage.setItem("profile_url", recentPFP)
            window.location = "../profile"
        })
    })
}