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
const auth = firebase.auth();
const imgURL = localStorage.getItem("profile_url")
var my_user;
var firstSearch = true
var world_Group_Members = []
var world_Group_Member_Images = []
var clicked = true
var counter = 0
var counter1 = 0
var uid;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const gid = urlParams.get('gid');

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

var file = ""
var geocoder;
var imgURLRecent = ''
const user = localStorage.getItem("name")
const code = localStorage.getItem("Code")

function checkFolderExistence(folderPath) {
    return new Promise((resolve, reject) => {
      const folderRef = database.ref(folderPath);
  
      folderRef.once("value")
        .then((snapshot) => {
          const folderExists = snapshot.exists();
          resolve(folderExists);
        })
        .catch((error) => {
          reject(error);
        });
    });
}

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

    // Listen for upload state changes
    uploadTask.on(
        'state_changed',
        (snapshot) => {
        // Get the upload progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        document.getElementById("loading-Bar").style.width = progress.toFixed(2) + "%"
        document.getElementById("percent-Text").textContent = progress.toFixed(0) + "%"
        },
        (error) => {
        console.error('Error occurred during upload:', error);
        },
        () => {
        console.log('Upload completed.');
        // Additional logic after the upload is completed
        }
    );

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
            var path = makeid(15)
            uid = my_user.uid
            database.ref("users/" + uid + "/images/" + date).set({
                "path":path,
                "time":String(new Date()),
                "user_name":user,
                "imgURL":imgURLRecent,
                "profile_img":imgURL,
                "uid":uid,
                "like_count":0,
                "liked_by":"nobody"
            }).then(function() {
                database.ref("groups/" + gid + "/images/" + date).set({
                    "path":path,
                    "time":String(new Date()),
                    "user_name":user,
                    "imgURL":imgURLRecent,
                    "profile_img":imgURL,
                    "uid":uid,
                    "like_count":0,
                    "liked_by":"nobody"
                }).then(function() {
                    setTimeout(function() {
                        window.location.reload()
                    }, 1000)
                })
            })
        });
    }).catch(function(error) {
        console.log('Error uploading image:', error);
        // document.getElementById("")
    });
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
    document.getElementById("loading").style.display = "flex"
  
    try {
        const dataURL = await convertFileToDataURL(file);
        uploadImage(dataURL);
        document.getElementById("uploading-Img").setAttribute("src", dataURL)
        document.getElementById("uploading-Img").style.display = "flex"
    //   codeLatLng()
      // Use the dataURL as needed (e.g., upload it to Firebase Storage)
    } catch (error) {
      console.error('Error converting file to data URL:', error);
      document.getElementById("loading").style.display = "none"
    }
});

// document.getElementById("Images1").addEventListener("change", async (event) => {
//     const file = event.target.files[0];
  
//     try {
//         const dataURL = await convertFileToDataURL(file);
//         uploadImage(dataURL);
//     //   codeLatLng()
//       // Use the dataURL as needed (e.g., upload it to Firebase Storage)
//     } catch (error) {
//       console.error('Error converting file to data URL:', error);
//     }
// });


// function codeLatLng() {

//     if ("geolocation" in navigator) {
//         navigator.geolocation.getCurrentPosition(function(position) {
//           const latitude = position.coords.latitude;
//           const longitude = position.coords.longitude;
      
//           const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=2d978186b1e2492eb6c1f375a5d8cb32`;
      
//           fetch(url)
//             .then(response => response.json())
//             .then(data => {
//               if (data.results.length > 0) {
//                 const result = data.results[0];
//                 const city = result.components.city;
//                 const region = result.components.state;
//                 const country = result.components.country;
      
//                 console.log("Latitude: " + latitude);
//                 console.log("Longitude: " + longitude);
//                 console.log("City: " + city);
//                 console.log("Region: " + region);
//                 console.log("Country: " + country);

//                 var path = makeid(15)

//                 database.ref("img/" + path).set({
//                     "path":path,
//                     "Latitude":position.coords.latitude,
//                     "Longitude":position.coords.longitude,
//                     "City":city,
//                     "Region": region,
//                     "Country": country,
//                     "imgURL":imgURLRecent
//                 })
//               }
//             })
//             .catch(error => {
//               console.log("Error: " + error);
//             });
//         });
//     } else {
//         console.log("Geolocation is not supported by your browser");
//     }
      
// }


