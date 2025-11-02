import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "./components/ui/toaster";
import { toast } from "./hooks/use-toast";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Charts from "./pages/Charts";
import Tips from "./pages/Tips";
import { mockExpenses } from "./mock";

function App() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    // Load expenses from localStorage or use mock data
    const saved = localStorage.getItem('lekhaJokha-expenses');
    if (saved) {
      setExpenses(JSON.parse(saved));
    } else {
      setExpenses(mockExpenses);
      localStorage.setItem('lekhaJokha-expenses', JSON.stringify(mockExpenses));
    }
  }, []);

  const handleExportCSV = () => {
    try {
      const headers = ['Date', 'Category', 'Amount (₨)', 'Description'];
      const csvData = expenses.map(exp => [
        exp.date,
        exp.category,
        exp.amount,
        exp.description || '-'
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `lekha-jokha-expenses-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful!",
        description: `${expenses.length} expenses exported to CSV.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your expenses.",
        variant: "destructive"
      });
    }
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
