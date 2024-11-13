const loadUserDisplayName = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            db.collection("users")
                .doc(user.uid)
                .get()
                .then((userDoc) => {
                    let nameHere = document.getElementById("name-goes-here");
                    nameHere.textContent = userDoc.data().name;
                });
        }
    });
};

const loadUserBio = () => {};

const loadUserReviews = () => {};

const doAll = () => {
    loadUserDisplayName();
    loadUserBio();
    loadUserReviews();
};

window.onload = doAll;
