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
                    let userCuisine = userDoc.data().preferences.pref1;
                    let userCuisine1 = userDoc.data().preferences.pref2;
                    let userCuisine2 = userDoc.data().preferences.pref3;
                    let userAllergy = userDoc.data().Allergy;
                    let userBudget = userDoc.data().Budget;
                    let userDistance = userDoc.data().Distance;


                    //if the data fields are not empty, then write them in to the form.
                    if (!userCuisine) {
                        document.getElementById("cuisineInput").value = userCuisine;
                    }
                    if (!userCuisine1) {
                        document.getElementById("cuisineInput1").value = userCuisine1;
                    }
                    if (!userCuisine2) {
                        document.getElementById("cuisineInput2").value = userCuisine2;
                    }
                    if (!userAllergy) {
                        document.getElementById("allergyInput").value = userAllergy;
                    }
                    if (!userBudget) {
                        console.log(userBudget)
                        document.querySelector(`#price-${userBudget}`).checked = true;
                    }
                    if (!userDistance) {
                        document.getElementById("distanceInput").value = userDistance;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

//call the function to run it 
populateUserInfo();

function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalcuisine').disabled = false;
    document.getElementById('personalcuisine1').disabled = false;
    document.getElementById('personalcuisine2').disabled = false;
    document.getElementById('personalAllergy').disabled = false;
    document.getElementById('personalBudget').disabled = false;
    document.getElementById('personalDistance').disabled = false;
}


function saveUserInfo() {
    //enter code here

    userCuisine = document.getElementById('cuisineInput').value;
    userCuisine1 = document.getElementById('cuisineInput1').value;
    userCuisine2 = document.getElementById('cuisineInput2').value;
    userAllergy = document.getElementById('allergyInput').value;
    userBudget = document.getElementById('budgetInput').value;
    userDistance = parseInt(document.getElementById('distanceInput').value);

    currentUser.update({
        "preferences.pref1": userCuisine,
        "preferences.pref2": userCuisine1,
        "preferences.pref3": userCuisine2,
        Allergy: userAllergy,
        Budget: userBudget,
        Distance: userDistance
    })
        .then(() => {
            console.log("Document successfully updated!");
        })

    document.getElementById('personalcuisine').disabled = true;
    document.getElementById('personalcuisine1').disabled = true;
    document.getElementById('personalcuisine2').disabled = true;
    document.getElementById('personalAllergy').disabled = true;
    document.getElementById('personalBudget').disabled = true;
    document.getElementById('personalDistance').disabled = true;
}