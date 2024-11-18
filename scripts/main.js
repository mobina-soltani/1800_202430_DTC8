const loadRestaurant = (restaurantID) => {
    db.collection(`places`)
        .doc(restaurantID)
        .get()
        .then((restaurantDoc) => {
            if (restaurantDoc.exists) {
                // get template from main
                let cardTemplate = document.getElementById(
                    "restaurantCardTemplate"
                );

                // get restaurant document data
                var restaurantData = restaurantDoc.data();
                var name = restaurantData.name;
                var tags = restaurantData.tags;
                var stars = restaurantData.stars;

                let newCard = cardTemplate.content.cloneNode(true);

                // modify template
                newCard.querySelector(".restaurantName").innerHTML = name;
                newCard.querySelector(
                    ".stars"
                ).innerHTML = `<p class="bg-warning-subtle rounded-2 px-1 py-1 mx-1">${
                    stars ? stars : "unrated"
                } ⭐</p>`;
                var tagsBuffer = "";
                tags.forEach((tag) => {
                    tagsBuffer += `<span class="bg-warning-subtle rounded-2 px-1 py-1 mx-1"> ${tag} </span>`;
                });
                newCard.querySelector(".tags").innerHTML = tagsBuffer;
                newCard.querySelector("img").src =
                    "https://picsum.photos/id/1/200/200";

                // add onclick behaviour
                // newCard.querySelector("div.main").onclick = () => {
                //     window.location.href = `restaurant.html?restaurantID=${restaurantID}`;
                // };

                document.getElementById("restaurant-list").appendChild(newCard);
            }
        });
};

// Load restaurant cards
const loadRestaurants = (userID) => {
    db.collection(`users`)
        .doc(userID)
        .get()
        .then((user) => {
            user.data().restaurants.forEach((restaurantID) => {
                loadRestaurant(restaurantID);
            });
        });
};

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};

// const chooseRandom = () => {
//     let uid = firebase.auth().currentUser.uid;
//     db.collection("users")
//         .doc(uid)
//         .get()
//         .then((doc) => {
//             let restaurants = doc.data().restaurants;
//             window.location.href = `restaurant.html?restaurantID=${restaurants[getRandomInt(restaurants.length)]
//                 }`;
//         });
// };

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        loadRestaurants(user.uid);
    } else {
        console.log("No user is logged in.");
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    const apiKey =
        "wu6Nl6r_DN60K_OUcqqQqZ46STMVDHJOqWsmTMLBUN0BO4p5hjxro8ragYxkK1vdhwxFzkOGiG8_-DjZ4k3sd0umkkUPyln6CaSmm28jb1aYtMUINogpYCWFoKQzZ3Yx";
    const searchQuery = localStorage.getItem("searchQuery");
    const selectedRating = localStorage.getItem("selectedRating");
    const restaurantList = document.getElementById("restaurant-list");
    const template = document.getElementById("restaurantCardTemplate");

    if (searchQuery) {
        try {
            let params = new URLSearchParams({
                location: "Vancouver, BC",
                term: encodeURIComponent(searchQuery),
                limit: 20,
                categories: "restaurants",
            });
            const response = await fetch(
                `https://api.yelp.com/v3/businesses/search?${params}`,
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();
            console.log(data);

            restaurantList.innerHTML = "";
            const filteredBusinesses = selectedRating
                ? data.businesses.filter((business) => parseFloat(business.rating) >= parseFloat(selectedRating))
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

                const detailButton =
                    restaurantCard.querySelector(".detail-button");
                detailButton.addEventListener("click", () => {
                    // 식당의 ID를 쿼리 파라미터로 전달하여 상세 페이지로 이동
                    window.location.href = `restaurant-detail.html?id=${encodeURIComponent(
                        business.id
                    )}`;
                });

                restaurantList.appendChild(restaurantCard);
            });
        } catch (error) {
            console.error("Error fetching Yelp data:", error);
            restaurantList.innerHTML = "<p>Failed to load restaurant data.</p>";
        }
    }
});

const apiKey =
    "wu6Nl6r_DN60K_OUcqqQqZ46STMVDHJOqWsmTMLBUN0BO4p5hjxro8ragYxkK1vdhwxFzkOGiG8_-DjZ4k3sd0umkkUPyln6CaSmm28jb1aYtMUINogpYCWFoKQzZ3Yx";

async function fetchRestaurants() {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const yelpApiUrl = `${proxyUrl}https://api.yelp.com/v3/businesses/search?location=San+Francisco&categories=restaurants&limit=20`;

    try {
        const response = await fetch(yelpApiUrl, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch restaurants from Yelp API.");
        }

        const data = await response.json();
        return data.businesses;
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        return [];
    }
}

async function chooseRandom() {
    const restaurants = await fetchRestaurants();

    if (restaurants.length === 0) {
        alert("No restaurants available. Please try again later.");
        return;
    }
    const randomRestaurant =
        restaurants[Math.floor(Math.random() * restaurants.length)];
    const restaurantId = randomRestaurant.id;
    window.location.href = `restaurant-detail.html?id=${restaurantId}`;
}
