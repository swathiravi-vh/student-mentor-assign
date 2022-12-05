const express = require("express");
const route = express.Router();
const mentor = require("./../controller/mentor");

route.get("/all", mentor.listMentor);
route.post("/create", mentor.createMentor);
route.delete("/delete/:id", mentor.deleteMentor);
route.put("/update/:id", mentor.updateMentor);

route.put("/assign/:studentId", mentor.assignMentor);
route.get("/get/:id", mentor.getStudentByMentor);
route.put("/updateMentor/:id", mentor.updateMultipleStudent);

module.exports = route;
