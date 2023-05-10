import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d'];
const MONTHS = [
  'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь',
];

const DetailsPage = () => {
  const { factoryId, month } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:3001/details/${factoryId}/${month}`);
      const data = await res.json();
      setData(data);
    };

    fetchData();
  }, [factoryId, month]);

  const chartData = [
    { name: 'totalProduct1', value: data?.totalProduct1 },
    { name: 'totalProduct2', value: data?.totalProduct2 },
  ];

  const total = chartData.reduce((acc, item) => acc + item.value, 0);
  const chartPercentages = chartData.map(item => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(2),
  }));

  const monthName = MONTHS[parseInt(month) - 1];

  const renderTooltip = ({ payload }) => payload.length ? (
    <div style={{ backgroundColor: 'white', padding: '5px', border: '1px solid black' }}>
      {payload[0].name}: {payload[0].value} ({payload[0].payload.percentage}%)
    </div>
  ) : null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <strong style={{ textAlign: 'center' }}>Статистика продукции для фабрики {factoryId} за {monthName}:</strong>

      {data && (
        <PieChart width={Math.min(window.innerWidth, 800)} height={Math.min(window.innerHeight, 500)}>
          <Pie
            data={chartPercentages}
            cx={Math.min(window.innerWidth, 800) / 2}
            cy={Math.min(window.innerHeight, 500) / 2}
            outerRadius={Math.min(window.innerWidth, 800) / 4}
            fill="#8884d8"
            dataKey="value"
            label={({ payload }) => `${payload.value} (${payload.percentage}%)`}
          >
            {chartPercentages.map((_, index) => (
              <Cell key={`cell-${index}`} name={`Продукт ${index + 1}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={renderTooltip} />
          <Legend />
        </PieChart>
      )}
    </div>
  );
};

export default DetailsPage;
