const params = new URL(window.location.href).searchParams;
const restaurantID = params.get("restaurantID");
const reviewID = params.get("userID");

// Select all elements with the class name "star" and store them in the "stars" variable
var stars = document.querySelectorAll(".star");

const displayRestaurantName = (restaurantID) => {
    document.getElementById("restaurant-name-here").textContent =
        localStorage.getItem("restaurantName");
};

// Iterate through each star element
stars.forEach((star, index) => {
    // Add a click event listener to the current star
    star.addEventListener("click", () => {
        // Fill in clicked star and stars before it
        for (let i = 1; i <= index + 1; i++) {
            // Change the text content of stars to 'star' (filled)
            document.getElementById(`star${i}`).textContent = "star";
        }
        for (let i = index + 2; i <= stars.length; i++) {
            document.getElementById(`star${i}`).textContent = "star_outline";
        }
    });
});

const writeReview = () => {
    let rating = 0;
    stars.forEach((star) => {
        // Check if the text content of the current 'star' element is equal to the string 'star'
        if (star.textContent === "star") {
            rating++;
        }
    });

    let description = document.getElementById("description").value;
    let user = firebase.auth().currentUser;
    let uid = user !== null ? user.uid : "";

    if (reviewID) {
        // for editing in the future
    } else {
        console.log(rating, restaurantID, uid);
        db.collection("reviews")
            .add({
                restaurantID: restaurantID,
                reviewerID: uid,
                stars: rating,
                description: description,
            })
            .then((review) => {
                // add to reviews on user page
                db.collection("users")
                    .doc(uid)
                    .update({
                        reviews: firebase.firestore.FieldValue.arrayUnion(
                            review.id
                        ),
                    });

                window.location.href = `../restaurant.html?id=${restaurantID}`;
            });
    }
};

const clearFields = () => {
    if (window.confirm("Press OK to clear all fields")) {
        document.getElementById("description").value = "";

        stars.forEach((star) => {
            star.textContent = "star_outline";
        });
    }
};

displayRestaurantName(restaurantID);
