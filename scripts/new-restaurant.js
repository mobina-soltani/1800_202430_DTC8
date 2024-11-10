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
        (gmapsLinkField.startsWith("https://maps.google.com") ||
            gmapsLinkField.startsWith("https://maps.app.goo.gl") ||
            gmapsLinkField.startsWith("https://google.com/maps")) &&
        gmapsLinkField.slice(23).length > 0
    );
};

const writeRestaurant = () => {
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

    if (restaurantSearchParam) {
        /*         db.collection("places")
            .where("name", ">=", restaurantSearchParam)
            .get()
            .then((docs) => {
                docs.forEach((doc) => {
                    console.log(doc.data());
                });
            }); */

        db.collection("places")
            .add(
                {
                    name: restaurantSearchParam,
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
                            restaurants: firebase.firestore.FieldValue.arrayUnion(restDoc.id)
                        })
                }
            })
            .catch((error) => {
                `error adding ${restaurantSearchParam}: ${error}`;
            });
    }
};
