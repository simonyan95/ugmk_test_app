import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const MainPage = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");
  const barRefs = []

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3001/products');
      const data = await response.json();
      setData(data);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData = data.sort((a, b) => {
    const dateA = new Date(`${a.year}-${a.month}-01`);
    const dateB = new Date(`${b.year}-${b.month}-01`);

    if (dateA < dateB) {
      return -1;
    }

    if (dateA > dateB) {
      return 1;
    }

    return 0;
  });

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleBarClick = (data, index) => {
    const dataKey = barRefs[index].props.dataKey;
    const factoryId = dataKey.slice("factory".length, dataKey.indexOf("_"))
    const month = data.month;

    window.location.href = `http://localhost:3000/details/${factoryId}/${month}`;
  };

  const getBars = () => {
    switch (filter) {
      case 'product1':
        return (
          <>
            <Bar dataKey="factory1_product1" name="Фабрика 1" fill="#8884d8" onClick={(e) => handleBarClick(e, 0)} ref={(ref) => barRefs[0] = ref} />
            <Bar dataKey="factory2_product1" name="Фабрика 2" fill="#82ca9d" onClick={(e) => handleBarClick(e, 1)} ref={(ref) => barRefs[1] = ref} />
          </>
        );
      case 'product2':
        return (
          <>
            <Bar dataKey="factory1_product2" name="Фабрика 1" fill="#8884d8" onClick={(e) => handleBarClick(e, 0)} ref={(ref) => barRefs[0] = ref} />
            <Bar dataKey="factory2_product2" name="Фабрика 2" fill="#82ca9d" onClick={(e) => handleBarClick(e, 1)} ref={(ref) => barRefs[1] = ref} />
          </>
        );
      default:
        return (
          <>
            <Bar dataKey="factory1_product1" name="Фабрика 1 - Продукт 1" fill="#8884d8" onClick={(e) => handleBarClick(e, 0)} ref={(ref) => barRefs[0] = ref} />
            <Bar dataKey="factory2_product1" name="Фабрика 2 - Продукт 1" fill="#82ca9d" onClick={(e) => handleBarClick(e, 1)} ref={(ref) => barRefs[1] = ref} />
            <Bar dataKey="factory1_product2" name="Фабрика 1 - Продукт 2" fill="#FFD700" onClick={(e) => handleBarClick(e, 0)} ref={(ref) => barRefs[0] = ref} />
            <Bar dataKey="factory2_product2" name="Фабрика 2 - Продукт 2" fill="#FF7F50" onClick={(e) => handleBarClick(e, 1)} ref={(ref) => barRefs[1] = ref} />
          </>
        );
    }
  };

  const getMaxY = () => {
    let max = 0;

    chartData.forEach((item) => {
      for (const key in item) {
        max = Math.max(max, item[key]);
      }
    });

    return max;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: "100vh",
        gap: "20px"
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'right',
          justifyContent: 'right',
          gap: "50px",
          width: Math.min(window.innerWidth, 1400),
          borderRadius: "15px",
          border: "1px solid black",
          padding: "15px",
        }}
      >
        <strong style={{ display: 'flex', alignItems: "center" }}>Фильтр по типу продукции</strong>
        <Select value={filter} onChange={handleFilterChange}>
          <MenuItem value="all">Все продукты</MenuItem>
          <MenuItem value="product1">Продукт 1</MenuItem>
          <MenuItem value="product2">Продукт 2</MenuItem>
        </Select>
      </div>

      <div style={{ borderRadius: "15px", border: "1px solid black", padding: "15px" }}>
        <BarChart
          width={Math.min(window.innerWidth, 1400)}
          height={Math.min(window.innerHeight, 500)}
          data={chartData}
          margin={{
            top: 0,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month_name" isDuplicated={false} interval={1} />
          <YAxis domain={[0, getMaxY()]} />
          <Tooltip />
          <Legend />
          {getBars()}
        </BarChart>
      </div>
    </div>
  );
};

export default MainPage