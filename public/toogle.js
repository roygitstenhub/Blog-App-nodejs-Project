let hamburger = document.getElementsByClassName('hamburger')[0]
let navMenu = document.getElementsByClassName('nav-links')[0]

hamburger.addEventListener("click",()=>{
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
})