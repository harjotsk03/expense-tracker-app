import { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import styled from 'styled-components';
import { useGetTransactions } from "../hooks/useGetTransactinos";

const ChartContainer = styled.div`
  width: 35vw;
  height: 400px;
  border-radius: 30px;
  overflow: hidden; 
  fontSize: 3vw;
`;

export const options = {
  fontName: 'mainSemi',
  display: 'block',
  title: 'Your Expenses',
  fontSize: 15, // Set the font size
  chartArea: {
    width: "100%",
    height: '70%',
    display: 'block',
  },
  colors: ["#455F7D", "#ebcb92"], // Specify different colors for Income and Expenses
  hAxis: {
    title: "Date",
    FontFace: 'main',
    minValue: 0,
  },
  vAxis: {
    title: "Amount ($)",
    FontFace: 'main',
  },
  legend: { position: 'bottom' },
  title: { position: 'top'}
};


export function BarChart() {
  const { transactions } = useGetTransactions();

  // Log transactions to check its structure and contents
  console.log("Transactions:", transactions);

  // Initialize variables to hold income and expenses
  let income = 0;
  let expenses = 0;

  // Calculate total income and total expenses from transactions
  transactions.forEach(transaction => {
    console.log("Transaction amount:", transaction.trnasactionAmount); // Log transaction amount
    if (transaction.transactionType === 'income') {
      income += transaction.trnasactionAmount; // Fix typo here, change 'transaction.amount' to 'transaction.trnasactionAmount'
    } else if (transaction.transactionType === 'expense') {
      expenses += transaction.trnasactionAmount;
    }
  });

  // Log calculated income and expenses
  console.log("Income:", income);
  console.log("Expenses:", expenses);

  // Construct data array with consistent data types
  const data = [
    ["Income", "Expenses"],
    ["Income", income],
    ["Expenses", expenses]
  ];

  return (
    <div className="chartContainer">
      <ChartContainer>
      {transactions.length === 0 ? (
        <div className='loadingContainer'>
          <p className='loader'></p>
        </div>
      ) : (
              <Chart
                chartType="PieChart"
                width="100%"
                height="100%"
                data={data}
                options={options}
              />
      )}
      </ChartContainer>
    </div>
  );
}
