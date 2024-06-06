import Chart from 'chart.js/auto'; //link to chart.js
let myChart = 0;
const jsHidden = document.querySelector('.js-hiden');
const chartBtnHide = document.querySelector('.chart--btn__show');
const hideChart = document.querySelector('.hidden_title');
const showChart = document.querySelector('.chart--btn');
const hideBtn = document.querySelector('.hidden_btn');
const viewChart = document.querySelector('.chart--view');
const ctx = document.querySelector('.myChart').getContext('2d');
chartBtnHide.addEventListener('click', onShowBox);
showChart.addEventListener('click', onShowBox);
hideChart.addEventListener('click', onHideBox);
hideBtn.addEventListener('click', onHideBox);

//This function is called when the user clicks on a button to show the chart.
//It adds the hidden class to the element with the class jsHidden and removes the hidden class from the element with the class viewChart, effectively displaying the chart.
function onShowBox(e) {
  jsHidden.classList.add('hidden');
  viewChart.classList.remove('hidden');
}
//This function is called when the user clicks on a button to hide the chart.
//It does the opposite of onShowBox(e), hiding the chart and displaying the hidden element.
function onHideBox(e) {
  viewChart.classList.add('hidden');
  jsHidden.classList.remove('hidden');
}

// Takes an array of objects as input (obj).
const processedData = obj => {
  const getDateTxt = data => new Date(data.dt * 1000).toDateString().slice(4);
  const proData = {
    data: obj.map(getDateTxt),
    temp: obj.map(elem => elem.temp.day),
    humidity: obj.map(elem => elem.humidity),
    speed: obj.map(elem => elem.wind_speed),
    pressure: obj.map(elem => elem.pressure),
  };
  return proData;
};

export default function runChart(data) {
  onHideBox();
  if (myChart) myChart.destroy();

  const dataToChart = processedData(data.slice(0, 5));
  chartRender(dataToChart, ctx);
}

// The function accepts an array of objects (ready data) and a link to the chart
function chartRender(labels, link) {
  const configChart = {
    type: 'line',
    data: {
      labels: labels.data,
      datasets: [
        createDataset('Temperature, C°', labels.temp, 'rgba(255, 107, 9, 1)'),
        createDataset('Humidity, %', labels.humidity, 'rgba(9, 6, 235, 1)'),
        createDataset('Wind Speed, m/s', labels.speed, 'rgba(234, 154, 5, 1)'),
        createDataset(
          'Atmosphere Pressure, m/m',
          labels.pressure,
          'rgba(6, 120, 6, 1)'
        ),
      ],
    },
    options: {
      layout: {
        padding: { left: 0, bottom: 20 },
      },
      plugins: {
        legend: {
          display: true,
          align: 'start',
          labels: {
            boxWidth: 15,
            boxHeight: 12,
            defaultFontColor: 'rgb(5, 120, 6)',
            color: 'rgba(247, 242, 242, 1)',
            padding: 10,
          },
          onClick: toggleLegend,
        },
        title: { display: false },
      },
      scales: {
        x: createScaleConfig(),
        y: createScaleConfig(),
      },
      responsive: true,
      maintainAspectRatio: false,
      devicePixelRatio: 2,
    },
  };

  myChart = new Chart(link, configChart);
}

function createDataset(label, data, color) {
  return {
    label: '— ' + label + resize(),
    data,
    tension: 0.2,
    fill: false,
    backgroundColor: color,
    borderColor: color,
    borderWidth: 1,
  };
}

function createScaleConfig() {
  return {
    grid: {
      color: 'rgba(255, 255, 255, 0.4)',
      borderColor: 'rgba(255, 255, 255, 1)',
    },
    ticks: { padding: 18, color: 'rgba(255, 255, 255, 0.7)' },
  };
}

function toggleLegend(e, legendItem) {
  const index = legendItem.datasetIndex;
  const chart = this.chart;
  const meta = chart.getDatasetMeta(index);
  meta.hidden =
    meta.hidden === null ? !chart.data.datasets[index].hidden : null;
  chart.update();
}

function resize() {
  if (window.outerWidth <= 767) {
    return '                                       ';
  } else {
    return '';
  }
}

export {
  jsHidden,
  chartBtnHide,
  hideChart,
  showChart,
  hideBtn,
  viewChart,
  ctx,
  onShowBox,
  onHideBox,
  processedData,
  chartRender,
  resize,
};
