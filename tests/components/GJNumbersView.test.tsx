import { render, screen } from "@testing-library/react";
import GJNumbersView from "@/components/GJNumbersView";
import '@testing-library/jest-dom'

describe("GJNumbersView", () => {
  const mockData = [
    { description: "Open", number: "12345" },
    { description: "High", number: "67890" },
    { description: "Low", number: "54321" },
  ];

  it("renders the title correctly", () => {
    const title = "Trading Pair Details";
    render(<GJNumbersView title={title} data={mockData} />);

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it("renders the correct number of GJNumberLabel components", () => {
    render(<GJNumbersView title="Trading Pair Details" data={mockData} />);

    const numberLabels = screen.getAllByText(/Open|High|Low/);
    expect(numberLabels).toHaveLength(mockData.length);
  });

  it("renders the descriptions and numbers correctly", () => {
    render(<GJNumbersView title="Trading Pair Details" data={mockData} />);

    mockData.forEach(({ description, number }) => {
      expect(screen.getByText(`${description}: ${number}`)).toBeInTheDocument();
    });
  });
});
