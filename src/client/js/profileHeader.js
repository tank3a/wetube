const profileLogo = document.querySelector(".user_box__logo");
const profileMenu = document.querySelector(".user_box__loggedInMenu");

const handleProfileClick = () => {
    profileMenu.classList.toggle("showing");
}

profileLogo.addEventListener("click", handleProfileClick);