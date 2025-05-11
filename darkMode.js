// check for saved 'darkMode' in localStorage
let darkMode = localStorage.getItem('darkMode');

const darkModeToggle = document.querySelector('#dark-mode-toggle');

const enableDarkMode = () => {
    // 1. Add the class to the body
    document.body.classList.add('darkmode');
    // 2. Update darkMode in localStorage
    localStorage.setItem('darkMode', 'enabled');
    $("#tablerows").addClass(" text-white");
    $("#cardhead").addClass(" text-white");
    $("#nav").addClass(" text-white");
    $(" #nav1").addClass(" text-white");
    $("#nav2").addClass(" text-white");
    $("#nav3").addClass(" text-white");
}

const disableDarkMode = () => {
    // 1. Remove the class from the body
    document.body.classList.remove('darkmode');
    // 2. Update darkMode in localStorage 
    localStorage.setItem('darkMode', null);
    $("#tablerows").removeClass(" text-white");
    $("#cardhead").removeClass(" text-white");
    $("#nav").removeClass(" text-white");
    $("#nav1").removeClass(" text-white");
    $("#nav2").removeClass(" text-white");
    $("#nav3").removeClass(" text-white");
}

// If the user already visited and enabled darkMode
// start things off with it on
if (darkMode === 'enabled') {
    enableDarkMode();
}

// When someone clicks the button
darkModeToggle.addEventListener('click', () => {
    // get their darkMode setting
    darkMode = localStorage.getItem('darkMode');

    // if it not current enabled, enable it
    if (darkMode !== 'enabled') {
        enableDarkMode();
        // if it has been enabled, turn it off  
    } else {
        disableDarkMode();
    }
});
