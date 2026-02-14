const adminMiddleware = (req, res, next) => {

    const user = req.user;

    if (user.role === "ADMIN") {
        next();
    } else {
        return res.status(403).json({
            status: "error",
            message: "Forbidden",
        });
    }

}
export default adminMiddleware;