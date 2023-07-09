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
var code = localStorage.getItem("Code")
// var group_Members = "something";

// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);

// const group_ID = urlParams.get('gid');
var imgURLRecent = ''
var todays_date = new Date()

var hashedPassword = ""

// firebase.auth().signOut()
//   .then(() => {
//     // User has been logged out successfully
//     console.log('User logged out');
//     // Perform actions for a logged-out user
//   })
//   .catch((error) => {
//     // Handle logout errors
//     console.error('Error logging out:', error);
//   });

// Listen for authentication state changes
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log("User is signed in:", user);
        // window.location = "../group/?gid=" + group_ID
    } else {
        // User is signed out
        console.log("User is signed out");
    }
});

// database.ref("groups/" + group_ID + "/").once("value", function(snapshot) {
//     console.log(snapshot.val())
//     if(snapshot.val().group_Members != "null") {        
//         group_Members = snapshot.val().group_Members
//     }
// })    

// database.ref("groups/" + group_ID + "/").on("child_added", function(snapshot) {
//     console.log(snapshot.val())
//     if(snapshot.val().group_Members != "null") {        
//         group_Members = snapshot.val().group_Members
//     }
// })

// if(code == null || code == undefined) {
//     window.location = "../code"
// }

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
            // Create an image element and set its source to the download URL
            var img = document.createElement('img');
            img.src = downloadURL;
            img.style.display = "none"

            // Append the image element to the document body or any desired location
            document.body.appendChild(img);
            document.getElementById("background-Img").setAttribute("src", downloadURL)

            checkImageLoaded(downloadURL)

            // console.log('Image uploaded and displayed successfully.');
            // console.log('Image URL:', downloadURL);
            imgURLRecent = downloadURL
        });
    }).catch(function(error) {
        console.log('Error uploading image:', error);
    });
}

function checkImageLoaded(url) {
    

    var img = new window.Image();
    img.src = url;
    img.onload = function() {
        setTimeout(function() {
            document.getElementById("profile-Img-Mini").setAttribute("src", url)
            document.getElementById("profile-Img-Mini").style.opacity = ".75"
            document.getElementById("background-Img").style.opacity = "1"
            document.getElementById("button").removeAttribute("disabled")
            document.getElementById("button").style.opacity = "1"
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
    const file = event.target.files[0];
    document.getElementById("profile-Img-Mini").removeAttribute("src")
    document.getElementById("background-Img").removeAttribute("src")
    document.getElementById("profile-Img-Mini").style.opacity = "0"
    document.getElementById("background-Img").style.opacity = "0"
  
    try {
        const dataURL = await convertFileToDataURL(file);
        uploadImage(dataURL);
    //   codeLatLng()
      // Use the dataURL as needed (e.g., upload it to Firebase Storage)
    } catch (error) {
      console.error('Error converting file to data URL:', error);
    }
});

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

const UploadProfile = function() {
    var profile_Pic = document.getElementById("background-Img").src
    var path = makeid(35)

    if(profile_Pic != "" && profile_Pic != null && profile_Pic != undefined) {

        const username1 = String(username).toLowerCase();
        const password = hashedPassword;
        const email = `${username1}@memo.com`;
        console.log(imgURLRecent)


        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User signed in successfully
            const user = userCredential.user;
            user.updateProfile({
                photoURL: imgURLRecent,
                displayName: String(name).toLowerCase()
            })
            console.log('User signed in:', user);
            // Perform actions for a signed-in user
            console.log("Anonymous user signed in:", user);
            database.ref("users/" + user.uid).set({
                "username":String(name).toUpperCase(),
                "profile_img":imgURLRecent,
                "bio":"",
                "date_joined":String(todays_date),
                "uid":path,
                "band":false,
                "search_name":String(username).toLowerCase(),
                "memos_Joined":["none"],
                "password":password
            }).then(function() {
                localStorage.setItem("profile_url", imgURLRecent)
                localStorage.setItem("uid", path)
                document.querySelector("body").style.transition = ".5s"
                document.querySelector("body").style.opacity = 0
                document.querySelector("body").style.transition = ".5s"
                document.querySelector("body").style.opacity = "0"
                setTimeout(function() {                
                    window.location = "../home"
                }, 500)
                // var groupdID = makeid(15)

                // group_Members.push(path)
                // localStorage.setItem("gid", group_ID)



                // group_Members.push(path)

                // console.log(group_Members)

                // database.ref("groups/" + group_ID + "/").update({
                //     "group_Members":group_Members
                // }).then(function() {
                // })
            })
        })
        .catch((error) => {
            // Handle sign-in errors
            console.error('Error signing in:', error);
        });
    }
}

function checkLetterCount() {
    var text = document.getElementById("number").value
    if(text.length != 0) {
        document.getElementById("button").removeAttribute("disabled")
        document.getElementById("button").style.opacity = "1"
    } else {
        document.getElementById("button").setAttribute("disabled", "")
        document.getElementById("button").style.opacity = ".6"
    }
}