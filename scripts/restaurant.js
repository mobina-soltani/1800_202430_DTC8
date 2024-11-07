// display restaurant info
const getRestaurantInfo = () => {
    // get current url
    let params = new URL(window.location.href);
    let restaurantID = params.searchParams.get("restaurantID");

    db.collection("places")
        .doc(restaurantID)
        .get()
        .then((restaurantDoc) => {
            thisRestaurant = restaurantDoc.data();

            document.getElementById("restaurantName").innerText = thisRestaurant.name;
            tags = thisRestaurant.tags
            tagsBuffer = "";
            tags.forEach((tag) => {
                tagsBuffer += `<span class="bg-warning-subtle rounded-2 px-1 py-1 mx-1"> ${tag} </span>`;
            });
            document.getElementById("tags").innerHTML = tagsBuffer;
            document.getElementById("stars").innerHTML = `${thisRestaurant.stars} ⭐`;
        });
};

// display restaurant reviews
const getRestaurantReviews = () => {
    
}

getRestaurantInfo();
