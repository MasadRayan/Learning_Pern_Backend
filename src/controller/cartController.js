export const getCart = async (req, res) => {
    // I have user id
    const userId = req.user.id; 
    // get cart from database
    // if cart not found, create a new cart for the user
    // return cart with its items and total price

    console.log(userId);

    res.json({
        status: "success",
        message: "Cart retrieved successfully",
    });
}

export const addItemtoCart = async (req, res) => {
    res.json({
        status: "success",
        message: "Item added to cart successfully",
    });
}

export const updateCartItem = async (req, res) => {
    res.json({
        status: "success",
        message: "Cart item updated successfully",
    });
}

export const removeItemFromCart = async (req, res) => {
    res.json({
        status: "success",
        message: "Item removed from cart successfully",
    });
}

export const clearCart = async (req, res) => {
    res.json({
        status: "success",
        message: "Cart cleared successfully",
    });
}