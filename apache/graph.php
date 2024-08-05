<?php 
echo "
<div>
    <canvas id='myChart'></canvas>
</div>
<script src='https://cdn.jsdelivr.net/npm/chart.js'></script>
<script>
    const data = [
  { size: '2.55 bb', load_time: '0.61371' },
  { size: 20, load_time: '4' },
  { size: 30, load_time: '6' },                                            
  { size: 40, load_time: '8' },
  { size: 50, load_time: '10' },
];

const sizes = data.map(item => item.size);
const loadTimes = data.map(item => parseFloat(item.load_time));

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: sizes,
    datasets: [{
      label: 'Соотношение времени выполнения и размера файла',
      data: data.map(item => ({ x: item.size, y: parseFloat(item.load_time) })),
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Размер файла'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Время выполнения'
        }
      }
    }
  }
});


</script>";
?>