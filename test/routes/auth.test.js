const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const app = require("../../index");
const User = require("../../src/models/user");

const { expect } = chai;

chai.use(chaiHttp);

describe("POST /register", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should register a new user and return a 201 status", async () => {
    sinon.stub(User, "findByUsername").resolves(null);
    const saveStub = sinon.stub(User.prototype, "save").resolves();

    const response = await chai.request(app).post("/register").send({
      name: "Neil",
      age: 26,
      username: "neil",
      password: "password",
    });

    expect(response.status).to.equal(201);
    expect(saveStub.calledOnce).to.be.true;
    expect(response.text).to.equal("Created User: neil");
  });

  it("should return a 409 if username already exists", async () => {
    const mockUsername = "existingUser";
    sinon.stub(User, "findByUsername").resolves(new User());

    const res = await chai.request(app).post("/register").send({
      name: "John",
      age: 25,
      username: mockUsername,
      password: "securePassword123",
    });

    expect(res.status).to.equal(401);
    expect(res.text).to.equal("Invalid Register Data.");
  });
});

describe("POST /login", () => {
  afterEach(() => {
    sinon.restore(); // Restore all sinon stubs after each test
  });

  it("should return a 401 for invalid username", async () => {
    sinon.stub(User, "findByUsername").resolves(null);

    const res = await chai.request(app).post("/login").send({
      username: "nonexistentUser",
      password: "somePassword",
    });

    expect(res.status).to.equal(401);
    expect(res.text).to.equal("Invalid username or password.");
  });

  it("should login successfully and return a token", async () => {
    const mockUser = {
      isPasswordValid: sinon.stub().resolves(true),
      update: sinon.stub().resolves(),
      toJSON: sinon.stub().returns({}),
      session_uuid: "test-session-uuid",
    };
    sinon.stub(User, "findByUsername").resolves(mockUser);

    const res = await chai.request(app).post("/login").send({
      username: "existingUser",
      password: "correctPassword",
    });

    expect(res.status).to.equal(200);
    expect(res.text).to.be.a("string");
  });
});