// Listen for authentication state changes
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const checkPass = function()  {
            try {
                document.getElementById("profile-Top-Img").setAttribute("src", user.photoURL)
                // document.getElementById("img").setAttribute("src", user.photoURL)
                // Usage example
                const folderPath = "groups/" + gid;
                
                checkFolderExistence(folderPath)
                    .then((exists) => {
                    if (!exists) {
                        localStorage.clear()
                        window.location = "../code"
                    }
                })
                    .catch((error) => {
                    console.error("Error occurred while checking folder existence:", error);
                });
                var group_Members = []
                var new_Group_Members = []
                var group_Name;
                var group_Images = []
                database.ref("groups/" + gid + "/group_Members/").once("value", function(snapshot) {
                    snapshot.forEach(function(child) {
                        child.forEach(function(child_child) {
                            
                            group_Members.push(child_child.val())
                        })
                    })
    
                    database.ref("groups/" + gid).once("value", function(snapshot) {
                        my_user = auth.currentUser

                        document.getElementById("img").setAttribute("src", snapshot.val().group_Profile)
    
                        
                        document.getElementById("profile-Top-Img").setAttribute("src", my_user.photoURL)
    
                        for(var i=0;i<group_Members.length;i++) {
                            new_Group_Members.push(group_Members[i])
                        }
                    
                        console.log(new_Group_Members)
                        group_Name = snapshot.val().group_Name
                        group_Images = snapshot.val().images
    
                        document.getElementById("name").textContent = group_Name
                        
                        if(group_Images != undefined && group_Images != null) {
                            database.ref("groups/" + gid + "/group_Members").once("value", function(snapshot) {
                                snapshot.forEach(function(child) {
                                    child.forEach(function(child_child) {
                                        database.ref("users/" + child_child.val() + "/profile_img").once("value", function(snapshot) {
                                            world_Group_Members.push(child_child.val())
                                            world_Group_Member_Images.push(snapshot.val())
                                        })
                                    })
                                })
                                document.getElementById("posts-Container").innerHTML = ""
                                database.ref("groups/" + gid + "/images/").once("value", function(snapshot) {
                                    snapshot.forEach(function(child) {
                                        showImg(child.val(), counter)
                                        counter++
                                    })
        
                                    database.ref("groups/" + gid + "/images/").on("child_added", function(snapshot) {
                                        if(!firstSearch) {
                                            setTimeout(function() {
                                                document.getElementById("new-Memo-Refresh").style.opacity = "1"
                                                document.getElementById("new-Memo-Refresh").style.top = "60px"
                                                setTimeout(function() {
                                                    document.getElementById("new-Memo-Refresh").style.opacity = "0"
                                                    document.getElementById("new-Memo-Refresh").style.top = "50px"
                                                }, 5000)
                                            }, 2000)
                                        }
                
                                        counter1 += 1
                
                                        if(counter1 == counter) {
                                            firstSearch = false
                                            console.log("done loading")
                                            showBody()
                                            var new_html = '<div id="loading"><div id="uploading-Img-Container"><img id="uploading-Img" src=""></div><div id="photo-Uploading-Text"><span>Uploading Image</span><div id="loading-Bar-Container"><div id="loading-Bar"></div></div><div></div><div id="percent-Text">-%</div>'                            
                                            var div = document.createElement("div")
                                            div.innerHTML = new_html
                                            document.getElementById("posts-Container").prepend(div) 
                                        }
                                    })
                                })
        
                                var new_html = '<div id="bottom-Info"><span id="logo">MEMO</span>Created by Benjamin Burnell</div>'
                                var div = document.createElement("div")
                                div.innerHTML = new_html
                                document.getElementById("posts-Container").append(div)
                            })
                        } else {
                            var new_html = '<div id="loading"><div id="uploading-Img-Container"><img id="uploading-Img" src=""></div><div id="photo-Uploading-Text"><span>Uploading Image</span><div id="loading-Bar-Container"><div id="loading-Bar"></div></div><div></div><div id="percent-Text">-%</div>'                            
                            var div = document.createElement("div")
                            div.innerHTML = new_html
                            document.getElementById("posts-Container").prepend(div) 
    
                            new_html = '<div id="bottom-Info"><span id="logo">MEMO</span>Created by Benjamin Burnell</div>'
                            var div = document.createElement("div")
                            div.innerHTML = new_html
                            document.getElementById("posts-Container").append(div)
                            showBody()
                        }
                    })
                })
            } catch(e) {
                window.location = "../code"
            }
        }
        checkPass()
    } else {
        window.location = "../"
    }
});

function openProfile() {
    document.querySelector("body").style.transition = ".5s"
    document.querySelector("body").style.opacity = "0"
    setTimeout(function() {
        window.location = "../profile"
    }, 500)
}


