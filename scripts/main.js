const getRestaurants = () => {
    // mock data for restaurants
    return [
        { name: "Place 1", link: "https://maps.app.goo.gl/dTYojLBTX26SXwDX6", tags: [`🦐`, `🥜`, `💲💲`] },
        { name: "Place 2", link: "https://maps.app.goo.gl/jwbqWVMVzmfTbJKo9", tags: [`💲`, `🥬`] },
        { name: "Place 3", link: "https://maps.app.goo.gl/3PmDGDHrGyrHx2w96", tags: [`🤵`, `💵`] },
    ];
};

const modifyRestaurantCard = (data, restaurant, indexInList) => {
    // add restaurant with id `restaurant-${i}`
    $("#restaurant-list").append(
        $(data).attr("id", `restaurant-${indexInList}`)
    );

    // edit header within
    $(`#restaurant-${indexInList} > div h1`).text(restaurant.name);

    // add tags
    $(`#restaurant-${indexInList} > div`).append('<p class="tags"></p>');
    for (let i = 0, item; (item = restaurant.tags[i]); i++) {
        $(`#restaurant-${indexInList} > div .tags`).append(
            `<span class="bg-warning-subtle rounded-2 px-1 py-1 mx-1"> ${item} </span>`
        );
    }

    // add link to restaurant (idk maybe google or restaurant page)
    $(`#restaurant-${indexInList}`).attr("onclick", `window.open("${restaurant.link}")`)
};

// Load restaurant cards
const loadRestaurants = () => {
    const restaurants = getRestaurants();
    console.log(restaurants.length);

    $.get("components/restaurant-card.html", (data) => {
        for (let i = 0; i < restaurants.length; i++) {
            modifyRestaurantCard(data, restaurants[i], i);
        }
    });
};

loadRestaurants();
