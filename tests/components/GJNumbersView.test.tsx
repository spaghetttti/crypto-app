import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import GJNumbersView from "@/components/GJNumbersView";

const mockData = [
  { description: "Price", number: "$25,000" },
  { description: "Quantity", number: "100" },
];

test("renders title and data correctly", () => {
  const title = "Financial Overview";

  render(<GJNumbersView title={title} data={mockData} />);

  expect(screen.getByText(title)).toBeInTheDocument();

  mockData.forEach(item => {
    expect(screen.getByText(item.description)).toBeInTheDocument();
    expect(screen.getByText(item.number)).toBeInTheDocument();
  });
});