function showImg(data, img_count) {
    var uid = my_user.uid

    
    new_Date_String = formatTimeAgo(new Date(data.time), new Date())

    
    var indexOfPfp15 = world_Group_Members.indexOf(data.uid)
    var profilePic15 = world_Group_Member_Images[indexOfPfp15]
    profile_pic = profilePic15
    var groupPath = Math.floor(new Date(data.time) / 1000)
    var imgLiked = false

    // img_count = counter - img_count
    // console.log(counter - img_count)

    var currentLikeData = groupPath + "|||" + data.path + "|||" + img_count

    
    if(data.liked_by.length == 6) {
        var html = '<div class="img-Post-Container"><div class="posted-img-Container"><div id="fade5" ondblclick="heartImage(`' + currentLikeData + '`)"></div><div id="fade6" ondblclick="heartImage(`' + currentLikeData + '`)"><div class="liked-Img-All-Container"><span class="liked-By-Text" onclick="possibleHeartImage(`' + currentLikeData + '`)"><svg class="mini-Heart-Icon" fill="white" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24"><path d="M12 5.881C12.981 4.729 14.484 4 16.05 4C18.822 4 21 6.178 21 8.95C21 12.3492 17.945 15.1195 13.3164 19.3167L13.305 19.327L12 20.515L10.695 19.336L10.6595 19.3037C6.04437 15.1098 3 12.3433 3 8.95C3 6.178 5.178 4 7.95 4C9.516 4 11.019 4.729 12 5.881Z"/></svg></span></div></div><div id="fade7" ondblclick="heartImage(`' + currentLikeData + '`)"></div><div id="fade8" ondblclick="heartImage(`' + currentLikeData + '`)"></div><img class="posted-img" src="' + data.imgURL + '"><div class="post-Info"><div class="profile-Pic-Container"><img class="profile-Pic" src="' + profile_pic + '"></div><div class="name-Location-Container"><div class="post-Name">' + data.user_name + '</div><div class="location">' + new_Date_String + '</div></div><button class="share-Button" onclick="shareImage(`' + data.imgURL + '`)"><svg class="edit-Icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="white" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 32.055 32.055" xml:space="preserve"><g>    <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967   C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967   s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967   c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"/></g></svg></button></div></div><svg class="larger-Heart-Icon" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24"><path d="M12 5.881C12.981 4.729 14.484 4 16.05 4C18.822 4 21 6.178 21 8.95C21 12.3492 17.945 15.1195 13.3164 19.3167L13.305 19.327L12 20.515L10.695 19.336L10.6595 19.3037C6.04437 15.1098 3 12.3433 3 8.95C3 6.178 5.178 4 7.95 4C9.516 4 11.019 4.729 12 5.881Z"/></svg></div>'
        var div = document.createElement("div")
        div.innerHTML = html
        document.getElementById("posts-Container").prepend(div)

    } else if(data.liked_by.length == 1) {
        if(data.liked_by.includes(uid)) {
            imgLiked = true
            var indexOfPfp = world_Group_Members.indexOf(data.liked_by[0])
            var profilePic1 = world_Group_Member_Images[indexOfPfp]
            var html = '<div class="img-Post-Container"><div class="posted-img-Container"><div id="fade5" ondblclick="heartImage(`' + currentLikeData + '`)"></div><div id="fade6" ondblclick="heartImage(`' + currentLikeData + '`)"><div class="liked-Img-All-Container"><span class="liked-By-Text" onclick="possibleHeartImage(`' + currentLikeData + '`)"><svg class="mini-Heart-Icon" fill="rgb(200, 34, 34)" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24"><path d="M12 5.881C12.981 4.729 14.484 4 16.05 4C18.822 4 21 6.178 21 8.95C21 12.3492 17.945 15.1195 13.3164 19.3167L13.305 19.327L12 20.515L10.695 19.336L10.6595 19.3037C6.04437 15.1098 3 12.3433 3 8.95C3 6.178 5.178 4 7.95 4C9.516 4 11.019 4.729 12 5.881Z"/></svg></span><div class="liked-Img-Container-1"><img class="liked-Img" src="' + profilePic1 + '"></div></div></div><div id="fade7" ondblclick="heartImage(`' + currentLikeData + '`)"></div><div id="fade8" ondblclick="heartImage(`' + currentLikeData + '`)"></div><img class="posted-img" src="' + data.imgURL + '"><div class="post-Info"><div class="profile-Pic-Container"><img class="profile-Pic" src="' + profile_pic + '"></div><div class="name-Location-Container"><div class="post-Name">' + data.user_name + '</div><div class="location">' + new_Date_String + '</div></div><button class="share-Button" onclick="shareImage(`' + data.imgURL + '`)"><svg class="edit-Icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="white" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 32.055 32.055" xml:space="preserve"><g>    <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967   C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967   s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967   c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"/></g></svg></button></div></div><svg class="larger-Heart-Icon" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24"><path d="M12 5.881C12.981 4.729 14.484 4 16.05 4C18.822 4 21 6.178 21 8.95C21 12.3492 17.945 15.1195 13.3164 19.3167L13.305 19.327L12 20.515L10.695 19.336L10.6595 19.3037C6.04437 15.1098 3 12.3433 3 8.95C3 6.178 5.178 4 7.95 4C9.516 4 11.019 4.729 12 5.881Z"/></svg></div>'
        } else {
            var indexOfPfp = world_Group_Members.indexOf(data.liked_by[0])
            var profilePic1 = world_Group_Member_Images[indexOfPfp]
            var html = '<div class="img-Post-Container"><div class="posted-img-Container"><div id="fade5" ondblclick="heartImage(`' + currentLikeData + '`)"></div><div id="fade6" ondblclick="heartImage(`' + currentLikeData + '`)"><div class="liked-Img-All-Container"><span class="liked-By-Text" onclick="possibleHeartImage(`' + currentLikeData + '`)"><svg class="mini-Heart-Icon" fill="rgb(255, 255, 255)" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24"><path d="M12 5.881C12.981 4.729 14.484 4 16.05 4C18.822 4 21 6.178 21 8.95C21 12.3492 17.945 15.1195 13.3164 19.3167L13.305 19.327L12 20.515L10.695 19.336L10.6595 19.3037C6.04437 15.1098 3 12.3433 3 8.95C3 6.178 5.178 4 7.95 4C9.516 4 11.019 4.729 12 5.881Z"/></svg></span><div class="liked-Img-Container-1"><img class="liked-Img" src="' + profilePic1 + '"></div></div></div><div id="fade7" ondblclick="heartImage(`' + currentLikeData + '`)"></div><div id="fade8" ondblclick="heartImage(`' + currentLikeData + '`)"></div><img class="posted-img" src="' + data.imgURL + '"><div class="post-Info"><div class="profile-Pic-Container"><img class="profile-Pic" src="' + profile_pic + '"></div><div class="name-Location-Container"><div class="post-Name">' + data.user_name + '</div><div class="location">' + new_Date_String + '</div></div><button class="share-Button" onclick="shareImage(`' + data.imgURL + '`)"><svg class="edit-Icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="white" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 32.055 32.055" xml:space="preserve"><g>    <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967   C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967   s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967   c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"/></g></svg></button></div></div><svg class="larger-Heart-Icon" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24"><path d="M12 5.881C12.981 4.729 14.484 4 16.05 4C18.822 4 21 6.178 21 8.95C21 12.3492 17.945 15.1195 13.3164 19.3167L13.305 19.327L12 20.515L10.695 19.336L10.6595 19.3037C6.04437 15.1098 3 12.3433 3 8.95C3 6.178 5.178 4 7.95 4C9.516 4 11.019 4.729 12 5.881Z"/></svg></div>'
        }

        var div = document.createElement("div")
        div.innerHTML = html
        document.getElementById("posts-Container").prepend(div)

    } else if(data.liked_by.length == 2) {
        if(data.liked_by.includes(uid)) {
            imgLiked = true
            console.log("Liked")
            var indexOfPfp1 = world_Group_Members.indexOf(data.liked_by[0])
            var indexOfPfp2 = world_Group_Members.indexOf(data.liked_by[1])
            var profilePic1 = world_Group_Member_Images[indexOfPfp1]
            var profilePic2 = world_Group_Member_Images[indexOfPfp2]
            var html = '<div class="img-Post-Container"><div class="posted-img-Container"><div id="fade5" ondblclick="heartImage(`' + currentLikeData + '`)"></div><div id="fade6" ondblclick="heartImage(`' + currentLikeData + '`)"><div class="liked-Img-All-Container"><span class="liked-By-Text" onclick="possibleHeartImage(`' + currentLikeData + '`)"><svg class="mini-Heart-Icon" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="rgb(200, 34, 34)"><path d="M12 5.881C12.981 4.729 14.484 4 16.05 4C18.822 4 21 6.178 21 8.95C21 12.3492 17.945 15.1195 13.3164 19.3167L13.305 19.327L12 20.515L10.695 19.336L10.6595 19.3037C6.04437 15.1098 3 12.3433 3 8.95C3 6.178 5.178 4 7.95 4C9.516 4 11.019 4.729 12 5.881Z"/></svg></span><div class="liked-Img-Container-1"><img class="liked-Img" src="' + profilePic1 + '"></div><div class="liked-Img-Container-2"><img class="liked-Img" src="' + profilePic2 + '"></div></div></div><div id="fade7" ondblclick="heartImage(`' + currentLikeData + '`)"></div><div id="fade8" ondblclick="heartImage(`' + currentLikeData + '`)"></div><img class="posted-img" src="' + data.imgURL + '"><div class="post-Info"><div class="profile-Pic-Container"><img class="profile-Pic" src="' + profile_pic + '"></div><div class="name-Location-Container"><div class="post-Name">' + data.user_name + '</div><div class="location">' + new_Date_String + '</div></div><button class="share-Button" onclick="shareImage(`' + data.imgURL + '`)"><svg class="edit-Icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="white" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 32.055 32.055" xml:space="preserve"><g>    <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967   C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967   s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967   c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"/></g></svg></button></div></div><svg class="larger-Heart-Icon" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24"><path d="M12 5.881C12.981 4.729 14.484 4 16.05 4C18.822 4 21 6.178 21 8.95C21 12.3492 17.945 15.1195 13.3164 19.3167L13.305 19.327L12 20.515L10.695 19.336L10.6595 19.3037C6.04437 15.1098 3 12.3433 3 8.95C3 6.178 5.178 4 7.95 4C9.516 4 11.019 4.729 12 5.881Z"/></svg></div>'
        } else {
            var indexOfPfp1 = world_Group_Members.indexOf(data.liked_by[0])
            var indexOfPfp2 = world_Group_Members.indexOf(data.liked_by[1])
            var profilePic1 = world_Group_Member_Images[indexOfPfp1]
            var profilePic2 = world_Group_Member_Images[indexOfPfp2]
            var html = '<div class="img-Post-Container"><div class="posted-img-Container"><div id="fade5" ondblclick="heartImage(`' + currentLikeData + '`)"></div><div id="fade6" ondblclick="heartImage(`' + currentLikeData + '`)"><div class="liked-Img-All-Container"><span class="liked-By-Text" onclick="possibleHeartImage(`' + currentLikeData + '`)"><svg class="mini-Heart-Icon" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="rgb(255, 255, 255)"><path d="M12 5.881C12.981 4.729 14.484 4 16.05 4C18.822 4 21 6.178 21 8.95C21 12.3492 17.945 15.1195 13.3164 19.3167L13.305 19.327L12 20.515L10.695 19.336L10.6595 19.3037C6.04437 15.1098 3 12.3433 3 8.95C3 6.178 5.178 4 7.95 4C9.516 4 11.019 4.729 12 5.881Z"/></svg></span><div class="liked-Img-Container-1"><img class="liked-Img" src="' + profilePic1 + '"></div><div class="liked-Img-Container-2"><img class="liked-Img" src="' + profilePic2 + '"></div></div></div><div id="fade7" ondblclick="heartImage(`' + currentLikeData + '`)"></div><div id="fade8" ondblclick="heartImage(`' + currentLikeData + '`)"></div><img class="posted-img" src="' + data.imgURL + '"><div class="post-Info"><div class="profile-Pic-Container"><img class="profile-Pic" src="' + profile_pic + '"></div><div class="name-Location-Container"><div class="post-Name">' + data.user_name + '</div><div class="location">' + new_Date_String + '</div></div><button class="share-Button" onclick="shareImage(`' + data.imgURL + '`)"><svg class="edit-Icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="white" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 32.055 32.055" xml:space="preserve"><g>    <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967   C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967   s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967   c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"/></g></svg></button></div></div><svg class="larger-Heart-Icon" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24"><path d="M12 5.881C12.981 4.729 14.484 4 16.05 4C18.822 4 21 6.178 21 8.95C21 12.3492 17.945 15.1195 13.3164 19.3167L13.305 19.327L12 20.515L10.695 19.336L10.6595 19.3037C6.04437 15.1098 3 12.3433 3 8.95C3 6.178 5.178 4 7.95 4C9.516 4 11.019 4.729 12 5.881Z"/></svg></div>'
        }
        var div = document.createElement("div")
        div.innerHTML = html
        document.getElementById("posts-Container").prepend(div)

    } else if(data.liked_by.length >= 3) {
        if(data.liked_by.includes(uid)) {
            imgLiked = true
            var indexOfPfp1 = world_Group_Members.indexOf(data.liked_by[0])
            var indexOfPfp2 = world_Group_Members.indexOf(data.liked_by[1])
            var indexOfPfp3 = world_Group_Members.indexOf(data.liked_by[2])
            var profilePic1 = world_Group_Member_Images[indexOfPfp1]
            var profilePic2 = world_Group_Member_Images[indexOfPfp2]
            var profilePic3 = world_Group_Member_Images[indexOfPfp3]
            var html = '<div class="img-Post-Container"><div class="posted-img-Container"><div id="fade5" ondblclick="heartImage(`' + currentLikeData + '`)"></div><div id="fade6" ondblclick="heartImage(`' + currentLikeData + '`)"><div class="liked-Img-All-Container"><span class="liked-By-Text" onclick="possibleHeartImage(`' + currentLikeData + '`)"><svg class="mini-Heart-Icon" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="rgb(200, 34, 34)"><path d="M12 5.881C12.981 4.729 14.484 4 16.05 4C18.822 4 21 6.178 21 8.95C21 12.3492 17.945 15.1195 13.3164 19.3167L13.305 19.327L12 20.515L10.695 19.336L10.6595 19.3037C6.04437 15.1098 3 12.3433 3 8.95C3 6.178 5.178 4 7.95 4C9.516 4 11.019 4.729 12 5.881Z"/></svg></span><div class="liked-Img-Container-1"><img class="liked-Img" src="' + profilePic1 + '"></div><div class="liked-Img-Container-2"><img class="liked-Img" src="' + profilePic2 + '"></div><div class="liked-Img-Container-3"><img class="liked-Img" src="' + profilePic3 + '"></div></div></div><div id="fade7" ondblclick="heartImage(`' + currentLikeData + '`)"></div><div id="fade8" ondblclick="heartImage(`' + currentLikeData + '`)"></div><img class="posted-img" src="' + data.imgURL + '"><div class="post-Info"><div class="profile-Pic-Container"><img class="profile-Pic" src="' + profile_pic + '"></div><div class="name-Location-Container"><div class="post-Name">' + data.user_name + '</div><div class="location">' + new_Date_String + '</div></div><button class="share-Button" onclick="shareImage(`' + data.imgURL + '`)"><svg class="edit-Icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="white" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 32.055 32.055" xml:space="preserve"><g>    <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967   C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967   s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967   c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"/></g></svg></button></div></div><svg class="larger-Heart-Icon" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24"><path d="M12 5.881C12.981 4.729 14.484 4 16.05 4C18.822 4 21 6.178 21 8.95C21 12.3492 17.945 15.1195 13.3164 19.3167L13.305 19.327L12 20.515L10.695 19.336L10.6595 19.3037C6.04437 15.1098 3 12.3433 3 8.95C3 6.178 5.178 4 7.95 4C9.516 4 11.019 4.729 12 5.881Z"/></svg></div>'
        } else {
            var indexOfPfp1 = world_Group_Members.indexOf(data.liked_by[0])
            var indexOfPfp2 = world_Group_Members.indexOf(data.liked_by[1])
            var indexOfPfp3 = world_Group_Members.indexOf(data.liked_by[2])
            var profilePic1 = world_Group_Member_Images[indexOfPfp1]
            var profilePic2 = world_Group_Member_Images[indexOfPfp2]
            var profilePic3 = world_Group_Member_Images[indexOfPfp3]
            var html = '<div class="img-Post-Container"><div class="posted-img-Container"><div id="fade5" ondblclick="heartImage(`' + currentLikeData + '`)"></div><div id="fade6" ondblclick="heartImage(`' + currentLikeData + '`)"><div class="liked-Img-All-Container"><span class="liked-By-Text" onclick="possibleHeartImage(`' + currentLikeData + '`)"><svg class="mini-Heart-Icon" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="rgb(255, 255, 255)"><path d="M12 5.881C12.981 4.729 14.484 4 16.05 4C18.822 4 21 6.178 21 8.95C21 12.3492 17.945 15.1195 13.3164 19.3167L13.305 19.327L12 20.515L10.695 19.336L10.6595 19.3037C6.04437 15.1098 3 12.3433 3 8.95C3 6.178 5.178 4 7.95 4C9.516 4 11.019 4.729 12 5.881Z"/></svg></span><div class="liked-Img-Container-1"><img class="liked-Img" src="' + profilePic1 + '"></div><div class="liked-Img-Container-2"><img class="liked-Img" src="' + profilePic2 + '"></div><div class="liked-Img-Container-3"><img class="liked-Img" src="' + profilePic3 + '"></div></div></div><div id="fade7" ondblclick="heartImage(`' + currentLikeData + '`)"></div><div id="fade8" ondblclick="heartImage(`' + currentLikeData + '`)"></div><img class="posted-img" src="' + data.imgURL + '"><div class="post-Info"><div class="profile-Pic-Container"><img class="profile-Pic" src="' + profile_pic + '"></div><div class="name-Location-Container"><div class="post-Name">' + data.user_name + '</div><div class="location">' + new_Date_String + '</div></div><button class="share-Button" onclick="shareImage(`' + data.imgURL + '`)"><svg class="edit-Icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="white" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 32.055 32.055" xml:space="preserve"><g>    <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967   C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967   s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967   c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"/></g></svg></button></div></div><svg class="larger-Heart-Icon" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24"><path d="M12 5.881C12.981 4.729 14.484 4 16.05 4C18.822 4 21 6.178 21 8.95C21 12.3492 17.945 15.1195 13.3164 19.3167L13.305 19.327L12 20.515L10.695 19.336L10.6595 19.3037C6.04437 15.1098 3 12.3433 3 8.95C3 6.178 5.178 4 7.95 4C9.516 4 11.019 4.729 12 5.881Z"/></svg></div>'
        }
        var div = document.createElement("div")
        div.innerHTML = html
        document.getElementById("posts-Container").prepend(div)

    }

    // ondblclick
    
    // var currentLikeData = groupPath + "|||" + data.path

    // var html = '<div class="img-Post-Container"><div class="posted-img-Container"><div id="fade5" ondblclick="heartImage(`' + currentLikeData + '`)"></div><div id="fade6" ondblclick="heartImage(`' + currentLikeData + '`)"><div class="liked-Img-All-Container"><span class="liked-By-Text" onclick="possibleHeartImage(`' + currentLikeData + '`)"><svg class="mini-Heart-Icon" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24"><path d="M12 5.881C12.981 4.729 14.484 4 16.05 4C18.822 4 21 6.178 21 8.95C21 12.3492 17.945 15.1195 13.3164 19.3167L13.305 19.327L12 20.515L10.695 19.336L10.6595 19.3037C6.04437 15.1098 3 12.3433 3 8.95C3 6.178 5.178 4 7.95 4C9.516 4 11.019 4.729 12 5.881Z"/></svg></span><div class="liked-Img-Container-1"><img class="liked-Img" src="../images/toronto_img.png"></div><div class="liked-Img-Container-2"><img class="liked-Img" src="../images/cody_img.png"></div><div class="liked-Img-Container-3"><img class="liked-Img" src="../images/Five.jpg"></div></div></div><div id="fade7" ondblclick="heartImage(`' + currentLikeData + '`)"></div><div id="fade8" ondblclick="heartImage(`' + currentLikeData + '`)"></div><img class="posted-img" src="' + data.imgURL + '"><div class="post-Info"><div class="profile-Pic-Container"><img class="profile-Pic" src="' + profile_pic + '"></div><div class="name-Location-Container"><div class="post-Name">' + data.user_name + '</div><div class="location">' + new_Date_String + '</div></div><button class="share-Button" onclick="shareImage(`' + data.imgURL + '`)"><svg class="edit-Icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="white" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 32.055 32.055" xml:space="preserve"><g>    <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967   C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967   s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967   c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"/></g></svg></button></div></div></div>'
    // var div = document.createElement("div")
    // div.innerHTML = html
    // document.getElementById("posts-Container").prepend(div)
    // console.log("something")

    // database.ref("users/" + data.uid).once("value", function(snapshot) {

    //     new_Date_String = formatTimeAgo(new Date(data.time), new Date())
    //     profile_pic = snapshot.val().profile_img
        
    //     var html = '<div class="img-Post-Container"><div class="posted-img-Container"><div id="fade5"></div><div id="fade6"></div><div id="fade7" ondblclick="heartImage(`' + currentLikeData + '`)"></div><div id="fade8" ondblclick="heartImage(`' + currentLikeData + '`)"></div><img class="posted-img" src="' + data.imgURL + '"><div class="post-Info"><div class="profile-Pic-Container"><img class="profile-Pic" src="' + profile_pic + '"></div><div class="name-Location-Container"><div class="post-Name">' + data.user_name + '</div><div class="location">' + new_Date_String + '</div></div><button class="share-Button" onclick="shareImage("' + data.imgURL + '")"><svg class="edit-Icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="white" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 32.055 32.055" xml:space="preserve"><g>    <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967   C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967   s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967   c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"/></g></svg></button></div></div></div>'
    //     var div = document.createElement("div")
    //     div.innerHTML = html
    //     // database.ref("users/" + )
    //     document.getElementById("posts-Container").appendChild(div)
    // })
}

