import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import UnderConstruction from "@/components/UnderConstruction";

describe("UnderConstruction", () => {
  it("renders the placeholder text", () => {
    render(<UnderConstruction />);

    expect(screen.getByText("Under Construction")).toBeInTheDocument();
    expect(
      screen.getByText("Diese Seite wird gerade erstellt.")
    ).toBeInTheDocument();
  });
});
