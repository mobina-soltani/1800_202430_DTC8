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
                ).innerHTML = `<p class="bg-warning-subtle rounded-2 px-1 py-1 mx-1">${stars} ⭐</p>`;
                var tagsBuffer = "";
                tags.forEach((tag) => {
                    tagsBuffer += `<span class="bg-warning-subtle rounded-2 px-1 py-1 mx-1"> ${tag} </span>`;
                });
                newCard.querySelector(".tags").innerHTML = tagsBuffer;
                newCard.querySelector("img").src =
                    "https://picsum.photos/id/1/200/200";

                // add onclick behaviour
                newCard.querySelector("div.main").onclick = () => {
                    window.location.href = `restaurant.html?restaurantID=${restaurantID}`;
                };

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

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        loadRestaurants(user.uid);
    } else {
        console.log("No user is logged in.");
    }
});
