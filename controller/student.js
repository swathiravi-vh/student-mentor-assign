const mongo = require("../db");

// Student Collection
module.exports.getUser = async (req, res, next) => {
  // console.log(mongo.current);
  try {
    let resp = await mongo.current.collection("student").find({}).toArray();
    res.send(resp);
  } catch (err) {
    res.send(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    let resp = await mongo.current.collection("student").insertOne(req.body);
    resp.acknowledged === true &&
      resp.insertedId &&
      res.send({ code: 200, message: "Created Successfully" });
  } catch (err) {
    res.send(err);
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    let resp = await mongo.current
      .collection("student")
      .deleteOne({ id: +req.params.id });
    res.send(resp);
  } catch (err) {
    res.send("Error" + err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const resp = await mongo.current
      .collection("student")
      .updateOne(
        { id: +req.params.id },
        { $set: { id: +req.params.id, ...req.body } }
      );
    console.log(resp);
    console.log(
      await mongo.current
        .collection("student")
        .find({ id: req.params.id })
        .toArray()
    );
    res.send(resp);
  } catch (err) {
    res.send("Error" + err);
  }
};
