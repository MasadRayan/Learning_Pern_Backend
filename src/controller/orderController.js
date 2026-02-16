export const getAllOrders = async (req, res) => {
    res.json({
        status: "success",
        message: "Orders fetched successfully",
        data: null,
    });
}


export const getOrderById = async (req, res) => {
    res.json({
        status: "success",
        message: "Order fetched successfully",
        data: null,
    });
}


export const createOrder = async (req, res) =>{
    res.json({
        status: "success",
        message: "Order created successfully",
        data: null,
    });
}


export const updateOrder = async (req, res) => {
    res.json({
        status: "success",
        message: "Order updated successfully",
        data: null,
    });
}


export const deleteOrder = async (req, res) => {
    res.json({
        status: "success",
        message: "Order deleted successfully",
        data: null,
    });
}