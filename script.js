document.addEventListener("DOMContentLoaded", function () {
    // Elements
    const cartModal = document.getElementById("cart-modal");
    const cartOverlay = document.getElementById("cart-overlay");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const openCartLink = document.getElementById("open-cart-link");
    const closeCartButton = document.getElementById("close-cart");
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const removeAllItemsButton = document.getElementById("remove-all-items");
    const promoCodeInput = document.getElementById("promo-code-input");
    const applyPromoCodeButton = document.getElementById("apply-promo-code");
    const continueShoppingButton = document.querySelector(".continue-shopping");
    const checkoutButton = document.querySelector(".checkout");
    const tipInput = document.getElementById("tip"); // Add tip input element

    // Function to remove an item from the cart
    function removeCartItem(itemToRemove) {
    cart = cart.filter((item) => item !== itemToRemove);
    updateCartDisplay();
    }

    // Cart array to store items
    let cart = [];

        // Function to load cart data from localStorage
        function loadCartFromStorage() {
            const cartData = localStorage.getItem("cart");
            if (cartData) {
                cart = JSON.parse(cartData);
                updateCartDisplay();
            }
        }

    // Function to save cart data to localStorage
    function saveCartToStorage() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Function to add an item to the cart
    function addToCart(product, price, image) {
        const existingItem = cart.find((item) => item.product === product);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ product, price, image, quantity: 1 });
        }

        updateCartDisplay();
        saveCartToStorage();
        displayWhatsAppNotification(product);
    }

    // Function to update the cart display
    function updateCartDisplay() {
        // Clear the cart display
        cartItems.innerHTML = "";

        let total = 0;

        cart.forEach((item) => {
            const li = document.createElement("li");

            // Create a container div for the product name, quantity, and price
            const productContainer = document.createElement("div");
            productContainer.classList.add("product-container");

            // Create a span for the product name
            const productNameSpan = document.createElement("span");
            productNameSpan.classList.add("product-name");
            productNameSpan.textContent = item.product;

            // Create a span to display the quantity
            const quantitySpan = document.createElement("span");
            quantitySpan.classList.add("quantity");
            quantitySpan.textContent = ` x${item.quantity}`;

            // Create a span to display the price of one item
            const priceSpan = document.createElement("span");
            priceSpan.classList.add("price");
            priceSpan.textContent = `$${item.price.toFixed(2)}`;

            productContainer.appendChild(productNameSpan);
            productContainer.appendChild(quantitySpan);

            li.appendChild(productContainer);

            // Add the price span to the right of the text
            li.appendChild(priceSpan);

            cartItems.appendChild(li);

            // Calculate the total for this item
            total += item.price * item.quantity;
        });

        // Get the tip amount from the input field
        const tipAmount = parseFloat(tipInput.value) || 0;

        // Calculate the total including the tip
        const totalWithTip = total + tipAmount;

        // Update the total price display
        cartTotal.textContent = `$${totalWithTip.toFixed(2)}`;

        // Display the notification
        displayNotification();
        saveCartToStorage();
    }

    // Function to display a WhatsApp-styled notification
    function displayWhatsAppNotification(product) {
        const addedProductElement = document.getElementById("added-product");
        addedProductElement.textContent = product;

        const whatsappNotification = document.getElementById("whatsapp-notification");
        whatsappNotification.style.display = "block";

        setTimeout(() => {
            whatsappNotification.style.display = "none";
        }, 3000);
    }

    // Function to remove one item from the cart by product name click
    function removeSingleItem(productToRemove) {
        const existingItem = cart.find((item) => item.product === productToRemove);

        if (existingItem && existingItem.quantity > 1) {
            existingItem.quantity--;
        } else {
            removeCartItem(existingItem);
        }

        updateCartDisplay();
        saveCartToStorage();
    }

    // Event delegation for removing single product when clicking its name
    cartItems.addEventListener("click", (event) => {
        if (event.target.classList.contains("product-name")) {
            const productName = event.target.textContent;
            removeSingleItem(productName);
        }
    });

        // Prevent negative tipping
        tipInput.addEventListener("input", () => {
            const tipAmount = parseFloat(tipInput.value) || 0;
            if (tipAmount < 0) {
                tipInput.value = "0";
            }
            updateCartDisplay();
        });

        // Function to load promo codes from a JSON file
        async function loadPromoCodes() {
            try {
                const response = await fetch("./promo-codes.json"); // Replace with your JSON file path
                const promoCodes = await response.json();
                return promoCodes;
            } catch (error) {
                console.error("Error loading promo codes:", error);
                return [];
            }
        }

    // Function to display a notification-style message
    function displayNotification() {
        const notification = document.getElementById("notification-message");
        notification.classList.remove("hidden");
        setTimeout(() => {
            notification.classList.add("hidden");
        }, 3000);
    }

    addToCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const product = button.getAttribute("data-product");
            const price = parseFloat(button.getAttribute("data-price"));
            const image = button.getAttribute("data-image");

            addToCart(product, price, image);
        });
    });

    removeAllItemsButton.addEventListener("click", () => {
        cart = [];
        updateCartDisplay();
    });

    function openCart() {
        cartModal.style.display = "block";
        cartOverlay.style.display = "block";

        cartOverlay.addEventListener("click", closeCart);
    }

    function closeCart() {
        cartModal.style.display = "none";
        cartOverlay.style.display = "none";

        cartOverlay.removeEventListener("click", closeCart);
    }

    openCartLink.addEventListener("click", openCart);
    closeCartButton.addEventListener("click", closeCart);

    continueShoppingButton.addEventListener("click", () => {
        closeCart();
    });

    checkoutButton.addEventListener("click", () => {
        closeCart();
    });

        // Function to apply a promo code
        async function applyPromoCode() {
            const promoCode = promoCodeInput.value;
            const promoCodes = await loadPromoCodes();
    
            const matchedCode = promoCodes.find((code) => code.code === promoCode);
    
            if (matchedCode) {
                // Apply the discount here based on matchedCode.discount
                console.log(`Applied promo code: ${matchedCode.code} - Discount: ${matchedCode.discount}`);
            } else {
                console.log("Invalid promo code.");
            }
        }
        
        applyPromoCodeButton.addEventListener("click", applyPromoCode);

        updateCartDisplay();
        cartModal.classList.add("dark-mode");

    // Add an event listener to the tip input
    tipInput.addEventListener("input", updateCartDisplay);

    loadCartFromStorage();

    updateCartDisplay();
    cartModal.classList.add("dark-mode");
});
