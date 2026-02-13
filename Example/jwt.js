import jwt from "jsonwebtoken";
import crypto from "crypto";


const payload = { 
    id: "1234",
    firstName: "John",
    lastName: "Doe",
    email: "6lHtM@example.com",
}

const secretKey = crypto.randomBytes(32).toString('hex');
console.log("Secret Key:", secretKey);

const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
        console.error("Token verification failed:", err);
    } else {
        console.log("Decoded payload:", decoded);
    }
});

console.log(token);

 