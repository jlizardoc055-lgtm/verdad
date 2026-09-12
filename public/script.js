/* ========================================
   URBAN STYLE - SCRIPT
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================
       ELEMENTOS
    ======================================== */

    const cartButtons = document.querySelectorAll(".add-cart");
    const cartCount = document.querySelector(".cart-count");
    const cartButton = document.querySelector(".cart-btn");
    const searchButton = document.querySelector(".search-btn");


    /* ========================================
       CARRITO
    ======================================== */

    let cart = JSON.parse(localStorage.getItem("urbanStyleCart")) || [];


    /* ========================================
       PRODUCTOS
    ======================================== */

    const products = [
        {
            id: 1,
            name: "Camisa Oversize",
            category: "Camisas",
            price: 89.90
        },
        {
            id: 2,
            name: "Pantalón Cargo",
            category: "Pantalones",
            price: 129.90
        },
        {
            id: 3,
            name: "Casaca Denim",
            category: "Casacas",
            price: 159.90
        },
        {
            id: 4,
            name: "Polera Essential",
            category: "Poleras",
            price: 99.90
        }
    ];


    /* ========================================
       ACTUALIZAR CONTADOR
    ======================================== */

    function updateCartCount() {

        const totalItems = cart.reduce(
            (total, product) => total + product.quantity,
            0
        );

        cartCount.textContent = totalItems;
    }


    /* ========================================
       GUARDAR CARRITO
    ======================================== */

    function saveCart() {
        localStorage.setItem(
            "urbanStyleCart",
            JSON.stringify(cart)
        );
    }


    /* ========================================
       AGREGAR PRODUCTO
    ======================================== */

    cartButtons.forEach((button, index) => {

        button.addEventListener("click", () => {

            const product = products[index];

            const existingProduct = cart.find(
                item => item.id === product.id
            );

            if (existingProduct) {

                existingProduct.quantity++;

            } else {

                cart.push({
                    ...product,
                    quantity: 1
                });

            }

            saveCart();
            updateCartCount();

            showNotification(
                `${product.name} añadido al carrito`
            );

        });

    });


    /* ========================================
       NOTIFICACIÓN
    ======================================== */

    function showNotification(message) {

        const oldNotification =
            document.querySelector(".notification");

        if (oldNotification) {
            oldNotification.remove();
        }

        const notification =
            document.createElement("div");

        notification.className = "notification";

        notification.textContent = message;

        document.body.appendChild(notification);


        setTimeout(() => {
            notification.classList.add("show");
        }, 10);


        setTimeout(() => {

            notification.classList.remove("show");

            setTimeout(() => {
                notification.remove();
            }, 300);

        }, 2500);
    }


    /* ========================================
       ESTILOS DE NOTIFICACIÓN
    ======================================== */

    const notificationStyle =
        document.createElement("style");

    notificationStyle.textContent = `
        .notification {
            position: fixed;
            right: 25px;
            bottom: 25px;
            z-index: 9999;

            background: #111;
            color: white;

            padding: 16px 22px;

            font-size: 13px;

            transform: translateY(20px);
            opacity: 0;

            transition: all 0.3s ease;

            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
    `;

    document.head.appendChild(notificationStyle);


    /* ========================================
       MODAL DEL CARRITO
    ======================================== */

    cartButton.addEventListener("click", () => {
        openCart();
    });


    function openCart() {

        const oldModal =
            document.querySelector(".cart-modal");

        if (oldModal) {
            oldModal.remove();
        }


        const modal =
            document.createElement("div");

        modal.className = "cart-modal";


        modal.innerHTML = `
            <div class="cart-overlay"></div>

            <div class="cart-panel">

                <div class="cart-header">
                    <h2>Tu carrito</h2>

                    <button class="close-cart">
                        ×
                    </button>
                </div>

                <div class="cart-items">
                    ${renderCartItems()}
                </div>

                <div class="cart-footer">
                    <div class="cart-total">
                        <span>Total</span>
                        <strong>
                            S/ ${calculateTotal().toFixed(2)}
                        </strong>
                    </div>

                    <button class="checkout-btn">
                        Finalizar compra
                    </button>
                </div>

            </div>
        `;


        document.body.appendChild(modal);


        addCartModalStyles();


        const closeButton =
            modal.querySelector(".close-cart");

        const overlay =
            modal.querySelector(".cart-overlay");


        closeButton.addEventListener(
            "click",
            () => modal.remove()
        );

        overlay.addEventListener(
            "click",
            () => modal.remove()
        );


        /* ELIMINAR PRODUCTOS */

        modal.querySelectorAll(".remove-product")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(button.dataset.id);

                        removeFromCart(id);

                        modal.remove();

                        openCart();
                    }
                );

            });


        /* CAMBIAR CANTIDAD */

        modal.querySelectorAll(".quantity-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(button.dataset.id);

                        const action =
                            button.dataset.action;

                        changeQuantity(id, action);

                        modal.remove();

                        openCart();
                    }
                );

            });


        /* FINALIZAR COMPRA */

        const checkout =
            modal.querySelector(".checkout-btn");

        checkout.addEventListener(
            "click",
            checkoutCart
        );
    }


    /* ========================================
       RENDER CARRITO
    ======================================== */

    function renderCartItems() {

        if (cart.length ===