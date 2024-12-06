const loadUserDisplayName = async (userID) => {
    let userDoc = await db.collection("users").doc(userID).get();
    let nameHere = document.getElementById("name-goes-here");
    nameHere.textContent = userDoc.data().name;
};

const getRestaurantInfo = async (id) => {
    // get current url
    const apiKey =
        "wu6Nl6r_DN60K_OUcqqQqZ46STMVDHJOqWsmTMLBUN0BO4p5hjxro8ragYxkK1vdhwxFzkOGiG8_-DjZ4k3sd0umkkUPyln6CaSmm28jb1aYtMUINogpYCWFoKQzZ3Yx";

    var data;
    try {
        const response = await fetch(
            `https://api.yelp.com/v3/businesses/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            }
        );

        data = await response.json();
    } catch (error) {
        console.log(error);
    }

    return data;
};

const loadRestaurants = async (userID) => {
    let userDoc = await db.collection("users").doc(userID).get();
    let restaurantIDs = userDoc.data().restaurants;
    let template = document.getElementById("restaurant-card");
    let restaurantList = document.getElementById("restaurant-list");

    restaurantIDs.forEach(async (restaurantID) => {
        let card = template.content.cloneNode(true);
        let restaurantInfo = await getRestaurantInfo(restaurantID);

        card.querySelector(".restaurant-name").textContent =
            restaurantInfo.name;
        card.querySelector(
            ".restaurant-rating"
        ).textContent = `${restaurantInfo.rating} ⭐`;

        card.querySelector("button").addEventListener("click", () => {
            window.location.href = `../restaurant.html?id=${restaurantID}`;
        });

        restaurantList.appendChild(card);
    });
};

const loadUserReviews = async (userID) => {
    let userDoc = await db.collection("users").doc(userID).get();
    let reviewIDs = userDoc.data().reviews;
    let template = document.getElementById("review-card");
    let reviewList = document.getElementById("review-list");

    reviewIDs.forEach(async (reviewID) => {
        let reviewDoc = await db.collection("reviews").doc(reviewID).get();
        let reviewInfo = reviewDoc.data();
        let card = template.content.cloneNode(true);

        card.querySelector("div").id = reviewID;
        card.querySelector(
            ".restaurant-name"
        ).textContent = `${reviewInfo.restaurantName} (${reviewInfo.stars} ⭐)`;
        card.querySelector(".description").textContent = reviewInfo.description;

        card.querySelector("#remove-review").addEventListener("click", () => {
            deleteReview(reviewID, userID);
        });

        card.querySelector("#see-review").addEventListener("click", () => {
            window.location.href = `./restaurant.html?id=${reviewInfo.restaurantID}`;
        });

        card.querySelector("#edit-review").addEventListener("click", () => {
            localStorage.setItem("reviewID", reviewID);
            window.location.href = `./review.html?restaurantID=${
                reviewInfo.restaurantID
            }&restaurantName=${encodeURIComponent(reviewInfo.restaurantName)}`;
        });

        reviewList.appendChild(card);
    });
};

const deleteReview = async (reviewID, userID) => {
    try {
        document.getElementById(reviewID).className = "d-none"
        await db.collection("users").doc(userID).update({
            reviews: firebase.firestore.FieldValue.arrayRemove(reviewID)
        });
        await db.collection("reviews").doc(reviewID).delete();
        console.log(`${reviewID} deleted!`);
    } catch (e) {
        console.log(e);
    }
};

const doAll = async () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            let userID = user.uid;
            console.log(`userID: ${userID}`);
            loadUserDisplayName(userID);
            loadRestaurants(userID);
            loadUserReviews(userID);
        }
    });
};

doAll();
