// Load reoccuring components in website
// (i.e. header and footer)
const loadSkeleton = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // If the "user" variable is not null, then someone is logged in
            // User is signed in.
            // Do something for the user here.
            console.log("logged in.")
            console.log($("header").load("./components/header_after.html"));
        } else {
            // No user is signed in.
            console.log("not logged in.")
            console.log($("header").load("./components/header_before.html"));
        }
    });
    // add logic as you wish
    console.log($("footer").load("./components/footer.html"));
};

loadSkeleton();
