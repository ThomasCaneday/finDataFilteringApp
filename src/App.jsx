import { useState } from 'react'
import React from 'react'
import './App.css'
import { useEffect } from 'react'

// Get free API key from https://site.financialmodelingprep.com/developer/docs#income-statements-financial-statements
// Enter free API key below (keys change every day)
const apiKey = import.meta.env.VITE_API_KEY;
const API = apiKey;

function App() {
  // Raw data and filtered data
  const [info, setInfo] = useState([])
  const [filteredInfo, setFilteredInfo] = useState([])
  // Ranges
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [minRev, setMinRev] = useState("")
  const [maxRev, setMaxRev] = useState("")
  const [minNetIncome, setMinNetIncome] = useState("")
  const [maxNetIncome, setMaxNetIncome] = useState("")

  // Primary data fetch from API
  const getData = async () => {
    try {
      const result = await fetch(API)
      const data = await result.json()

      const filteredData = data.map(item => ({
        date: item.date,
        revenue: item.revenue,
        netIncome: item.netIncome,
        grossProfit: item.grossProfit,
        eps: item.eps,
        operatingIncome: item.operatingIncome,
      }))
      // Info may be unnecessary for future iterations
      setInfo(filteredData)
      setFilteredInfo(filteredData)
    } catch(error) {
      console.error("Error fetching data: ", error)
    }
  }

  // Filter Functions (Date, Revenue, Net Income)
  const filterDate = (filtered) => {
    if (!startDate && !endDate) {
      alert("Please enter at least a start date or an end date.");
      return;
    }
  
    // Parse start and end dates if provided
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
  
    // Validate parsed dates
    if ((startDate && isNaN(start.getTime())) || (endDate && isNaN(end.getTime()))) {
      alert("Invalid start or end date. Please enter valid dates.");
      return;
    }
  
    // Apply the filter
    const newFiltered = filtered.filter(item => {
      const itemDate = new Date(item.date);
  
      // Ensure itemDate is a valid date
      if (isNaN(itemDate.getTime())) {
        console.warn(`Invalid date found in item: ${item.date}`);
        return false;
      }
  
      // Apply conditions based on provided dates
      if (start && end) {
        return itemDate >= start && itemDate <= end;
      } else if (start) {
        return itemDate >= start;
      } else if (end) {
        return itemDate <= end;
      }
  
      // If neither start nor end is valid, include all (fallback, shouldn't hit this)
      return true;
    });
  
    setFilteredInfo(newFiltered);
  };    
  

  const filterRev = (filtered) => {
    if (!minRev && !maxRev) {
      alert("Please enter either a minimum revenue or a maximum revenue.");
      return;
    }
  
    const min = minRev ? parseInt(minRev, 10) : Number.NEGATIVE_INFINITY;
    const max = maxRev ? parseInt(maxRev, 10) : Number.POSITIVE_INFINITY;
  
    const newFiltered = filtered.filter(item => {
      const itemRevenue = parseInt(item.revenue, 10);
      return itemRevenue >= min && itemRevenue <= max;
    });
  
    setFilteredInfo(newFiltered);
  };
  

  const filterNetIncome = (filtered) => {
    if (!minNetIncome && !maxNetIncome) {
      alert("Please enter either a minimum net income or a maximum net income.");
      return;
    }
  
    const min = minNetIncome ? parseInt(minNetIncome, 10) : Number.NEGATIVE_INFINITY;
    const max = maxNetIncome ? parseInt(maxNetIncome, 10) : Number.POSITIVE_INFINITY;
  
    const newFiltered = filtered.filter(item => {
      const itemNetIncome = parseInt(item.netIncome, 10);
      return itemNetIncome >= min && itemNetIncome <= max;
    });
  
    setFilteredInfo(newFiltered);
  };
  

  // "Parent" Filter Function (might benefit from method overloading)
  const applyFilters = () => {
    let filtered = [...filteredInfo];
    if (startDate && endDate) {
      filterDate(filtered);
    }
    if (minRev || maxRev) {
      filterRev(filtered);
    }
    if (minNetIncome || maxNetIncome) {
      filterNetIncome(filtered);
    }
  }

  // Extra Reset Filter Function for Error Recovery Design Principle
  const resetFilters = () => {
    setFilteredInfo(info);
    setStartDate("");
    setEndDate("");
    setMinRev("");
    setMaxRev("");
    setMinNetIncome("");
    setMaxNetIncome("");
  }

  // Sort Functions (Date, Revenue, Net Income)
  const sortDate = (isAscending) => {
    const sorted = [...filteredInfo].sort((a,b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (isAscending) {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
    setFilteredInfo(sorted);
  }

  const sortRev = (isAscending) => {
    const sorted = [...filteredInfo].sort((a,b) => {
      const revenueA = parseInt(a.revenue);
      const revenueB = parseInt(b.revenue);

      if (isAscending) {
        return revenueA - revenueB;
      } else {
        return revenueB - revenueA;
      }
    });
    setFilteredInfo(sorted);
  }

  const sortNetIncome = (isAscending) => {
    const sorted = [...filteredInfo].sort((a,b) => {
      const netIncomeA = parseInt(a.netIncome);
      const netIncomeB = parseInt(b.netIncome);

      if (isAscending) {
        return netIncomeA - netIncomeB;
      } else {
        return netIncomeB - netIncomeA;
      }
    });
    setFilteredInfo(sorted);
  }

  // Converted to using useEffect to automatically fetch API instead of using a button and pre tag
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className='bg-white text-navy-blue min-h-screen p-4 m-4 max-sm:m-0 max-sm:p-0'>
      <header className='text-center text-2xl font-semibold mb-6'>
        AAPL Income Statements
      </header>

      {/* Filters */}
      <h1 className='mt-4 text-center text-2xl'>Filter By</h1>
      <div className='space-y-4'>
        {/* Filter Date */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <label className='block text-md font-medium mb-1'>
              Start Date:
              <input
                className='bg-gray-200 border border-gray-300 p-2 rounded w-full'
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                >
              </input>
            </label>
          </div>
          <div>
          <label className='block text-md font-medium mb-1'>
            End Date:
            <input
              className='bg-gray-200 border border-gray-300 p-2 rounded w-full'
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              >
            </input>
          </label>
          </div>
        </div>

        {/* Filter Revenue */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <label className='block text-md font-medium mb-1'>
              Minimum Revenue (include zeroes):
              <input
                className='bg-gray-200 border border-gray-300 p-2 rounded w-full'
                type="revenue"
                value={minRev}
                onChange={(e) => setMinRev(e.target.value)}
                >
              </input>
            </label>
          </div>
          <div>
            <label className='block text-md font-medium mb-1'>
              Maximum Revenue (include zeroes):
              <input
                className='bg-gray-200 border border-gray-300 p-2 rounded w-full'
                type="revenue"
                value={maxRev}
                onChange={(e) => setMaxRev(e.target.value)}
                >
              </input>
            </label>
          </div>
        </div>

        {/* Filter Net Income */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <label className='block text-md font-medium mb-1'>
              Minimum Net Income (include zeroes):
              <input
                className='bg-gray-200 border border-gray-300 p-2 rounded w-full'
                type="netIncome"
                value={minNetIncome}
                onChange={(e) => setMinNetIncome(e.target.value)}
                >
              </input>
            </label>
          </div>
          <div>
            <label className='block text-md font-medium mb-1'>
              Maximum Net Income (include zeroes):
              <input
                className='bg-gray-200 border border-gray-300 p-2 rounded w-full'
                type="netIncome"
                value={maxNetIncome}
                onChange={(e) => setMaxNetIncome(e.target.value)}
                >
              </input>
            </label>
          </div>
        </div>
      </div>
      

      {/* Apply & Reset Filters */}
      <div className='flex flex-wrap gap-2 mt-6 justify-center'>
        <button
          className='bg-navy-blue text-white px-4 py-2 rounded shadow hover:bg-blue-800 transition' 
          onClick={applyFilters}>Apply Filters</button>
        <button 
          className='bg-navy-blue text-white px-4 py-2 rounded shadow hover:bg-blue-800 transition'
          onClick={resetFilters}>Reset Filters</button>
      </div>

      {/* Sort Buttons */}
      <h1 className='mt-4 text-center text-2xl'>Sort By</h1>
      <div className='mt-4 flex flex-wrap gap-2 justify-center'>
        <button 
          className='bg-blue-100 text-navy-blue px-4 py-2 rounded shadow hover:bg-blue-200 transition'
          title="Date Ascending"
          onClick={() => sortDate(true)}>Date &uarr;</button>
        <button 
          className='bg-blue-100 text-navy-blue px-4 py-2 rounded shadow hover:bg-blue-200 transition'
          title="Date Descending"
          onClick={() => sortDate(false)}>Date &darr;</button>
        <button 
          className='bg-blue-100 text-navy-blue px-4 py-2 rounded shadow hover:bg-blue-200 transition'
          title="Revenue Ascending"
          onClick={() => sortRev(true)}>Revenue &uarr;</button>
        <button 
          className='bg-blue-100 text-navy-blue px-4 py-2 rounded shadow hover:bg-blue-200 transition'
          title="Revenue Descending"
          onClick={() => sortRev(false)}>Revenue &darr;</button>
        <button 
          className='bg-blue-100 text-navy-blue px-4 py-2 rounded shadow hover:bg-blue-200 transition'
          title="Net Income Ascending"
          onClick={() => sortNetIncome(true)}>Net Income &uarr;</button>
        <button 
          className='bg-blue-100 text-navy-blue px-4 py-2 rounded shadow hover:bg-blue-200 transition'
          title="Net Income Descending"
          onClick={() => sortNetIncome(false)}>Net Income &darr;</button>
      </div>

      {/* Display Formatted Data */}
      <div className='mt-6'>
        <div className='overflow-auto bg-white rounded shadow'>
          <table className='table-auto w-full border-collapse border border-gray-300'>
            <thead className='bg-gray-100 border-b border-gray-300'>
              <tr>
                <th className='px-4 py-2 text-left text-sm text-gray-600'>Date</th>
                <th className='px-4 py-2 text-left text-sm text-gray-600'>Revenue ($MM)</th>
                <th className='px-4 py-2 text-left text-sm text-gray-600'>Net Income ($MM)</th>
                <th className='px-4 py-2 text-left text-sm text-gray-600'>Gross Profit ($MM)</th>
                <th className='px-4 py-2 text-left text-sm text-gray-600'>EPS</th>
                <th className='px-4 py-2 text-left text-sm text-gray-600'>Operating Income ($MM)</th>
              </tr>
            </thead>
            <tbody>
              {filteredInfo.map((item, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className='px-4 py-2 text-sm text-gray-700'>{item.date}</td>
                  <td className='px-4 py-2 text-sm text-gray-700'>{(item.revenue / 1000000)?.toLocaleString()}</td>
                  <td className='px-4 py-2 text-sm text-gray-700'>{(item.netIncome / 1000000)?.toLocaleString()}</td>
                  <td className='px-4 py-2 text-sm text-gray-700'>{(item.grossProfit / 1000000)?.toLocaleString()}</td>
                  <td className='px-4 py-2 text-sm text-gray-700'>{item.eps}</td>
                  <td className='px-4 py-2 text-sm text-gray-700'>{(item.operatingIncome / 1000000)?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App