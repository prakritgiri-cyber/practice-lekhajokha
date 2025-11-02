import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Charts from "./pages/Charts";
import Tips from "./pages/Tips";
import { mockExpenses } from "./mock";

function App() {
  const handleExportCSV = () => {
    const headers = ['Date', 'Category', 'Amount', 'Description'];
    const csvData = mockExpenses.map(exp => [
      exp.date,
      exp.category,
      exp.amount,
      exp.description || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `lekha-jokha-expenses-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ThemeProvider>
      <div className="App">
        <BrowserRouter>
          <Header onExportCSV={handleExportCSV} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/tips" element={<Tips />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
