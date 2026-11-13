const STORAGE_KEY = "market-basket-cart-v1";
const PRODUCTS = [
    {
        id: 1,
        name: "Mandazi (pack of 6)",
        price: 120,
        image: "🥯",
        note: "Freshly made for sharing"
    },
    {
        id: 2,
        name: "Chapati (pack of 5)",
        price: 150,
        image: "🫓",
        note: "Soft, golden and ready to eat"
    },
    { id: 3, name: "Tea leaves 250g", price: 180, image: "🍵", note: "A comforting cup, any time" },
    {
        id: 4,
        name: "Kenyan honey 500g",
        price: 420,
        image: "🍯",
        note: "Sweetness from local hives"
    }
];

const state = { products: PRODUCTS, cart: loadCart() };
const PRODUCTS_ELEMENT = document.querySelector("#products");
const CART_ITEMS_ELEMENT = document.querySelector("#cart-items");
const CART_COUNT_ELEMENT = document.querySelector("#cart-count");
const CART_TOTAL_ELEMENT = document.querySelector("#cart-total");
const CLEAR_CART_BUTTON = document.querySelector("#clear-cart");

function loadCart() {
    try {
        const storedCart = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
        if (!Array.isArray(storedCart)) return [];
        return storedCart.filter(
            (item) =>
                Number.isInteger(item.productId) &&
                PRODUCTS.some((product) => product.id === item.productId) &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0
        );
    } catch {
        return [];
    }
}

function saveCart() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
    } catch {
        document.querySelector("#cart-message").textContent =
            "Basket changes could not be saved in this browser.";
    }
}

function getCartCount() {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
}

function getCartTotal() {
    return state.cart.reduce((total, item) => {
        const product = state.products.find((candidate) => candidate.id === item.productId);
        return total + product.price * item.quantity;
    }, 0);
}

function addToCart(productId) {
    const existingItem = state.cart.find((item) => item.productId === productId);
    if (existingItem) existingItem.quantity += 1;
    else state.cart.push({ productId, quantity: 1 });
    commit();
}

function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    state.cart = state.cart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
    );
    commit();
}

function removeFromCart(productId) {
    state.cart = state.cart.filter((item) => item.productId !== productId);
    commit();
}

function commit() {
    saveCart();
    render();
}

function renderProducts() {
    PRODUCTS_ELEMENT.replaceChildren(
        ...state.products.map((product) => {
            const card = document.createElement("article");
            card.className = "product-card";
            const icon = document.createElement("span");
            icon.className = "product-icon";
            icon.setAttribute("aria-hidden", "true");
            icon.textContent = product.image;
            const info = document.createElement("div");
            info.className = "product-info";
            const title = document.createElement("h3");
            title.textContent = product.name;
            const note = document.createElement("p");
            note.textContent = `${product.note} · KES ${product.price.toLocaleString()}`;
            info.append(title, note);
            const button = document.createElement("button");
            button.className = "add-product";
            button.type = "button";
            button.dataset.productId = String(product.id);
            button.textContent = "Add to basket";
            card.append(icon, info, button);
            return card;
        })
    );
}

function renderCartItems() {
    if (state.cart.length === 0) {
        const empty = document.createElement("p");
        empty.className = "cart-empty";
        empty.textContent = "Your basket is empty. Add a pantry pick to get started.";
        CART_ITEMS_ELEMENT.replaceChildren(empty);
        return;
    }

    const lines = state.cart.map((item) => {
        const product = state.products.find((candidate) => candidate.id === item.productId);
        const line = document.createElement("div");
        line.className = "basket-line";
        const summary = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = product.name;
        const price = document.createElement("p");
        price.textContent = `KES ${(product.price * item.quantity).toLocaleString()}`;
        summary.append(title, price);
        const controls = document.createElement("div");
        controls.className = "line-controls";
        const quantity = document.createElement("div");
        quantity.className = "quantity";
        const decrease = document.createElement("button");
        decrease.type = "button";
        decrease.dataset.action = "decrease";
        decrease.dataset.productId = String(item.productId);
        decrease.setAttribute("aria-label", `Remove one ${product.name}`);
        decrease.textContent = "−";
        const count = document.createElement("span");
        count.textContent = String(item.quantity);
        const increase = document.createElement("button");
        increase.type = "button";
        increase.dataset.action = "increase";
        increase.dataset.productId = String(item.productId);
        increase.setAttribute("aria-label", `Add one ${product.name}`);
        increase.textContent = "+";
        quantity.append(decrease, count, increase);
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove-item";
        remove.dataset.action = "remove";
        remove.dataset.productId = String(item.productId);
        remove.setAttribute("aria-label", `Remove ${product.name} from basket`);
        remove.textContent = "×";
        controls.append(quantity, remove);
        line.append(summary, controls);
        return line;
    });
    CART_ITEMS_ELEMENT.replaceChildren(...lines);
}

function render() {
    renderProducts();
    renderCartItems();
    const itemCount = getCartCount();
    CART_COUNT_ELEMENT.textContent = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
    CART_TOTAL_ELEMENT.textContent = `KES ${getCartTotal().toLocaleString()}`;
    CLEAR_CART_BUTTON.disabled = state.cart.length === 0;
}

PRODUCTS_ELEMENT.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-product-id]");
    if (button) addToCart(Number(button.dataset.productId));
});

CART_ITEMS_ELEMENT.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const productId = Number(button.dataset.productId);
    const item = state.cart.find((candidate) => candidate.productId === productId);
    if (!item) return;

    if (button.dataset.action === "increase") updateQuantity(productId, item.quantity + 1);
    if (button.dataset.action === "decrease") updateQuantity(productId, item.quantity - 1);
    if (button.dataset.action === "remove") removeFromCart(productId);
});

CLEAR_CART_BUTTON.addEventListener("click", () => {
    state.cart = [];
    commit();
});

render();
