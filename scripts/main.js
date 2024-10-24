const getRestaurants = () => {
    return [
        { name: "Place 1", link: "#" },
        { name: "Place 2", link: "#" },
        { name: "Place 3", link: "#" },
    ];
};

const modifyRestaurantCard = (restaurant) => {};

// Load restaurant cards
const loadRestaurants = () => {
    const restaurants = getRestaurants();
    console.log(restaurants.length);

    $.get("components/restaurant-card.html", (data) => {
        for (let i = 0; i < restaurants.length; i++) {
            // add restaurant with id `restaurant-${i}`
            $("#restaurant-list").append($(data).attr("id", `restaurant-${i}`));

            // edit header within
            $(`#restaurant-${i} > div h1`).text(restaurants[i].name);
        }
    });
};

loadRestaurants();
