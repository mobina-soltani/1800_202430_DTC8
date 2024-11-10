const clearRestaurant = () => {
    if (window.confirm("Press OK to clear all fields")) {
        document.querySelectorAll('input[type="text"]').forEach((input) => {
            input.value = "";
        });

        document.querySelector("input#cheap").checked = true;

        document
            .querySelectorAll('input[type="checkbox"]')
            .forEach((checkbox) => {
                checkbox.checked = false;
            });
    }
};

const isRestaurantValid = () => {
    return document.querySelector("input#restaurant-name").value.length > 0;
};

const isMapsLinkValid = () => {
    let gmapsLinkField = document.querySelector("input#gmaps-link").value;
    return (
        ((gmapsLinkField.startsWith("https://maps.google.com") ||
            gmapsLinkField.startsWith("https://maps.app.goo.gl") ||
            gmapsLinkField.startsWith("https://google.com/maps")) &&
            gmapsLinkField.slice(23).length > 0) ||
        !gmapsLinkField
    );
};

const displaySimilarRestaurants = (restaurantRef) => {
    let restaurantTemplate = document.getElementById(
        "similar-restaurant-template"
    );
    let similarRestaurants = document.getElementById("similars");
    var displayStatus = similarRestaurants.className;

    if (displayStatus == "d-none") {
        similarRestaurants.className = "";
    }

    restaurantRef
        .then((docs) => {
            docs.forEach((doc) => {
                let restaurant = doc.data();
                let restaurantCard = restaurantTemplate.content.cloneNode(true);

                restaurantCard.querySelector(".restaurant-name").innerText =
                    restaurant.name;
                restaurant.tags.forEach((tag) => {
                    restaurantCard.querySelector(
                        ".tags-here"
                    ).innerHTML += `<span>${tag}</span>`;
                });

                similarRestaurants.appendChild(restaurantCard);
            });
        })
        .then(() => {
            if (document.querySelectorAll("#similars .restaurant-name").length == 0) {
                similarRestaurants.className = "d-none";
            }
        });
};

const addRestaurant = (
    restaurantSearchParam,
    cuisineTags,
    allTags,
    gMapsText
) => {
    db.collection("places")
        .add(
            {
                name: restaurantSearchParam.toLowerCase(),
                cuisines: cuisineTags,
                tags: allTags,
                gMapsLink: gMapsText,
            },
            { merge: true }
        )
        .then((restDoc) => {
            console.log(`added ${restaurantSearchParam}`);

            let currentUser = firebase.auth().currentUser;
            if (currentUser) {
                // add restaurants to user's personal list;
                db.collection("users")
                    .doc(currentUser.uid)
                    .update({
                        restaurants: firebase.firestore.FieldValue.arrayUnion(
                            restDoc.id
                        ),
                    });
            }
        })
        .then(() => {
            window.location = "main.html";
        })
        .catch((error) => {
            `error adding ${restaurantSearchParam}: ${error}`;
        });
};

const validateRestaurant = () => {
    let restaurantSearchParam =
        document.getElementById("restaurant-name").value;
    var restaurantRef = db
        .collection("places")
        .where("name", ">=", restaurantSearchParam)
        .where("name", "<=", restaurantSearchParam + "\uf8ff")
        .get();

    document
        .querySelectorAll("#similars .similar-restaurant")
        .forEach((card) => {
            card.remove();
        });

    if (restaurantSearchParam && restaurantRef) {
        displaySimilarRestaurants(restaurantRef);
        document.getElementById("submit").disabled = false;
        return true;
    } else {
        document.getElementById("similars").className = "d-none";
        document.getElementById("submit").disabled = true;
        return false;
    }
};

const validateAll = () => {
    let restaurantField = document.getElementById("restaurant-name");
    let mapsField = document.getElementById("gmaps-link");

    let isRestaurantValid = validateRestaurant();
    let isMapsValid = isMapsLinkValid();

    if (isRestaurantValid) {
        restaurantField.classList.add("border-success");
    } else {
        restaurantField.classList.remove("border-success");
        restaurantField.classList.add("border-danger");
    }

    if (isMapsValid) {
        mapsField.classList.add("border-success");
    } else {
        mapsField.classList.remove("border-success");
        mapsField.classList.add("border-danger");
    }

    if (!(isMapsValid && isRestaurantValid)) {
        document.getElementById("submit").disabled = true;
    }
};

const writeRestaurant = () => {
    // get elements with important values
    let restaurantSearchParam = document.querySelector(
        "input#restaurant-name"
    ).value;

    let gMapsText = document.querySelector("input#gmaps-link").value;

    let priceRangeSelectedID = document.querySelector(
        'input[name="price"]:checked'
    ).id;

    let priceRangeSelectedTag = document.querySelector(
        `label[for=\"${priceRangeSelectedID}\"]`
    ).innerText;

    // generate allergy tags
    var allergyTags = [];
    document.querySelectorAll(`#allergies input:checked`).forEach((allergy) => {
        allergyTags.push(
            document
                .querySelector(`label[for=${allergy.id}]`)
                .innerText.slice(0, 2)
        );
    });

    // generate cuisine tags
    var cuisineTags = [];
    document.querySelectorAll(`#cuisine input:checked`).forEach((cuisine) => {
        cuisineTags.push(
            document.querySelector(`label[for=${cuisine.id}]`).innerText
        );
    });

    // insert price range tags
    let allTags = Array.from(allergyTags);
    allTags.unshift(priceRangeSelectedTag);
    console.log(allTags);

    if (validateRestaurant() && isMapsLinkValid()) {
        addRestaurant(restaurantSearchParam, cuisineTags, allTags, gMapsText);
    }
};

document
    .getElementById("restaurant-name")
    .addEventListener("change", validateRestaurant);
