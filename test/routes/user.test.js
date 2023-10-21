const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const app = require("../../index");
const User = require("../../src/models/user");
const jsonwebtoken = require("jsonwebtoken");
const constants = require("../../src/constants");

const { SECRET_KEY } = constants;

const { expect } = chai;

chai.use(chaiHttp);

describe("User Routes", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("GET /user/:userId", () => {
    it("should return user details for a valid userId", async () => {
      const mockedUser = new User(1, "John", 25, "john", "password", "uuid");

      sinon.stub(User, "findById").resolves(mockedUser);
      const token = jsonwebtoken.sign(
        { ...mockedUser.toJSON(), session_uuid: mockedUser.session_uuid },
        SECRET_KEY
      );

      const response = await chai
        .request(app)
        .get("/user/1")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({
        id: 1,
        name: "John",
        age: 25,
        username: "john",
      });
    });

    it("should return a 404 for a non-existent userId", async () => {
      sinon
        .stub(User, "findById")
        .withArgs(1)
        .resolves({ id: 1, session_uuid: "test" })
        .withArgs(999)
        .resolves(null);
      const token = jsonwebtoken.sign(
        { id: 1, session_uuid: "test" },
        SECRET_KEY
      );

      const res = await chai
        .request(app)
        .get("/user/999")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("User not found.");
    });

    it("should return a 401 without an authorization header", async () => {
      sinon.stub(User, "findById").resolves({ id: 1, name: "John", age: 25 });

      const res = await chai.request(app).get("/user/1");

      expect(res.status).to.equal(401);
      expect(res.text).to.equal("Unauthorized");
    });

    it("should return a 401 with an invalid authorization token", async () => {
      sinon.stub(User, "findById").resolves({ id: 1, name: "John", age: 25 });

      const res = await chai
        .request(app)
        .get("/user/1")
        .set("Authorization", `Bearer invalid_token_here`);

      expect(res.status).to.equal(401);
      expect(res.text).to.equal("Unauthorized");
    });
  });

  describe("PATCH /:userId", () => {
    it("should update user details for a valid userId", async () => {
      const mockedUser = new User(1, "John", 25, "john", "password", "uuid");

      sinon.stub(User, "findById").resolves(mockedUser);
      const token = jsonwebtoken.sign(
        { ...mockedUser.toJSON(), session_uuid: mockedUser.session_uuid },
        SECRET_KEY
      );

      const res = await chai
        .request(app)
        .patch("/user/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Neil2" });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("name", "Neil2");
      expect(res.body).to.have.property("age", 25);
    });

    it("should return a 404 for a non-existent userId", async () => {
      sinon
        .stub(User, "findById")
        .withArgs(1)
        .resolves({ id: 1, session_uuid: "test" })
        .withArgs(999)
        .resolves(null);
      const token = jsonwebtoken.sign(
        { id: 1, session_uuid: "test" },
        SECRET_KEY
      );

      const res = await chai
        .request(app)
        .patch("/user/999")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Jane" });

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("User not found.");
    });

    it("should return a 401 without an authorization header", async () => {
      sinon.stub(User, "findById").resolves({ id: 1, name: "John", age: 25 });

      const res = await chai
        .request(app)
        .patch("/user/1")
        .send({ name: "Jane" });

      expect(res.status).to.equal(401);
      expect(res.text).to.equal("Unauthorized");
    });

    it("should return a 401 with an invalid authorization token", async () => {
      sinon.stub(User, "findById").resolves({ id: 1, name: "John", age: 25 });

      const res = await chai
        .request(app)
        .patch("/user/1")
        .set("Authorization", `Bearer invalid_token_here`)
        .send({ name: "Jane" });

      expect(res.status).to.equal(401);
      expect(res.text).to.equal("Unauthorized");
    });

    it("should only update the name when only name is provided", async () => {
      const mockedUser = new User(1, "John", 25, "john", "password", "uuid");

      sinon.stub(User, "findById").resolves(mockedUser);
      const token = jsonwebtoken.sign(
        { ...mockedUser.toJSON(), session_uuid: mockedUser.session_uuid },
        SECRET_KEY
      );

      const res = await chai
        .request(app)
        .patch("/user/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Jane" });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("name", "Jane");
      expect(res.body).to.have.property("age", 25);
    });
  });
});