function heartImage(currentLikeData) {
    var uid = my_user.uid
    currentLikeData = currentLikeData.split("|||");
    var hearts = document.querySelectorAll(".larger-Heart-Icon")
    var miniHearts = document.querySelectorAll(".mini-Heart-Icon")
    img_count = (counter - currentLikeData[2]) - 1

    if(hearts[img_count].style.animation == "") {
        hearts[img_count].style.animation = "likedImg 1s forwards"
        miniHearts[img_count].style.fill = "red"
        setTimeout(function() {
            hearts[img_count].style.animation = ""
        }, 1000)
    }
  
    database.ref("groups/" + gid + "/images/" + currentLikeData[0]).once("value", function(snapshot) {
        var like_count = snapshot.val().like_count;
        var liked_by = snapshot.val().liked_by;
        
        if (liked_by === "nobody") {
            like_count = like_count + 1;
            // database.ref("users/" + uid + "/images/" + currentLikeData[1]).update({
            //     "like_count": like_count,
            //     "liked_by": [uid]
            // }).then(function() {
                database.ref("groups/" + gid + "/images/" + currentLikeData[0]).update({
                    "like_count": like_count,
                    "liked_by": [uid]
                })
            // });
        } else {
            if (!liked_by.includes(uid)) {
                like_count = like_count + 1;
                liked_by.push(String(uid)); // Add the user ID to the liked_by array
                // database.ref("users/" + uid + "/images/" + currentLikeData[1]).update({
                //     "like_count": like_count,
                //     "liked_by": liked_by
                // }).then(function() {
                    database.ref("groups/" + gid + "/images/" + currentLikeData[0]).update({
                        "like_count": like_count,
                        "liked_by": liked_by
                    })
                // });
            } else {

            }
        }
    });
}

