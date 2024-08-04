import React from "react";
import Rate from "../types/Rate";

interface RateTableProps {
  data?: Rate[];
}

const RateTable: React.FC<RateTableProps> = ({ data }) => {
  return data ? (
    <table className="table">
      <thead>
        <tr>
          <th>Country</th>
          <th>Currency</th>
          <th>Amount</th>
          <th>Code</th>
          <th>Rate</th>
        </tr>
      </thead>
      <tbody>
        {data.map((rate, index) => (
          <tr key={index}>
            <td>{rate.country}</td>
            <td>{rate.currency}</td>
            <td align="right">{rate.amount}</td>
            <td>{rate.code}</td>
            <td>{rate.rate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div>Loading data...</div>
  );
};

export default RateTable;
