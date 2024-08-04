import { fireEvent, render, screen } from "@testing-library/react";
import ConvertForm from "../../components/ConvertForm";
import Rate from "../../types/Rate";
import "@testing-library/jest-dom";

const mockRates: Rate[] = [
  {
    country: "United States",
    currency: "dollar",
    amount: 1,
    code: "USD",
    rate: 23.317,
  },
  { country: "Eurozone", currency: "euro", amount: 1, code: "EUR", rate: 25.0 },
];

const tipRegex = /please select currency and enter valid amount in czk/i;

describe("ConvertForm", () => {
  test("before data loaded form disabled and tip displayed", () => {
    render(<ConvertForm rates={undefined} />);
    const currencySelect = screen.getByLabelText(/Currency/);
    expect(currencySelect).toBeInTheDocument();
    expect(currencySelect).toBeDisabled();
    const amountInput = screen.getByLabelText(/Amount CZK/);
    expect(amountInput).toBeInTheDocument();
    const tip = screen.getByText(tipRegex);
    expect(tip).toBeInTheDocument();
  });

  test("on valid values result displayed", () => {
    render(<ConvertForm rates={mockRates} />);

    const currencySelect = screen.getByLabelText(/Currency/);
    expect(currencySelect.childNodes.length).toBe(3);
    expect(currencySelect).not.toBeDisabled();
    const amountInput = screen.getByLabelText(/Amount CZK/);

    let tip = screen.getByText(tipRegex);
    expect(tip).toBeInTheDocument();

    // Select a currency and CZK amount
    fireEvent.change(currencySelect, { target: { value: "USD" } });
    fireEvent.change(amountInput, { target: { value: 233.17 } });

    // converted amount is displayed
    const output = screen.getByText(/233.17 CZK = 10 USD/i);
    expect(output).toBeInTheDocument();
    expect(screen.queryByText(tipRegex)).toBeNull();

    // invalid value -> tip displayed
    fireEvent.change(amountInput, { target: { value: "-" } });
    tip = screen.getByText(tipRegex);
    expect(tip).toBeInTheDocument();
  });
});
