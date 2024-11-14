import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import LoginPage from "../../src/pages/Login";
import { MemoryRouter } from "react-router-dom";

describe("login page", () => {
  it("renders login page", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(
      screen.getByText("Enter your credentials to access your account"),
    ).toBeInTheDocument();
  });
});
