import { useState } from "react";
import styled from "styled-components";

interface ConvertFormProps {
  rates?: Rate[];
}

const Tip = styled.div`
  margin-top: 20px;
  text-align: center;
`;
const Output = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 1.5rem;
`;

const ConvertForm = ({ rates: rates }: ConvertFormProps) => {
  const [currency, setCurrency] = useState("");
  const [czkAmount, setCzkAmount] = useState(0.0);

  function convert(czkAmount: number, currency: string): number | null {
    if (isNaN(czkAmount) || czkAmount === null || !currency) {
      return null;
    }
    const rateObj: Rate | undefined = rates?.find((r) => r.code === currency);

    if (!rateObj || !rateObj.rate) {
      return null;
    }
    return (
      Math.round(
        ((czkAmount / rateObj.rate) * rateObj.amount + Number.EPSILON) * 100
      ) / 100
    );
  }

  const convertedAmount = convert(czkAmount, currency);

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="mb-3">
          <label htmlFor="currency" className="form-label">
            {" "}
            Currency{" "}
          </label>
          <select
            id="currency"
            className="form-select"
            aria-label="Select currency"
            onChange={(e) => setCurrency(e.target.value)}
            disabled={rates ? false : true}
          >
            <option value="">Select currency</option>
            {rates?.map((rate, index) => (
              <option
                key={rate.code}
                value={rate.code}
              >{`${rate.code} - ${rate.country} ${rate.currency}`}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="age" className="form-label">
            {" "}
            Amount CZK{" "}
          </label>
          <input
            id="age"
            type="number"
            className="form-control"
            onChange={(e) => {
              setCzkAmount(parseFloat(e.target.value));
            }}
          />
        </div>
      </form>

      {convertedAmount === null ? (
        <Tip>Please select currency and enter valid amount in CZK</Tip>
      ) : (
        <Output>{`${czkAmount} CZK = ${convertedAmount} ${currency}`}</Output>
      )}
    </>
  );
};

export default ConvertForm;
