import { z } from "zod";
import { prisma } from "../database/prisma.js";

// global function
const calculateTotalAmount = (cartItems) => {
  let total = 0;
  for (const item of cartItems) {
    let itemPrice = parseFloat(item.product.basePrice);
    
    if (item.variant) {
      itemPrice += parseFloat(item.variant.priceAdjustment);
    }
    
    total += itemPrice * item.quantity;
  }
  return total;
};

export const getAllOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const allOrder = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      status: "success",
      message: "Orders fetched successfully",
      data: { orders: allOrder },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const singleOrder = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
      include: {
        orderItems: {
            include : {
                product: true
            }
        }
      }
    });

    if (!singleOrder) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    return res.json({
      status: "success",
      message: "Order fetched successfully",
      data: { order: singleOrder },
    });
  } catch (error) {
    console.error("Get order error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddressSnapshot, paymentMethod } = req.body;

    const orderSchema = z.object({
      shippingAddressSnapshot: z.object({
        fullname: z.string().min(3),
        phoneNumber: z.string().min(11),
        addressLine1: z.string().min(3),
        addressLine2: z.string().optional(),
      }),
      paymentMethod: z.string().min(3),
    });

    const { success, data, error } = orderSchema.safeParse({
      shippingAddressSnapshot,
      paymentMethod,
    });

    if (!success) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: error.errors,
      });
    }

    // Get the cart items for the user
    const cart = await prisma.cart.findFirst({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true, // Fixed: was productVariant
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Cart is empty",
      });
    }

    // Calculate total amount
    const totalAmount = calculateTotalAmount(cart.items);

    // All operations in a transaction
    const newOrder = await prisma.$transaction(async (txPrisma) => {
      // Create new order
      const order = await txPrisma.order.create({
        data: {
          userId: userId,
          totalAmount: totalAmount,
          shippingAddressSnapshot: shippingAddressSnapshot,
          paymentMethod: paymentMethod,
        },
      });

      // Prepare order items data
      const orderItemData = cart.items.map((item) => {
        let itemPrice = parseFloat(item.product.basePrice);

        if (item.variant) {
          itemPrice += parseFloat(item.variant.priceAdjustment);
        }

        const totalPrice = itemPrice * item.quantity;

        return {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: itemPrice,
          totalPrice: totalPrice, // Added: required field
          productSnapshot: { // Added: required field
            title: item.product.title,
            description: item.product.description,
            basePrice: item.product.basePrice,
          },
          variantSnapshot: item.variant ? { // Added: required field
            variantName: item.variant.variantName,
            variantValue: item.variant.variantValue,
            priceAdjustment: item.variant.priceAdjustment,
          } : null,
        };
      });

      // Create order items
      await txPrisma.orderItem.createMany({
        data: orderItemData,
      });

      // Update stock quantities
      for (const item of cart.items) {
        if (item.variantId) {
          // Reduce variant stock
          await txPrisma.productVariant.update({
            where: {
              id: item.variantId,
            },
            data: {
              stockQuantity: { // Fixed: was stock
                decrement: item.quantity,
              },
            },
          });
        } else {
          // Reduce product stock
          await txPrisma.product.update({
            where: {
              id: item.productId,
            },
            data: {
              stockQuantity: { // Fixed: was stock
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // Clear cart
      await txPrisma.cartItem.deleteMany({ // Fixed: was txPrisma.items
        where: {
          cartId: cart.id,
        },
      });

      return order; // Return the order from transaction
    });

    return res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: { order: newOrder }, // Fixed: newOrder now properly scoped
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const updateOrder = async (req, res) => {
  // have to add logc here
};

export const deleteOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const isOrderExists = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
    });

    if (!isOrderExists) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    await prisma.order.delete({
      where: {
        id: orderId,
      },
    });

    return res.json({
      status: "success",
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete order error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};