function possibleHeartImage(currentLikeData) {
    var uid = my_user.uid
    currentLikeData = currentLikeData.split("|||");
    var hearts = document.querySelectorAll(".larger-Heart-Icon")
    var miniHearts = document.querySelectorAll(".mini-Heart-Icon")
    img_count = (counter - currentLikeData[2]) - 1
  
    database.ref("groups/" + gid + "/images/" + currentLikeData[0]).once("value", function(snapshot) {
        var like_count = snapshot.val().like_count;
        var liked_by = snapshot.val().liked_by;
        
        if (liked_by === "nobody") {
            like_count = like_count + 1;
            // database.ref("users/" + uid + "/images/" + currentLikeData[1]).update({
            //     "like_count": like_count,
            //     "liked_by": [uid]
            // }).then(function() {
                database.ref("groups/" + gid + "/images/" + currentLikeData[0]).update({
                    "like_count": like_count,
                    "liked_by": [uid]
                })
            // });

            if(hearts[img_count].style.animation == "") {
                hearts[img_count].style.animation = "likedImg 1s forwards"
                miniHearts[img_count].style.fill = "rgb(200, 34, 34)"
                setTimeout(function() {
                    hearts[img_count].style.animation = ""
                }, 1000)
            }
        } else {
            if (!liked_by.includes(uid)) {
                like_count = like_count + 1;
                liked_by.push(String(uid)); // Add the user ID to the liked_by array
                // database.ref("users/" + uid + "/images/" + currentLikeData[1]).update({
                //     "like_count": like_count,
                //     "liked_by": liked_by
                // }).then(function() {
                    database.ref("groups/" + gid + "/images/" + currentLikeData[0]).update({
                        "like_count": like_count,
                        "liked_by": liked_by
                    })
                // });
                if(hearts[img_count].style.animation == "") {
                    hearts[img_count].style.animation = "likedImg 1s forwards"
                    miniHearts[img_count].style.fill = "rgb(200, 34, 34)"
                    setTimeout(function() {
                        hearts[img_count].style.animation = ""
                    }, 1000)
                }
            } else {
                if(liked_by.length > 1) {
                    like_count = like_count - 1;
                    liked_by.splice(liked_by.indexOf(String(uid)), 1);
                    // database.ref("users/" + uid + "/images/" + currentLikeData[1]).update({
                    //     "like_count": like_count,
                    //     "liked_by": liked_by
                    // }).then(function() {
                        database.ref("groups/" + gid + "/images/" + currentLikeData[0]).update({
                            "like_count": like_count,
                            "liked_by": liked_by
                        })
                    // });
                    if(hearts[img_count].style.animation == "") {
                        miniHearts[img_count].style.fill = "white"
                    }
                } else {
                    like_count = like_count - 1;
                    liked_by = "nobody"
                    // database.ref("users/" + uid + "/images/" + currentLikeData[1]).update({
                    //     "like_count": like_count,
                    //     "liked_by": liked_by
                    // }).then(function() {
                        database.ref("groups/" + gid + "/images/" + currentLikeData[0]).update({
                            "like_count": like_count,
                            "liked_by": liked_by
                        })
                    // });
                    if(hearts[img_count].style.animation == "") {
                        miniHearts[img_count].style.fill = "white"
                    }
                }
            }
        }
    });
}

