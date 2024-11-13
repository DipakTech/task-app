import request from "supertest";
import bcrypt from "bcrypt";
import app from "../index";
import { prisma } from "../db";

// Mock functions
jest.mock("../utils/jwtToken", () => ({
  createAccessToken: jest.fn().mockReturnValue("test-token"),
}));

jest.mock("../db", () => {
  const bcrypt = require("bcrypt");
  return {
    prisma: {
      user: {
        deleteMany: jest.fn().mockResolvedValue({}),
        findUnique: jest.fn().mockImplementation(({ where: { email } }) => {
          if (email === "testuser@example.com") {
            return Promise.resolve({
              email: "testuser@example.com",
              password: bcrypt.hashSync("password123", 10),
            });
          }
          if (email === "newuser@example.com") {
            return Promise.resolve({
              email: "newuser@example.com",
              password: bcrypt.hashSync("NPassword123", 10),
            });
          }
          return Promise.resolve(null);
        }),
        create: jest
          .fn()
          .mockImplementation(({ data: { email, password } }) => {
            if (email === "testuser@example.com") {
              throw new Error("This email is already registered");
            }
            return Promise.resolve({
              email,
              password,
            });
          }),
      },
      $disconnect: jest.fn().mockResolvedValue({}),
    },
  };
});

beforeAll(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Auth Endpoints", () => {
  describe("POST /register", () => {
    it("should register a new user", async () => {
      const response = await request(app).post("/auth/register").send({
        name: "Test User",
        email: "one@example.com",
        password: "NPassword123",
      });

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe(
        "Congratulations!! Account has been created for you..",
      );

      const user = await prisma.user.findUnique({
        where: { email: "newuser@example.com" },
      });
      expect(user).not.toBeNull();
      expect(await bcrypt.compare("NPassword123", user?.password || "")).toBe(
        true,
      );
    });

    it("should return error if fields are missing", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({ name: "Test User", email: "testuser@example.com" });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Please fill all the fields");
    });

    it("should return error if email is already registered", async () => {
      const response = await request(app).post("/auth/register").send({
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("This email is already registered");
    });
  });

  describe("POST /login", () => {
    it("should login an existing user", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "testuser@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.msg).toBe("Login successful..");
      expect(response.body.token).toBe("test-token");
      expect(response.body.user).toEqual({
        email: "testuser@example.com",
      });
    });

    it("should return error if email is not registered", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "unknown@example.com", password: "password123" });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(false);
      expect(response.body.msg).toBe("This email is not registered!!");
    });

    it("should return error if password is incorrect", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "testuser@example.com", password: "wrongpassword" });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(false);
      expect(response.body.msg).toBe("Password incorrect!!");
    });
  });
});
