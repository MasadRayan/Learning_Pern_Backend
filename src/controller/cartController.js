import { ca, da } from "zod/locales";
import { prisma } from "../database/prisma.js";
import { z } from "zod";

export const getCart = async (req, res) => {
  // I have user id
  const userId = req.user.id;
  // get cart from database

  const cart = await prisma.cart.findFirst({
    where: {
      userId: userId,
    },
    include: {
      items: true,
    },
  });

  // if cart not found, create a new cart for the user
  if (!cart) {
    const newCart = await prisma.cart.create({
      data: {
        userId: userId,
      },
    });
    return res.json({
      status: "success",
      message: "Cart created successfully",
      data: { cart: newCart },
    });
  }

  // return cart with its items
  return res.json({
    status: "success",
    message: "Cart fetched successfully",
    data: { cart },
  });
};

export const addItemtoCart = async (req, res) => {
  const userId = req.user.id;

  const iremSchema = z.object({
    productId: z.uuid(),
    variantId: z.uuid().optional(),
    quantity: z.number().min(1),
  });

  const { success, data, error } = iremSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      data: z.flattenError(error),
    });
  }

  //   find the cart for the user
  let cart = await prisma.cart.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!cart) {
    // if not exists, create a new cart
    const newCart = await prisma.cart.create({
      data: {
        userId: userId,
      },
    });
  }

  //   check if the cart belongs to the logged in user

  if (cart.userId !== userId) {
    return res.status(403).json({
      status: "error",
      message: "You are not authorized to add items to this cart",
      data: null,
    });
  }

  //   check the product exist

  const product = await prisma.product.findUnique({
    where: {
      id: data.productId,
    },
  });

  if (!product) {
    return res.status(400).json({
      status: "error",
      message: "Product not found",
      data: null,
    });
  }

  //   check the variant exist
  if (data.variantId) {
    const variant = await prisma.productVariant.findUnique({
      where: {
        id: data.variantId,
      },
    });

    if (!variant) {
      return res.status(400).json({
        status: "error",
        message: "Variant not found",
        data: null,
      });
    }
  }

  //   now add the item to the cart
  const cartId = cart.id;
  const item = await prisma.cartItem.create({
    data: {
      cartId: cartId,
      productId: data.productId,
      variantId: data.variantId,
      quantity: data.quantity,
    },
  });

  return res.json({
    status: "success",
    message: "Item added to cart successfully",
    data: { item },
  });
};

export const updateCartItem = async (req, res) => {
  res.json({
    status: "success",
    message: "Cart item updated successfully",
  });
};

export const removeItemFromCart = async (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.id;

  const itemSchema = z.object({
    id: z.uuid(),
  });

  const { success, error } = itemSchema.safeParse({
    id: itemId,
  });

  if (!success) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      data: z.flattenError(error),
    });
  }

  // find the cart for the user
  const cart = await prisma.cart.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!cart) {
    return res.status(404).json({
      status: "error",
      message: "Cart not found",
      data: null,
    });
  }

  // also need to validate is the item exists in the cart
  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id,
    },
  });

  if (!item) {
    return res.status(404).json({
      status: "error",
      message: "Item not found in cart",
      data: null,
    });
  }

  //   check if the cart belongs to the logged in user

  if (cart.userId !== userId) {
    return res.status(403).json({
      status: "error",
      message: "You are not authorized to remove items from this cart",
      data: null,
    });
  }

  await prisma.cartItem.delete({
    where: {
      id: itemId,
    },
  });

  return res.status(200).json({
    status: "success",
    message: "Item removed from cart successfully",
    data: null,
  });
};

export const clearCart = async (req, res) => {
  const userId = req.user.id;

  const isCartExists = await prisma.cart.findFirst({
    where: {
      userId: userId,
    },
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
      cartId: isCartExists.id,
    },
  });

  return res.status(200).json({
    status: "Success",
    message: "Cart cleared successfully",
    data: null,
  });
};
