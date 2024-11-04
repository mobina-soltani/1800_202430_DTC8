function logout() {
    firebase.auth().signOut().then(() => { // sign out of firebase
        console.log("logging out user");
    }).catch((error) => {
        console.log(`Unable to logout: ${error}`)
    });
}