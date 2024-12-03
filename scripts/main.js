// add restaurant to user list
const addRestaurant = async (userAttributes, alias) => {
    userAttributes.update({
        restaurants: firebase.firestore.FieldValue.arrayUnion(alias),
    });
    console.log(`added ${alias}`);
};

// remove restaurant from user list
const removeRestaurant = async (userAttributes, alias) => {
    userAttributes.update({
        restaurants: firebase.firestore.FieldValue.arrayRemove(alias),
    });
    console.log(`removed ${alias}`);
};

// toggle restaurant from user list
const toggleRestaurant = async (alias) => {
    let user = await firebase.auth().currentUser;
    let userAttributes = db.collection("users").doc(user.uid);
    let userDoc = await userAttributes.get();
    let userRestaurants = userDoc.data().restaurants;

    let toggleBtn = document.querySelector(`#${alias} #toggle-restaurant`);

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

// vancouver coordinates
var latitude = 49.2577062;
var longitude = -123.2063043;

// DEPRECATED: not needed
const toggleLocation = () => {
    let locationBtn = document.querySelector("#toggle-location");

    if (locationBtn.textContent == "Location: Off") {
        locationBtn.textContent = "Location: On";
        console.log("location now on");
        // toggle location true in db
    } else {
        locationBtn.textContent = "Location: Off";
        console.log("location now off");
        // toggle location false in db
    }

    console.log(`lat: ${latitude}, long: ${longitude}`);
};

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
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

const loadUserRestaurants = async () => {
    const apiKey =
        "wu6Nl6r_DN60K_OUcqqQqZ46STMVDHJOqWsmTMLBUN0BO4p5hjxro8ragYxkK1vdhwxFzkOGiG8_-DjZ4k3sd0umkkUPyln6CaSmm28jb1aYtMUINogpYCWFoKQzZ3Yx";
    const selectedRating = localStorage.getItem("selectedRating");
    const restaurantList = document.getElementById("restaurant-list");
    const template = document.getElementById("restaurantCardTemplate");

    let user = await getCurrentUser();
    let userAttributes = db.collection("users").doc(user.uid);
    console.log("userAttributes set");
    let userDoc = await userAttributes.get();
    console.log("userDoc fetched");
    let userRestaurants = userDoc.data().restaurants;

    if (userRestaurants.length == 0) {
        document.querySelector(
            "#restaurant-list"
        ).innerHTML = `<p>No restaurants in list. Add restaurants to see your list.</p>`;
    } else {
        userRestaurants.forEach(async (id) => {
            // lots of api calls
            let response = await fetch(
                `https://api.yelp.com/v3/businesses/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            let business = await response.json();
            const restaurantCard = template.content.cloneNode(true);

            restaurantCard.querySelector("div").id = business.alias;
            restaurantCard.querySelector(".restaurantImg").src =
                business.image_url || "default_image.jpg";
            restaurantCard.querySelector(".restaurantName").textContent =
                business.name;
            restaurantCard.querySelector(".tags").textContent =
                business.categories.map((cat) => cat.title).join(", ");
            restaurantCard.querySelector(
                ".stars"
            ).textContent = `Rating: ${business.rating} (${business.review_count} reviews)`;

            const address = `${business.location.address1}, ${business.location.city}, ${business.location.state} ${business.location.zip_code}`;
            restaurantCard.querySelector(".address").textContent = address;

            const detailButton = restaurantCard.querySelector(".detail-button");
            detailButton.addEventListener("click", () => {
                // 식당의 ID를 쿼리 파라미터로 전달하여 상세 페이지로 이동
                window.location.href = `restaurant.html?id=${encodeURIComponent(
                    business.alias
                )}`;
            });

            restaurantCard
                .querySelector(".toggle-restaurant")
                .addEventListener("click", () => {
                    toggleRestaurant(business.alias);
                });

            if (userRestaurants.includes(business.alias)) {
                restaurantCard.querySelector("#toggle-restaurant").textContent =
                    "Remove from List";
                restaurantCard
                    .querySelector("#toggle-restaurant")
                    .classList.add("to-remove");
                restaurantCard
                    .querySelector("#toggle-restaurant")
                    .classList.remove("toggle-restaurant");
            }

            restaurantList.appendChild(restaurantCard);
        });
    }
};

// load all restaurants in searchQuery
const loadAllRestaurants = async () => {
    const apiKey =
        "wu6Nl6r_DN60K_OUcqqQqZ46STMVDHJOqWsmTMLBUN0BO4p5hjxro8ragYxkK1vdhwxFzkOGiG8_-DjZ4k3sd0umkkUPyln6CaSmm28jb1aYtMUINogpYCWFoKQzZ3Yx";
    const searchQuery = localStorage.getItem("searchQuery");
    const selectedRating = localStorage.getItem("selectedRating");
    const restaurantList = document.getElementById("restaurant-list");
    const template = document.getElementById("restaurantCardTemplate");

    let user = await getCurrentUser();
    let userDoc = await db.collection("users").doc(user.uid).get();
    let userRestaurants = userDoc.data().restaurants;
    let userPreferences = userDoc.data().preferences;

    // add each cuisine preference to categories
    let categoryPreferences = ["restaurants"];
    for (let pref of ["pref1", "pref2", "pref3"]) {
        if (userPreferences[pref]) {
            categoryPreferences.push(userPreferences[pref]);
        }
    }

    // add price preference; take note of start and stop
    let price = "";
    for (let i = 1; i <= userPreferences.budget; i++) {
        price += `&price=${i}`
    }

    if (searchQuery) {
        try {
            let params = new URLSearchParams({
                location: "Vancouver, BC",
                term: encodeURIComponent(searchQuery),
                limit: 10,
                categories: categoryPreferences
            });
            const response = await fetch(
                `https://api.yelp.com/v3/businesses/search?${params}${price}`,
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            restaurantList.innerHTML = "";
            const filteredBusinesses = selectedRating
                ? data.businesses.filter(
                      (business) =>
                          parseFloat(business.rating) >=
                          parseFloat(selectedRating)
                  )
                : data.businesses;

            if (filteredBusinesses.length === 0) {
                restaurantList.innerHTML =
                    "<p>No restaurants match the selected rating.</p>";
                return;
            }

            filteredBusinesses.forEach((business) => {
                const restaurantCard = template.content.cloneNode(true);
                restaurantCard.querySelector("div").id = business.alias;
                restaurantCard.querySelector(".restaurantImg").src =
                    business.image_url || "default_image.jpg";
                restaurantCard.querySelector(".restaurantName").textContent =
                    business.name;
                restaurantCard.querySelector(".tags").textContent =
                    business.categories.map((cat) => cat.title).join(", ");
                restaurantCard.querySelector(
                    ".stars"
                ).textContent = `Rating: ${business.rating} (${business.review_count} reviews)`;

                const address = `${business.location.address1}, ${business.location.city}, ${business.location.state} ${business.location.zip_code}`;
                restaurantCard.querySelector(".address").textContent = address;
                //remove +1 in the number
                let phoneNumber = business.display_phone;
                if (phoneNumber.startsWith("+1 ")) {
                    phoneNumber = phoneNumber.substring(3);
                }
                restaurantCard.querySelector(".phone").textContent =
                    phoneNumber;

                const detailButton =
                    restaurantCard.querySelector(".detail-button");
                detailButton.addEventListener("click", () => {
                    // 식당의 ID를 쿼리 파라미터로 전달하여 상세 페이지로 이동
                    window.location.href = `restaurant.html?id=${encodeURIComponent(
                        business.alias
                    )}`;
                });

                restaurantCard
                    .querySelector(".toggle-restaurant")
                    .addEventListener("click", () => {
                        toggleRestaurant(business.alias);
                    });

                if (userRestaurants.includes(business.alias)) {
                    restaurantCard.querySelector(
                        "#toggle-restaurant"
                    ).textContent = "Remove from List";
                    restaurantCard
                        .querySelector("#toggle-restaurant")
                        .classList.add("to-remove");
                    restaurantCard
                        .querySelector("#toggle-restaurant")
                        .classList.remove("toggle-restaurant");
                }

                restaurantList.appendChild(restaurantCard);
            });
        } catch (error) {
            console.error("Error fetching Yelp data:", error);
            restaurantList.innerHTML = "<p>Failed to load restaurant data.</p>";
        }
    }
};

// toggle between all restaurants and user's restaurants
var isCurrentlyOnAllRestaurants = true;
const toggleRestaurantLists = () => {
    let toggleList = document.querySelector("#toggle-list");
    document.querySelector("#restaurant-list").innerHTML = "";
    if (isCurrentlyOnAllRestaurants) {
        loadUserRestaurants();
        toggleList.textContent = "All";
        isCurrentlyOnAllRestaurants = false;
    } else {
        loadAllRestaurants();
        toggleList.textContent = "My List";
        isCurrentlyOnAllRestaurants = true;
    }
};

// choose a random restaurant
async function chooseRandom() {
    let user = await getCurrentUser();
    let userDoc = await db.collection("users").doc(user.uid).get();
    let restaurants = userDoc.data().restaurants;

    if (restaurants.length === 0) {
        alert("No restaurants available. Please try again later.");
        return;
    }
    const randomRestaurantID =
        restaurants[Math.floor(Math.random() * restaurants.length)];
    window.location.href = `restaurant.html?id=${randomRestaurantID}`;
}

loadAllRestaurants();
