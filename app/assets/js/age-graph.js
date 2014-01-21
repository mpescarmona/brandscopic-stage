$('#age-graph').highcharts({
  chart: { type: 'bar' },
  title: { text: null },
  colors: ['#DFDFDF','#3E9CCF'],
  xAxis: {
      categories: ["21 \u2013 24","25 \u2013 34","35 \u2013 44","45 \u2013 54","55 \u2013 64"],
      title: {
          enabled: false
      },
      labels: {
        style: {color: '#3E9CCF', fontSize: '13px'}
      },
      tickLength: 0,
      lineWidth: 0
  },
  tooltip: {enabled: false},
  yAxis: {
      max: 100,
      labels: { enabled: false },
      title: {text: false},
      gridLineColor: 'transparent',
      enabled: false
  },
  plotOptions: {
      bar: {
          dataLabels: {
              enabled: false
          }
      },
      series: {
          stacking: 'percent',
          enableMouseTracking: false,
          pointPadding: 0,
          groupPadding: 0,
          borderWidth: 0,
          pointPadding: 0,
          pointWidth: 15,
          dataLabels: {
              color: '#3E9CCF',
              style: { fontSize: '11px' }
          }
      }
  },
  legend: { enabled: false },
  credits: { enabled: false },
  series: [{
      name: 'Fill in',
      data: [55,68,85,94,98],

  },{
      name: 'Values',
      data: [45,32,15,6,2],
      dataLabels: {
              enabled: true,
              format: '{y}%',
              color: '#3E9CCF',
              align: 'right',
              x: 30,
              y: -2,
              style: { color: '#3E9CCF' }
          }

  }]
});