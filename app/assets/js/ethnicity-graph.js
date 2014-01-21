$('#ethnicity-graph').highcharts({
      colors: ['#347a99','#218ebf', '#41AAD8', '#6ebde7', '#94d6ed'],
      chart: {
          type: 'pie'
      },
      title: { text: null },
      credits: { enabled: false },
      yAxis: {
          title: { text: null }
      },
      plotOptions: {
          pie: {
              shadow: false
          },
          series: {
            enableMouseTracking: false,
            dataLabels: {
              connectorColor: '#C0C0C0',
              softConnector: false
            }
          }
      },
      tooltip: {
          enabled: false
      },
      series: [{
          name: 'Ethnicity',
          data: [["ASIAN",5],["BLACK / AFRICAN AMERICAN",9],["HISPANIC / LATINO",22],["NATIVE AMERICAN",0],["WHITE",63]],
          size: '60%',
          innerSize: '30%',
          distance: -10,
          dataLabels: {
              crop: false,
              formatter: function() {
                  // display only if larger than 1
                  return '<span style="font-size:16px;">'+ this.y +'%' +'</span><br /><div style="width: 50px;font-size:11px;">'+ this.point.name+'</div>';
              },
              color: '#3E9CCF',
          }
      }]
});