import { prisma } from "../database/prisma.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const getAllCategories = async (req, res) => {
    return res.send("ALL Category")
}

export const getACategory = async (req, res) => {
    return res.send("A Category")
}

export const createCategory = async (req, res) => {
    return res.send("Create Category")
}

export const updateCategory = async (req, res) => {
    return res.send("Update Category")
}

export const deleteCategory = async (req, res) => {
    return res.send("Delete Category")
}