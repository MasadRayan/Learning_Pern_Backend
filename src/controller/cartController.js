import { prisma } from "../database/prisma.js";

export const getCart = async (req, res) => {
    // I have user id
    const userId = req.user.id; 
    // get cart from database

    const cart  = await prisma.cart.findFirst({
        where: {
            userId: userId
        },
        include: {
            items: true,
        }
    })

    // if cart not found, create a new cart for the user
    if (!cart) {
        const newCart = await prisma.cart.create({
            data: {
                userId: userId,
            }
        });
        return res.json({
            status: "success",
            message: "Cart created successfully",
            data: { cart: newCart },
        })
    }

    // return cart with its items
    return res.json({
        status: "success",
        message: "Cart fetched successfully",
        data: { cart },
    })
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
    
    const userId = req.user.id;

    const isCartExists = await prisma.cart.findFirst({
        where: {
            userId: userId
        }
    });

    if (!isCartExists) {
        return res.status(200).json({
            status: "Success",
            message: "Cart already empty",
            data: null,
        });
    }

    // delete all cart items
    await prisma.cartItem.deleteMany({
        where: {
            cartId: isCartExists.id
        }
    });

    return res.status(200).json({
        status: "Success",
        message: "Cart cleared successfully",
        data: null,
    });
}