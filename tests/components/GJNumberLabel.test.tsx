import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import GJNumberLabel from "@/components/GJNumberLabel";

test("renders number and description correctly", () => {
  render(<GJNumberLabel description="Price" number="$25,000" />);
  expect(screen.getByText("Price")).toBeInTheDocument();
  expect(screen.getByText("$25,000")).toBeInTheDocument();
});
