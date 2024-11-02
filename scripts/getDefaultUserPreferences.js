const budget = {
    "index": 0,
    "weight": 1.0
}

const userLocation = {
    "isOn": false,
    "radiusKM": 0, // kilometres, only matters if isOn
    "homeCity": "vancouver",
    "weight": 1.0
}

const allergyPreferences = {
    "allergies": [],
    "weight": 0.5 // should this be changed?
    // i guess it would depending on how severe the allergies would be
}

const getDefaultUserPreferences = () => {
    return {
        "budget": budget,
        "userLocation": userLocation,
        "allergyPreferences": allergyPreferences,
    }
}