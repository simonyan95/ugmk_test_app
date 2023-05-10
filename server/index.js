const express = require('express');
const csvParse = require('csv-parse');
const cors = require('cors');
const fs = require('fs');

const PORT = 3001;
const MONTHS = {
  1: "Январь",
  2: "Февраль",
  3: "Март",
  4: "Апрель",
  5: "Май",
  6: "Июнь",
  7: "Июль",
  8: "Август",
  9: "Сентябрь",
  10: "Октябрь",
  11: "Ноябрь",
  12: "Декабрь"
};

const app = express();

app.use(cors());

const parseCsv = (filename) => {
  return new Promise((res, rej) => {
    fs.readFile(filename, (err, fileData) => {
      if (err) {
        rej(err);
        return;
      }

      csvParse.parse(fileData, { columns: true, trim: true }, (err, rows) => {
        if (err) {
          rej(err);
          return;
        }

        res(rows);
      });
    });
  })
}

let data = {};

(async () => {
  try {
    data = await parseCsv('products.csv');

    app.listen(PORT);
  } catch (e) {
    console.error({ error: e });
  }
})();

function getProductsByDate(factory_id, month) {
  let totalProduct1 = 0;
  let totalProduct2 = 0;

  data.forEach((item) => {
    const date = new Date(item.date);
    const itemMonth = date.getMonth() + 1;

    if (item.factory_id === factory_id && itemMonth === parseInt(month)) {
      totalProduct1 += parseInt(item.product1);
      totalProduct2 += parseInt(item.product2);
    }
  });

  return { totalProduct1, totalProduct2 };
}

function getProductsOfFactory(factoryData) {
  const summary = {};

  factoryData.forEach(item => {
    const date = new Date(item.date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (!isNaN(year) && !isNaN(month)) {
      const monthYear = `${year}-${month}`
      const factoryId = item.factory_id;

      if (!summary[factoryId]) {
        summary[factoryId] = {};
      }

      if (!summary[factoryId][monthYear]) {
        summary[factoryId][monthYear] = {
          month,
          year,
          product1: 0,
          product2: 0,
          month_name: MONTHS[month],
        };
      }

      summary[factoryId][monthYear].product1 += parseInt(item.product1);
      summary[factoryId][monthYear].product2 += parseInt(item.product2);
    }
  });

  const result = [];

  for (const factory_id in summary) {
    for (const date in summary[factory_id]) {
      const { product1, product2, month, year, month_name } = summary[factory_id][date];

      result.push({
        factory_id,
        date,
        month,
        year,
        month_name,
        [`factory${factory_id}_product1`]: product1,
        [`factory${factory_id}_product2`]: product2,
      });
    }
  }

  return result;
}

app.get('/products', (req, res) => {
  const { factory_id, month } = req.query;
  let filteredData = data;

  if (factory_id) {
    filteredData = filteredData.filter(item => item.factory_id === parseInt(factory_id));
  }

  if (month) {
    filteredData = filteredData.filter(item => {
      const date = new Date(item.date.split('/').reverse().join('-'));
      return (date.getMonth() + 1) === parseInt(month);
    });
  }

  res.json(getProductsOfFactory(filteredData));
});



app.get('/details/:factoryId/:month', (req, res) => {
  const { factoryId, month } = req.params;

  res.json(getProductsByDate(factoryId, month));
});