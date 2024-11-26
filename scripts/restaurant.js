// display restaurant info
const getRestaurantInfo = async () => {
    // get current url
    let params = new URL(window.location.href);
    let id = params.searchParams.get("id");
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

    console.log(data);
    let banner = document.querySelector("#banner");
    banner.querySelector("#restaurant-img").src = data.image_url;
    banner.querySelector("#restaurant-name").textContent = data.name;
    banner.querySelector(
        "#stars"
    ).textContent = `${data.rating} ⭐ ${data.review_count}`;
    banner.querySelector("#redirect-to-yelp").href = data.url;

    // check if restaurant in user's list
    let user = await getCurrentUser();
    let userDoc = await db.collection("users").doc(user.uid).get();
    let restaurants = userDoc.data().restaurants;

    let toggleBtn = banner.querySelector("#toggle-restaurant");

    if (restaurants.includes(id)) {
        toggleBtn.classList.remove("toggle-restaurant");
        toggleBtn.classList.add("to-remove");
        toggleBtn.textContent = "Remove from List";
    }

    banner.querySelector("#toggle-restaurant").addEventListener("click",
        () => {toggleRestaurant(id)}
    )

    banner.querySelector("#review-link").href = `review.html?restaurantID=${id}&restaurantName=${data.name}`

    // send name to localStorage to save api call
    localStorage.setItem("restaurantName", data.name)
};

// add restaurant to user list
const addRestaurant = async (userAttributes, alias) => {
    userAttributes.update({
        restaurants: firebase.firestore.FieldValue.arrayUnion(alias),
    });
    console.log(`added ${alias}`)
};

// remove restaurant from user list
const removeRestaurant = async (userAttributes, alias) => {
    userAttributes.update({
        restaurants: firebase.firestore.FieldValue.arrayRemove(alias),
    });
    console.log(`removed ${alias}`)
};

// toggle restaurant from user list
const toggleRestaurant = async (alias) => {
    let user = await firebase.auth().currentUser;
    let userAttributes = db.collection("users").doc(user.uid);
    let userDoc = await userAttributes.get();
    let userRestaurants = userDoc.data().restaurants;

    let toggleBtn = document.querySelector(`#toggle-restaurant`);

    if (!userRestaurants.includes(alias)) {
        addRestaurant(userAttributes, alias);
        // toggle button to "remove from list"
        toggleBtn.textContent = "Remove from List";
        toggleBtn.classList.remove("toggle-restaurant");
        toggleBtn.classList.add("to-remove");
    } else {
        removeRestaurant(userAttributes, alias);
        // toggle button to "add to list"
        toggleBtn.textContent = "Add to List";
        toggleBtn.classList.remove("to-remove");
        toggleBtn.classList.add("toggle-restaurant");
    }

    userDoc = await userAttributes.get();
    userRestaurants = userDoc.data().restaurants;
    console.log(userRestaurants);
};

// display restaurant reviews
const getRestaurantReviews = () => {
    let params = new URL(window.location.href);
    let restaurantID = params.searchParams.get("id");

    db.collection("reviews")
        .where("restaurantID", "==", restaurantID)
        .get()
        .then((allReviews) => {
            var reviews = allReviews.docs;

            // iterate through all the reviews
            reviews.forEach((doc) => {
                var review = doc.data();
                var userID = review.reviewerID;

                // get the user ID
                // i hate this
                db.collection(`users`)
                    .doc(userID)
                    .get()
                    .then((user) => {
                        let reviewCardTemplate =
                            document.getElementById("reviewCardTemplate");
                        let reviewGroup =
                            document.getElementById("review-list");
                        var description = review.description;
                        var stars = review.stars;

                        // modify reviewCard
                        var reviewCard =
                            reviewCardTemplate.content.cloneNode(true);
                        reviewCard.querySelector(
                            ".reviewDescription"
                        ).innerText = description;
                        reviewCard.querySelector(
                            ".reviewStars"
                        ).innerText = `${stars} ⭐`;

                        reviewCard.querySelector(".author").innerText =
                            user.data().name;
                        reviewGroup.appendChild(reviewCard);
                    });
            });
        });
};

// from: https://github.com/firebase/firebase-js-sdk/issues/462#issuecomment-425479634
let userLoaded = false;
function getCurrentUser() {
    return new Promise((resolve, reject) => {
        if (userLoaded) {
            resolve(firebase.auth().currentUser);
        }
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            userLoaded = true;
            unsubscribe();
            resolve(user);
        }, reject);
    });
}

getRestaurantInfo();
getRestaurantReviews();
