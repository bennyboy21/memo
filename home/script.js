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

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        user_info = auth.currentUser
        // User is signed in
        // console.log("User is signed in:", user);
        document.querySelector("body").style.transition = ".5s"
        document.querySelector("body").style.opacity = "1"

      
      
        document.getElementById("profile-Top-Img").setAttribute("src", user.photoURL)
        document.getElementById("img").setAttribute("src", user.photoURL)

        database.ref("users/" + user_info.uid + "/memos_Joined").on("value", function(snapshot) {
            snapshot.forEach(function(child) {
                child.forEach(function(child_child) {
                    showGroup(child_child.val())
                })
            })
            showBody()
        })
        // console.log(user)
    } else {
        window.location = "../"
    }
});

function showGroup(gid) {
    document.getElementById("no-Memos-Container").style.display = "none"
    database.ref("groups/" + gid).once("value", function(snapshot) {
        // console.log(snapshot.val())
        // console.log(snapshot.val().images)
        // console.log(Object.keys(snapshot.val().group_Members).length)
        // var member_Count = Object.keys(snapshot.val().group_Members).length + " Members"
        var member_Count = Object.keys(snapshot.val().images).length + " Memos"

        var html = '<div class="group-Container" onclick="openGroup(`' + gid + '`)"><div class="group-Img-Container"><img src="' + snapshot.val().group_Profile + '" class="group-Img"></div><div class="bottom-Fade"><div class="group-Info"><div class="group-name">' + snapshot.val().group_Name + '</div><div class="member-Count">' + member_Count + '</div></div></div></div>'

        document.getElementById("group-Joined-Container").innerHTML += html
    })
}

function openGroup(gid) {
    document.querySelector("body").style.transition = ".5s"
    document.querySelector("body").style.opacity = "0"
    setTimeout(function() {
        window.location = "../group/?gid=" + gid 
    }, 500)
}

function openProfile() {
    document.querySelector("body").style.transition = ".5s"
    document.querySelector("body").style.opacity = "0"
    setTimeout(function() {
        window.location = "../profile"
    }, 500)
}

localStorage.setItem("Last_Spot_Link", "home")