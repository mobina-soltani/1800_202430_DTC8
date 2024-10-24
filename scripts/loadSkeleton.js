// Load reoccuring components in website
// (i.e. header and footer)
const loadSkeleton = () => {
    // add logic as you wish
    $("nav").load("./components/navbar.html");

    $("footer").load("./components/footer.html");
};

loadSkeleton();
