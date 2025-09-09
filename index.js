import { vinylCatalog } from "./data.js"

const albumsContainer = document.getElementById("albums-container")

const itemsList = document.getElementById("item-list")
const checkoutContainer = document.querySelector(".checkout-container")
const completeOrderBtn = document.querySelector(".complete-order-btn")

const modal = document.getElementById("modal")
const modalCloseBtn = document.getElementById("modal-close-btn")
const consentForm = document.getElementById("consent-form")

let checkoutItems = []


albumsContainer.addEventListener("click", (e) =>{
    if(modal.classList.contains("hidden")){
        if(e.target.classList.contains("add-to-cart-btn")){
            const albumId = e.target.dataset.albumId
            handleAddClick(albumId)
        }
    }
})
itemsList.addEventListener("click", (e) => { 
    if (e.target.classList.contains("remove-btn")) {
        const albumId = e.target.dataset.albumId
        handleRemoveClick(albumId)
    }
})
completeOrderBtn.addEventListener("click", () => {
    modal.classList.remove("hidden")
})


modalCloseBtn.addEventListener("click", () => {
    consentForm.reset()
    modal.classList.add("hidden")
})
consentForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const customerName = document.getElementById("name").value

    modal.classList.add("hidden")

    checkoutContainer.innerHTML = `
        <div class="thank-you-message">
            <h2>Thanks, ${customerName}! Your order is on the way!</h2>

            <div class="rating-container">
                <p>How was your experience?</p>
                <div class="star-rating">
                    <span class="star" data-rating="1">&#9733;</span>
                    <span class="star" data-rating="2">&#9733;</span>
                    <span class="star" data-rating="3">&#9733;</span>
                    <span class="star" data-rating="4">&#9733;</span>
                    <span class="star" data-rating="5">&#9733;</span>
                </div>
            </div>
        </div>
    `;

    const starRatingContainer = document.querySelector(".star-rating");
    if (starRatingContainer) {
        starRatingContainer.addEventListener("click", (event) => {
            const selectedStar = event.target.closest(".star")
            if (selectedStar) {
                const rating = parseInt(selectedStar.dataset.rating)
                const stars = starRatingContainer.querySelectorAll(".star")
                
                stars.forEach(star => {
                    if (parseInt(star.dataset.rating) <= rating) {
                        star.classList.add("filled")
                    } else {
                        star.classList.remove("filled")
                    }
                });
            }
        });
    }

    checkoutItems = []
    consentForm.reset()
});

function handleAddClick(albumId){
    const albumToAdd = vinylCatalog.find(album => album.id == albumId)
    if(albumToAdd){
        checkoutItems.push(albumToAdd)
        renderCheckout()
    }
}

function handleRemoveClick(albumId) {
    const itemIndex = checkoutItems.findIndex(item => item.id == albumId)
    if (itemIndex > -1) {
        checkoutItems.splice(itemIndex, 1)
        renderCheckout()
    }
}

function getAlbumHtml(albums){
    const htmlAlbums = albums.map((album)=>{
        const {albumTitle, id, artist, price, albumCover} = album
        return `
            <div class="album-card">
                <div class="album-info-wrapper">
                    <div class="album-image-container">
                        <img class="album-cover" src="${albumCover}"/>
                    </div>
                    <div class="album-details-container">
                        <h3 class="album-title">${albumTitle}</h3>
                        <p class="album-artist">${artist}</p>
                        <p class="album-price">$${price}</p>
                    </div>
                </div>
                <div class="add-to-cart-btn-wrapper">
                    <button class="add-to-cart-btn" data-album-id="${id}">+</button>
                </div>
            </div>
        `
    }).join('')
    return htmlAlbums
}


function renderCheckout() {
    let totalPrice = 0

    if (checkoutItems.length > 0) {
        checkoutContainer.classList.remove("hidden")
    }
    else{
        checkoutContainer.classList.add("hidden")
    }
    const checkoutHtml = checkoutItems.map(item => {
        totalPrice += item.price
        return `
            <div class="checkout-row checkout-item">
                <div class="checkout-item-details">
                    <p class="checkout-item-title">${item.albumTitle}</p>
                    <button class="remove-btn" data-album-id="${item.id}">remove</button>
                </div>
                <p class="checkout-item-price">$${item.price}</p>
            </div>
        `
    }).join('')

    itemsList.innerHTML = checkoutHtml;
    document.getElementById("total-price").textContent = `$${totalPrice}`
}



albumsContainer.innerHTML = getAlbumHtml(vinylCatalog)