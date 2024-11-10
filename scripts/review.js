// Select all elements with the class name "star" and store them in the "stars" variable
var stars = document.querySelectorAll(".star");

// Iterate through each star element
stars.forEach((star, index) => {
    // Add a click event listener to the current star
    star.addEventListener("click", () => {
        // Fill in clicked star and stars before it
        for (let i = 1; i <= index+1; i++) {
            // Change the text content of stars to 'star' (filled)
            document.getElementById(`star${i}`).textContent = "star";
        }
        for (let i=index+2; i <= stars.length; i++) {
            document.getElementById(`star${i}`).textContent = "star_outline";
        }
    });
});