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

var code = localStorage.getItem("Code")

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

const checkPass = function()  {
    var pass_enter = document.getElementById("number").value

    firebase.database().ref().once("value", function(snapshot) {
        var user = auth.currentUser;
        var group_IDs = []
        var group_codes = []
        database.ref("groups/").once("value", function(snapshot) {
            snapshot.forEach(function(child) {
                group_IDs.push(child.val().group_ID)
                group_codes.push(child.val().code)
            })
            const new_group_IDs = group_IDs
            group_IDs = []

            const pass = snapshot.val().code
            if(group_codes.includes(pass_enter)) {
                localStorage.setItem("Code", pass_enter)
                document.getElementById("button-Text").style.opacity = 0
                document.querySelector(".bouncing-loader").style.opacity = 1
                setTimeout(function() {
                    document.getElementById("button-Text").textContent = "Correct"
                    document.getElementById("button-Text").style.color = "green"
                    
                    document.getElementById("button-Text").style.transitionDelay = 0
                    document.querySelector(".bouncing-loader").style.transitionDelay = 1
                    document.getElementById("button-Text").style.opacity = 1
                    document.querySelector(".bouncing-loader").style.opacity = 0

                    setTimeout(function() {
                        document.querySelector("body").style.transition = ".5s"
                        document.querySelector("body").style.opacity = 0

                        setTimeout(function() {
                            const group_ID_joined = new_group_IDs[group_codes.indexOf(pass_enter)]
                            var path = user.uid

                            database.ref("groups/" + group_ID_joined + "/group_Members/" + user.uid).update({
                                path
                            }).then(function(){
                                database.ref("users/" + user.uid + "/memos_Joined/" + group_ID_joined).update({
                                    group_ID_joined
                                }).then(function() {
                                    window.location = "../group/?gid=" + group_ID_joined
                                })
                            })
                        }, 500)
                    }, 2000)
                }, 1000)
            } else {
                document.getElementById("button-Text").style.opacity = 0
                document.querySelector(".bouncing-loader").style.opacity = 1
                setTimeout(function() {
                    document.getElementById("button-Text").textContent = "WRONG"
                    document.getElementById("button-Text").style.color = "red"
                    
                    document.getElementById("button-Text").style.transitionDelay = 0
                    document.querySelector(".bouncing-loader").style.transitionDelay = 1
                    document.getElementById("button-Text").style.opacity = 1
                    document.querySelector(".bouncing-loader").style.opacity = 0

                    setTimeout(function() {
                        document.getElementById("button-Text").style.opacity = 0
                        setTimeout(function() {
                            document.getElementById("button-Text").style.color = "black"
                            document.getElementById("button-Text").textContent = "ENTER"
                            document.getElementById("button-Text").style.opacity = 1
                        }, 500)
                    }, 2000)
                }, 1000)
            }``
        });
    })
}

// checkPass()

// const quickCheckPass = function() {
//     firebase.database().ref().once("value", function(snapshot) {
//         const pass = snapshot.val().code
//         if(pass == code) {
//             window.location = "../signup"
//         } else {
//             localStorage.clear()
//         }
//     })
// }


// localStorage.clear()

// if(code != null || code != undefined) {
//     quickCheckPass()
// }

// var group_Members = ["nobody"]
// var group_ID = makeid(15)

// database.ref("groups/" + group_ID + "/").update({
//     "code":"3576",
//     "group_Profile": "https://firebasestorage.googleapis.com/v0/b/riverwoodweek.appspot.com/o/1688846310.png?alt=media&token=fb6ae9c8-0605-49ba-9c6c-82e88a9cb28d",
//     "group_Name":"Riverwood Memo🏕️",
//     "group_Members":group_Members,
//     "group_ID":group_ID
// })