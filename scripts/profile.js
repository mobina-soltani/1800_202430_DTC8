const loadUserDisplayName = async (userID) => {
    let userDoc = await db.collection("users").doc(userID).get();
    let nameHere = document.getElementById("name-goes-here");
    nameHere.textContent = userDoc.data().name;
};

const loadUserBio = () => {};

const loadRestaurants = async (userID) => {
    let userDoc = await db.collection("users").doc(userID).get();
    let restaurantIDs = userDoc.data().restaurants;
    let template = document.getElementById("restaurant-card");
    let restaurantList = document.getElementById("restaurant-list");

    restaurantIDs.forEach((restaurantID) => {
        let card = template.content.cloneNode(true);
        db.collection("places")
            .doc(restaurantID)
            .get()
            .then((restaurant) => {
                let thisRestaurant = restaurant.data();
                card.querySelector(".restaurant-name").textContent =
                    thisRestaurant.name;
                let restaurantCardElement = card.querySelector(".tags");
                thisRestaurant.tags.forEach((tag) => {
                    restaurantCardElement.innerHTML += `<span class="tag">${tag}</span>`;
                });

                restaurantList.appendChild(card);
            });
    });
};

const loadUserReviews = async (userID) => {
    let userDoc = await db.collection("users").doc(userID).get();
    let reviewIDs = userDoc.data().reviews;
    let template = document.getElementById("review-card");
    let reviewList = document.getElementById("review-list");

    reviewIDs.forEach(async (reviewID) => {
        let card = template.content.cloneNode(true);
        
        let reviewDoc = await db.collection("reviews").doc(reviewID).get()
        let review = reviewDoc.data();
        let restaurantDoc = await db.collection("places").doc(review.restaurantID).get();
        let restaurant = restaurantDoc.data();

        card.querySelector(".restaurant-name").textContent = restaurant.name;
        card.querySelector(".number-of-stars").textContent = `${review.stars} ⭐`;
        card.querySelector(".description").textContent = review.description;

        reviewList.appendChild(card)
    });
};

const doAll = async () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            let userID = user.uid;
            console.log(`userID: ${userID}`);
            loadUserDisplayName(userID);
            loadRestaurants(userID);
            loadUserBio(userID);
            loadUserReviews(userID);
        }
    });
};

doAll();
