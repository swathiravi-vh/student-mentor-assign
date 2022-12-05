const { MongoClient } = require("mongodb");

module.exports = {
  current: {},
  async connect() {
    try {
      const resp = await MongoClient.connect(process.env.MONGO_DRIVER);
      this.current = resp.db("studentmentorassign");
      //   console.log(this.current);
    } catch (err) {
      console.log(err);
    }
  },
};
