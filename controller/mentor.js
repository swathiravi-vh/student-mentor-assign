const mongo = require("./../db");

module.exports.createMentor = async (req, res, next) => {
  try {
    const resp = await mongo.current.collection("mentor").insertOne(req.body);
    res.send(resp);
  } catch (err) {
    res.send(err);
  }
};

module.exports.updateMentor = async (req, res, next) => {
  try {
    const resp = await mongo.current
      .collection("mentor")
      .updateOne({ id: +req.params.id }, { $set: { ...req.body } });
    res.send(resp);
  } catch (err) {
    res.send(err);
  }
};

module.exports.listMentor = async (req, res, next) => {
  try {
    const resp = await mongo.current.collection("mentor").find().toArray();
    console.log(resp);
    res.send(
      resp.length > 0
        ? resp
        : { message: "No mentor found.Try adding new records" }
    );
  } catch (err) {
    res.send(err);
  }
};

module.exports.deleteMentor = async (req, res, next) => {
  try {
    const resp = await mongo.current
      .collection("mentor")
      .remove({ id: +req.params.id });
    res.send(
      resp.deletedCount === 0
        ? { code: 404, message: "record not found" }
        : { code: 200, message: "deleted successfully" }
    );
  } catch (err) {
    res.send(err);
  }
};

module.exports.assignMentor = async (req, res, next) => {
  try {
    // remove student from old mentor
    const response = await mongo.current
      .collection("student")
      .find({ id: +req.params.studentId })
      .toArray();

    if (Object.keys(response[0]).includes("mentor")) {
      let resp1 = await mongo.current
        .collection("mentor")
        .find({ id: +response[0].mentor })
        .toArray();
      resp1 = resp1[0]?.["student"].filter(
        (ele) => +ele !== +req.params.studentId
      );
      await mongo.current.collection("mentor").updateOne(
        { id: +response[0]["mentor"] },
        {
          $set: {
            student: resp1.length > 0 ? resp1 : [],
          },
        }
      );
    }

    // update student collection with latest mentor
    const resp = await mongo.current
      .collection("student")
      .updateOne(
        { id: +req.params.studentId },
        { $set: { mentor: +req.body.mentorId } }
      );

    // get latest mentor data and update student id
    let upd = await mongo.current
      .collection("mentor")
      .find({ id: +req.body.mentorId })
      .toArray();
    await mongo.current.collection("mentor").updateOne(
      { id: +req.body.mentorId },
      {
        $set: {
          student:
            upd[0]["student"].length > 0
              ? [...upd[0]["student"], +req.params.studentId]
              : [+req.params.studentId],
        },
      }
    );
    res.send(resp);
  } catch (err) {
    next(err);
  }
};

module.exports.getStudentByMentor = async (req, res, next) => {
  try {
    const students = await mongo.current
      .collection("mentor")
      .aggregate([
        {
          $match: {
            id: +req.params.id,
          },
        },
      ])
      .toArray();
    if (students.length === 0) throw new Error("No record found");

    let values = [...new Set(students[0]["student"])].map(Number);
    const resp = await mongo.current
      .collection("student")
      .find({ id: { $in: values } })
      .toArray();
    res.send(resp);
  } catch (err) {
    next(err);
  }
};

module.exports.updateMultipleStudent = async (req, res, next) => {
  console.log("tet");
  try {
    let students = req.body.student;
    let print = await mongo.current
      .collection("student")
      .find({ id: { $in: students } })
      .toArray();
    console.log(students.length, print);
    if (!(students.length === print.length)) {
      res.send({
        message: "Please Pass valid student",
      });
      return;
    }
    if (print.filter((ele) => ele?.mentor).length > 0) {
      res.send({
        message: "All student / any one student has a mentor assigned",
      });
      return;
    }

    let resp = await mongo.current
      .collection("student")
      .updateMany(
        { id: { $in: students } },
        { $set: { mentor: +req.params.id } }
      );
    let student = await mongo.current
      .collection("mentor")
      .find({ id: +req.params.id })
      .toArray();
    await mongo.current.collection("mentor").updateOne(
      { id: +req.params.id },
      {
        $set: {
          student: [
            ...new Set(
              [student[0]["student"], students]
                .toString()
                .split(",")
                .map(Number)
            ),
          ],
        },
      }
    );
    res.send(resp);
  } catch (err) {
    next(err);
  }
};
