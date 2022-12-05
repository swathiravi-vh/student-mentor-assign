const express = require("express");
const controller = require("../controller/student");
const route = express.Router();

route.get("/all", controller.getUser);
route.post("/create", controller.createUser);
route.delete("/delete/:id", controller.deleteUser);
route.put("/update/:id", controller.updateUser);

module.exports = route;
