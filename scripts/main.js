const getRestaurants = () => {
    return [
        { name: "Place 1", link: "#" },
        { name: "Place 2", link: "#" },
        { name: "Place 3", link: "#" },
    ];
};

// modify restaurant data
const modifyRestaurantCard = (restaurant) => {};

// Load restaurant cards
const loadRestaurants = () => {
    const restaurants = getRestaurants();
    console.log(restaurants.length);

    $.get("components/restaurant-card.html", (data) => {
        for (let i = 0; i < restaurants.length; i++) {
            $("#restaurant-list").append($(data).attr("id", `restaurant-${i}`));
            $(`#restaurant-${i} > div h1`).text(restaurants[i].name);
        }
    });
};

loadRestaurants();
