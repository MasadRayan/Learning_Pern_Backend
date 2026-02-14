import { prisma } from "../database/prisma.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const getAllProducts = async (req, res) => {

     const allProducts = await prisma.product.findMany({
        orderBy: {
            createdAt: "desc",
        }
     })

    return res.json({
        status: "success",
        message: "Products fetched successfully",
        data: { products: allProducts },
    })
}


export const getAProduct = async (req, res) => {
    return res.send("A Product")
}

export const createProduct = async (req, res) => {
    return res.send("Create Product")
}

export const updateProduct = async (req, res) => {
    return res.send("Update Product")
}

export const deleteProduct = async (req, res) => {
    return res.send("Delete Product")
}