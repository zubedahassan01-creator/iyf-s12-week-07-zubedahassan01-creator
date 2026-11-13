function createOrderSummary(orderItems) {
    if (!Array.isArray(orderItems)) throw new TypeError("Order items must be an array.");

    const normalizedItems = orderItems.map((item) => {
        if (
            !item ||
            typeof item.name !== "string" ||
            !Number.isFinite(item.price) ||
            !Number.isInteger(item.quantity) ||
            item.quantity < 1 ||
            item.price < 0
        ) {
            throw new TypeError(
                "Each item needs a name, non-negative price, and positive quantity."
            );
        }

        return { name: item.name.trim(), price: item.price, quantity: item.quantity };
    });

    const itemCount = normalizedItems.reduce((total, item) => total + item.quantity, 0);
    const subtotal = normalizedItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return {
        itemCount,
        subtotal,
        lines: normalizedItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            lineTotal: item.price * item.quantity
        }))
    };
}

const orderSummary = createOrderSummary([
    { name: "Notebook", price: 240, quantity: 2 },
    { name: "Pen set", price: 90, quantity: 1 }
]);

document.querySelector("#order-summary").textContent = JSON.stringify(orderSummary, null, 2);
