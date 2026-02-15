export const getCart = (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Cart retrieved successfully",
    });
}

export const addItemtoCart = (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Item added to cart successfully",
    });
}

export const updateCartItem = (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Cart item updated successfully",
    });
}

export const removeItemFromCart = (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Item removed from cart successfully",
    });
}

export const clearCart = (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Cart cleared successfully",
    });
}