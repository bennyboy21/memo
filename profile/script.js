var lastScrollTop = 0

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

var user_info;

// var my_uid = localStorage.getItem("uid")
var my_info;

// database.ref("users/").once("value", function(snapshot) {
//     snapshot.forEach(function(child) {
//         if(child.val().uid == my_uid) {
//             console.log(child.val().uid)
//         }
//     });
// });

// Listen for authentication state changes
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        user_info = auth.currentUser
        // User is signed in
        // console.log("User is signed in:", user);
        document.querySelector("body").style.transition = ".5s"
        // document.querySelector("body").style.opacity = "1"

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
            } else {
                
                showBody()
            }
        })
      
      
        document.getElementById("img").setAttribute("src", user.photoURL)
        document.getElementById("name").textContent = user.displayName

        document.getElementById("username").textContent = "@" + user.email.split("@")[0]
        // console.log(user)
    } else {
        document.querySelector("body").style.transition = ".5s"
        document.querySelector("body").style.opacity = "0"
        setTimeout(function() {
            window.location = "../"
        }, 500)
    }
});

function showImg(data) {
    counter += 1

    
    new_Date_String = formatTimeAgo(new Date(data.time), new Date())
    profile_pic = user_info.photoURL
    // console.log(user_info)
    // snapshot.val().profile_img
    
    var html = '<div class="img-Post-Container"><div class="posted-img-Container"><div id="fade5"></div><div id="fade6"></div><div id="fade7"></div><div id="fade8"></div><img class="posted-img" src="' + data.imgURL + '"><div class="post-Info"><div class="profile-Pic-Container"><img class="profile-Pic" src="' + profile_pic + '"></div><div class="name-Location-Container"><div class="post-Name">' + data.user_name + '</div><div class="location">' + new_Date_String + '</div></div><button class="share-Button" onclick="shareImg()"><svg class="edit-Icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="white" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 32.055 32.055" xml:space="preserve"><g>    <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967   C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967   s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967   c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"/></g></svg></button></div></div></div>'
    var div = document.createElement("div")
    div.innerHTML = html
    document.getElementById("posts-Container").prepend(div)

    // database.ref("users/" + data.uid).once("value", function(snapshot) {

    //     new_Date_String = formatTimeAgo(new Date(data.time), new Date())
    //     profile_pic = snapshot.val().profile_img
        
    //     var html = '<div class="img-Post-Container"><div class="posted-img-Container"><div id="fade5"></div><div id="fade6"></div><div id="fade7"></div><div id="fade8"></div><img class="posted-img" src="' + data.imgURL + '"><div class="post-Info"><div class="profile-Pic-Container"><img class="profile-Pic" src="' + profile_pic + '"></div><div class="name-Location-Container"><div class="post-Name">' + data.user_name + '</div><div class="location">' + new_Date_String + '</div></div><button class="share-Button" onclick="shareImg()"><svg class="edit-Icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="white" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 32.055 32.055" xml:space="preserve"><g>    <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967   C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967   s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967   c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"/></g></svg></button></div></div></div>'
    //     var div = document.createElement("div")
    //     div.innerHTML = html
    //     // database.ref("users/" + )
    //     document.getElementById("posts-Container").appendChild(div)
    // })
}


// document.getElementById("posts-Container").innerHTML = ""
var counter = 0


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
      return `${seconds}s ago`;
    }
}

function closeImg() {
    document.querySelector("body").style.transition = ".5s"
    document.querySelector("body").style.opacity = 0

    setTimeout(function() {
        document.getElementById("img-Show-Container").style.opacity = 0
        document.getElementById("img-Show-Container").style.display = "none"
        document.querySelector("body").style.transition = ".5s"
        document.querySelector("body").style.opacity = 1
        document.querySelector("body").style.overflow = "hidden"
        document.getElementById("main-Container").style.display = ""
        document.getElementById("main-Container").style.opacity = 1
        window.scrollTo(0, lastScrollTop);
        
        setTimeout(function() {
            document.querySelector("body").style.overflow = "visible"
            document.querySelector("body").style.transition = "0"
        }, 500)
    }, 500)
}

// Initialize variables
let timer;
let slideShowPlaying = false
let timer1, timer2, timer3;

// Function to restart the timer
function restartTimer() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    // Perform actions after 30 seconds of inactivity
    // slideShow()
    if(!slideShowPlaying) {
        // clearTimeout(timer);
        // slideShow(0)
    }
  }, 30000);
}

