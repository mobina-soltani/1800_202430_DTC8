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

    let priceRangeSelectedID = document.querySelector(
        'input[name="price"]:checked'
    ).id;

    let priceRangeSelectedTag = document.querySelector(
        `label[for=\"${priceRangeSelectedID}\"]`
    ).innerText;

    var allergyTags = [];

    document.querySelectorAll(`#allergies input:checked`).forEach((allergy) => {
        allergyTags.push(
            document
                .querySelector(`label[for=${allergy.id}]`)
                .innerText.slice(0, 2)
        );
    });

    var cuisineTags = [];

    document.querySelectorAll(`#cuisine input:checked`).forEach((cuisine) => {
        cuisineTags.push(
            document
                .querySelector(`label[for=${cuisine.id}]`)
                .innerText
        );
    });

    console.log(cuisineTags)

    if (restaurantSearchParam) {
        db.collection("places")
            .where("name", ">=", restaurantSearchParam)
            .get()
            .then((docs) => {
                docs.forEach((doc) => {
                    console.log(doc.data());
                });
            });
    }
};
