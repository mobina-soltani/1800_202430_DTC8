// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.

            var user = authResult.user;
            console.log(authResult.additionalUserinfo);

            if (authResult.additionalUserInfo.isNewUser) {
                db.collection("users")
                    .doc(user.uid)
                    .set({ // add default user configurations
                        name: user.displayName,
                        email: user.email,
                        preferences: {
                            pref1: "",
                            pref2: "",
                            pref3: "",
                            budget: 1
                        },
                        friends: [],
                        restaurants: [],
                        reviews: [],
                        Notification: {
                            Number: ""
                        }
                    })
                    .then(() => {
                        console.log("New user added.");
                        window.location.assign("main.html");
                    })
                    .catch((error) => {
                        console.log(`Error adding new user: ${error}`);
                    });
            } else {
                return true;
            }
            return false;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById("loader").style.display = "none";
        },
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: "popup",
    signInSuccessUrl: "main.html",
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: "<your-tos-url>",
    // Privacy policy url.
    privacyPolicyUrl: "<your-privacy-policy-url>",
};
ui.start("#firebaseui-auth-container", uiConfig);
