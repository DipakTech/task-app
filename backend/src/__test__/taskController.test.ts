import request from "supertest";
import app from "../index";
import { prisma } from "../db";
import { verifyAccessToken } from "../middlewares/verifyToken";
import checkRole from "../middlewares/check-role";
import { Request, Response, NextFunction } from "express";

jest.mock("../middlewares/verifyToken");
jest.mock("../middlewares/check-role");

describe("Task Controller", () => {
  beforeAll(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("DELETE /tasks/:taskId/:userId", () => {
    it("should delete a task successfully", async () => {
      (verifyAccessToken as jest.Mock).mockImplementation(
        (req: Request, res: Response, next: NextFunction) => {
          (req as any).user = { id: "test-user-id", role: "ADMIN" };
          next();
        },
      );

      (checkRole as jest.Mock).mockImplementation(
        (role: string) => (req: Request, res: Response, next: NextFunction) => {
          next();
        },
      );

      const task = await prisma.task.create({
        data: {
          title: "Test Task",
          description: "Test Description",
          status: "PENDING",
          userId: "test-user-id",
        },
      });

      const response = await request(app)
        .delete(`/tasks/${task.id}/test-user-id`)
        .set("Cookie", "token=test-token");

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.msg).toBe("Task deleted successfully.");
    });

    it("should return error if task not found", async () => {
      (verifyAccessToken as jest.Mock).mockImplementation(
        (req: Request, res: Response, next: NextFunction) => {
          (req as any).user = { id: "test-user-id", role: "ADMIN" };
          next();
        },
      );

      (checkRole as jest.Mock).mockImplementation(
        (role: string) => (req: Request, res: Response, next: NextFunction) => {
          next();
        },
      );

      const response = await request(app)
        .delete(`/tasks/non-existent-task-id/test-user-id`)
        .set("Cookie", "token=test-token");

      expect(response.status).toBe(404);
      expect(response.body.status).toBe(false);
      expect(response.body.msg).toBe("Task not found");
    });

    it("should return error if user is not authorized", async () => {
      (verifyAccessToken as jest.Mock).mockImplementation(
        (req: Request, res: Response, next: NextFunction) => {
          (req as any).user = { id: "test-user-id", role: "USER" };
          next();
        },
      );

      (checkRole as jest.Mock).mockImplementation(
        (role: string) => (req: Request, res: Response, next: NextFunction) => {
          res.status(403).json({ status: false, msg: "Forbidden" });
        },
      );

      const response = await request(app)
        .delete(`/tasks/test-task-id/test-user-id`)
        .set("Cookie", "token=test-token");

      expect(response.status).toBe(403);
      expect(response.body.status).toBe(false);
      expect(response.body.msg).toBe("Forbidden");
    });
  });

  describe("PUT /tasks/:taskId", () => {
    it("should update a task successfully", async () => {
      (verifyAccessToken as jest.Mock).mockImplementation(
        (req: Request, res: Response, next: NextFunction) => {
          (req as any).user = { id: "test-user-id", role: "ADMIN" };
          next();
        },
      );

      (checkRole as jest.Mock).mockImplementation(
        (role: string) => (req: Request, res: Response, next: NextFunction) => {
          next();
        },
      );

      const task = await prisma.task.create({
        data: {
          title: "Test Task",
          description: "Test Description",
          status: "PENDING",
          userId: "test-user-id",
        },
      });

      const response = await request(app)
        .put(`/tasks/${task.id}`)
        .set("Cookie", "token=test-token")
        .send({ title: "Updated Task", description: "Updated Description" });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.msg).toBe("Task updated successfully.");
      expect(response.body.task.title).toBe("Updated Task");
      expect(response.body.task.description).toBe("Updated Description");
    });

    it("should return error if task not found", async () => {
      (verifyAccessToken as jest.Mock).mockImplementation(
        (req: Request, res: Response, next: NextFunction) => {
          (req as any).user = { id: "test-user-id", role: "ADMIN" };
          next();
        },
      );

      (checkRole as jest.Mock).mockImplementation(
        (role: string) => (req: Request, res: Response, next: NextFunction) => {
          next();
        },
      );

      const response = await request(app)
        .put(`/tasks/non-existent-task-id`)
        .set("Cookie", "token=test-token")
        .send({ title: "Updated Task", description: "Updated Description" });

      expect(response.status).toBe(404);
      expect(response.body.status).toBe(false);
      expect(response.body.msg).toBe("Task not found");
    });

    it("should return error if user is not authorized", async () => {
      (verifyAccessToken as jest.Mock).mockImplementation(
        (req: Request, res: Response, next: NextFunction) => {
          (req as any).user = { id: "test-user-id", role: "USER" };
          next();
        },
      );

      (checkRole as jest.Mock).mockImplementation(
        (role: string) => (req: Request, res: Response, next: NextFunction) => {
          res.status(403).json({ status: false, msg: "Forbidden" });
        },
      );

      const response = await request(app)
        .put(`/tasks/test-task-id`)
        .set("Cookie", "token=test-token")
        .send({ title: "Updated Task", description: "Updated Description" });

      expect(response.status).toBe(403);
      expect(response.body.status).toBe(false);
      expect(response.body.msg).toBe("Forbidden");
    });
  });
});
