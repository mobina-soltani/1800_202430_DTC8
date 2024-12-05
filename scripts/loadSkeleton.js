// Load reoccuring components in website
// (i.e. header and footer)
const loadSkeleton = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // If the "user" variable is not null, then someone is logged in
            // User is signed in.
            // Do something for the user here.
            console.log("logged in.")
            console.log(window.location.href)
            if (window.location.href.endsWith("main.html")) {
                console.log($("#main-header").load("./components/header_after.html"));
                console.log($("footer").load("./components/footer_after.html"));
            } else {
                console.log($("#main-header").load("./components/header_non_main.html"));
                console.log($("footer").load("./components/footer_after.html"));
            }

            console.log("loaded header and footer")
        } else {
            // No user is signed in.
            console.log("not logged in.")
            console.log($("header").load("./components/header_before.html"));
            console.log($("footer").load("./components/footer_before.html"));
        }
    });
};

loadSkeleton();
