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

            document.getElementById("restaurantName").innerText =
                thisRestaurant.name;
            tags = thisRestaurant.tags;
            tagsBuffer = "";
            tags.forEach((tag) => {
                tagsBuffer += `<span class="bg-warning-subtle rounded-2 px-1 py-1 mx-1"> ${tag} </span>`;
            });
            document.getElementById("tags").innerHTML = tagsBuffer;
            document.getElementById(
                "stars"
            ).innerHTML = `${thisRestaurant.stars} ⭐`;
        });

        document.getElementById("review-link").href = `review.html?restaurantID=${restaurantID}`
};

// display restaurant reviews
const getRestaurantReviews = () => {
    let params = new URL(window.location.href);
    let restaurantID = params.searchParams.get("restaurantID");

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

getRestaurantInfo();
getRestaurantReviews();