function goHome() {
    document.querySelector("body").style.transition = ".5s"
    document.querySelector("body").style.opacity = 0

    setTimeout(function() {
        // window.history.back()
        var lastSpot = localStorage.getItem("Last_Spot_Link") 
        if(lastSpot != undefined) {
            if(lastSpot != "home") {            
                window.location = "../group/?gid=" + lastSpot
            } else {
                window.location = "../home"
            }
        } else {
            window.location = "../home"
        }
    }, 500)
}

// Event listeners for click and scroll events
document.addEventListener("click", restartTimer);
document.addEventListener("scroll", restartTimer);

function showBody() {
    document.querySelector("body").style.transition = ".5s"
    document.querySelector("body").style.opacity = "1"
    setTimeout(function() {
        document.querySelector("body").style.transition = "0s"
    }, 500)
}

// function slideShow(i) {
//     document.getElementById("slide-Show-Container").style.zIndex = 5
//     lastScrollTop = window.scrollY
//     var photos = document.querySelectorAll(".posted-Img")
    
//     document.querySelector("body").style.transition = "1s"
//     document.querySelector("body").style.opacity = 0

//     timer1 = setTimeout(function() {
//         document.getElementById("slide-Show-Img").setAttribute("src", photos[i].src)
//         document.getElementById("main-Container").style.opacity = 0
//         document.getElementById("main-Container").style.display = "none"
//         document.getElementById("img-Show-Container").style.opacity = 0
//         document.getElementById("img-Show-Container").style.display = "none"
//         document.querySelector("body").style.transition = "1s"
//         document.querySelector("body").style.opacity = 1
//         document.querySelector("body").style.overflow = "hidden"
//         document.getElementById("slide-Show-Container").style.opacity = 1

//         window.scrollTo(0, 0);
        
//         timer2 = setTimeout(function() {
//             document.querySelector("body").style.transition = "0"
//             document.querySelector("body").style.overflow = "visible"
//             timer3 = setTimeout(function() {
//                 if(photos.length != i + 1) {
//                     slideShow(i + 1)
//                 } else {                
//                     slideShow(0)
//                 }
//             }, 5000)
//         }, 1000)
//     }, 1000)
//     slideShowPlaying = true
// }


// document.getElementById("slide-Show-Img").addEventListener("click", closeSlideShow())


// function closeSlideShow() {
//     document.getElementById("slide-Show-Container").style.zIndex = -1
//     document.querySelector("body").style.transition = ".5s"
//     document.querySelector("body").style.opacity = 0
//     clearTimeout(timer1);
//     clearTimeout(timer2);
//     clearTimeout(timer3);

//     setTimeout(function() {
//         document.getElementById("slide-Show-Container").style.opacity = 0
//         document.getElementById("img-Show-Container").style.opacity = 0
//         document.getElementById("img-Show-Container").style.display = "none"
//         document.querySelector("body").style.transition = ".5s"
//         document.querySelector("body").style.opacity = 1
//         document.querySelector("body").style.overflow = "hidden"
//         document.getElementById("main-Container").style.display = ""
//         document.getElementById("main-Container").style.opacity = 1
//         window.scrollTo(0, lastScrollTop);
        
//         setTimeout(function() {
//             document.querySelector("body").style.overflow = "visible"
//             document.querySelector("body").style.transition = "0"
//         }, 500)
//     }, 500)
//     slideShowPlaying = false
// }

function editPage() {
    var photos = document.querySelectorAll(".posted-Img")
    document.querySelector("body").style.transition = ".5s"
    document.querySelector("body").style.opacity = 0

    setTimeout(function() {
        document.getElementById("main-Container").style.opacity = 0
        document.getElementById("main-Container").style.display = "none"
        
        window.location = "../edit"
    }, 500)
}

// function showBody() {
//     document.querySelector("body").style.transition = ".5s"
//     document.querySelector("body").style.opacity = "1"
//     setTimeout(function() {
//         document.querySelector("body").style.transition = "0s"
//     }, 500)
// }

// database.ref("users/" + uid + "/images/").once("value", function(snapshot) {
//     snapshot.forEach(function(child) {
//         showImg(child.val())
//     })
// }).then(function() {
//     if(counter > 0) {
//         document.getElementById("no-Memos-Container").style.display = "none"
//     }
//     showBody()
// })