function getFullDomain() {
    const protocol = window.location.protocol;
    var hostname = window.location.hostname;

    if(hostname == "localhost") {
        
        return protocol + '//' + hostname + ":5500/sharedIMG";
    } else {
        
        return protocol + '//' + hostname + "/memo/sharedIMG";
    }
}
  

function shareImage(imageUrl) {
    var link = getFullDomain()
    console.log(link)
    
    const title = 'Check Out This Memo!';

    if (navigator.share) {
      // Web Share API is supported
      navigator.share({
        title: title,
        url: link + "/?url=" + imageUrl
      })
        .then(() => {
          console.log('Image shared successfully.');
        })
        .catch((error) => {
          console.error('Error occurred during image sharing:', error);
        });
    } else {
      // Web Share API is not supported
      console.warn('Web Share API is not supported in this browser.');
    }
}

function formatTimeAgo(pastDate, currentDate) {
    const timeDiff = currentDate - pastDate;
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
  
    if (years >= 1) {
      return `${years}y ago`;
    } else if (months >= 1) {
      return `${months}m ago`;
    } else if (weeks >= 1) {
      return `${weeks}w ago`;
    } else if (days >= 1) {
      return `${days}d ago`;
    } else if (hours >= 1) {
      return `${hours}h ago`;
    } else if (minutes >= 1) {
      return `${minutes}m ago`;
    } else {
        if(seconds != 0) {
            return `${seconds}s ago`;
        } else {
            return `1s ago`;
        }
    }
}

function calcTime(city, offset) {
    // create Date object for current location
    var d = new Date();

    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + (3600000*offset));

    // return time as a string
    return "The local time for city "+ city +" is "+ nd.toLocaleString();
}

function goHome() {
    document.querySelector("body").style.transition = ".5s"
    document.querySelector("body").style.opacity = "0"
    setTimeout(function() {
        window.location = "../home"
    }, 500)
}


localStorage.setItem("Last_Spot_Link", gid)