
const findPlaces = async (input, userLocation) => {
    const { Place } = await google.maps.importLibrary("places");
    
    // get db userLocation isOn
    
    const request = {
        textQuery: input,
        fields: ["displayName", "location", "businessStatus"],
        includedType: "restaurant",
        locationBias: userLocation,
        isOpenNow: true,
        language: "en-US",
        maxResultCount: 8,
        minRating: 3.2,
        useStrictTypeFiltering: false,
    };
    
    const { places } = await Place.searchByText(request);
    
    if (places.length) {
        console.log(places);
    }
};

const initSearch = async () => {
    console.log("entered initSearch");
    const { Place } = await google.maps.importLibrary("places");

    var user = firebase.auth().currentUser;
    var allowCurrentLocation;

    db.doc(`users/${user.uid}/preferences/userLocation`).get().then((doc) => {
        allowCurrentLocation = doc.isOn;
    });
    var currentPosition;

    if (allowCurrentLocation && navigator.geolocation) {
        currentPosition = navigator.geolocation.getCurrentPosition;
    }

    document.getElementById("searchSubmit").addEventListener("click", () => {
        findPlaces(document.getElementById("searchBox").value, currentPosition);
    });
};

initSearch();