var currentUser;               //points to the document of the user who is logged in
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    let userNotificationNumber = userDoc.data().Notification.Number;


                    //if the data fields are not empty, then write them in to the form.
                    if (userNotificationNumber != null) {
                        document.getElementById("restaurantCount").value = userNotificationNumber;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}


populateUserInfo();

function editUserInfo() {
    document.getElementById('restaurantCount').disabled = false;
}


function saveUserInfo() {
    //enter code here

    userNotificationNumber = document.getElementById('restaurantCount').value;

    currentUser.update({
        "Notification.Number": userNotificationNumber
    })
        .then(() => {
            console.log("Document successfully updated!");
        })

    document.getElementById('restaurantCount').disabled = true;
}