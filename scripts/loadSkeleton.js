// Load reoccuring components in website
// (i.e. header and footer)
const loadSkeleton = () => {
    // add logic as you wish
   $("nav").load("./components/footer.html")
   
   $("footer").load("./components/navbar.html")
}

loadSkeleton();