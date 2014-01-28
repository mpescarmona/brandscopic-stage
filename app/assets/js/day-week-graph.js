$('#trends-day-week-graph').highcharts({
    credits: { enabled: false },
    chart: {marginTop: 50 },
    title: {
        text: null
    },
    xAxis: {
        categories: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
        lineColor: '#D1D1D1',
        tickWidth: 0,
        labels: {
          style: {
            color: '#D1D1D1'
          }
        },
    },
    yAxis: [{
        title: {
            text: null
        },
        gridLineColor: 'transparent',
        lineWidth: 1,
        lineColor: '#D1D1D1',
        tickWidth: 1,
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }],
        labels: {
          style: {
            color: '#D1D1D1'
          }
        },
        min: 0,
        maxPadding: 0.2
    },{
        title: {
            text: null
        },
        gridLineColor: 'transparent',
        lineWidth: 1,
        lineColor: '#D1D1D1',
        tickWidth: 1,
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }],
        labels: {
          format: '${value}',
          style: {
            color: '#D1D1D1'
          }
        },
        opposite: true,
        min: 0,
        maxPadding: 0.2
    }],
    plotOptions: {
        series: {
            marker: {
                fillColor: '#FFFFFF',
                lineWidth: 2,
                lineColor: null, // inherit from series
                radius: 6,
                symbol: 'circle'
            }
        }
    },
    tooltip: {
        headerFormat: '',
        pointFormat: '{point.y}',
        borderWidth: 0,
        borderColor: '#FFF',
        backgroundColor: 'transparent',
        shadow: false,
        style: {
            fontSize: '14px'
        },
        positioner: function( labelWidth, labelHeight, point){
            return {
              x: point.plotX + this.chart.plotLeft - (labelWidth/2),
              y: point.plotY + this.chart.plotTop - labelHeight - 10
            };
        },
        formatter: function() {
            if (this.series.name =='Cost/Impression'){
              return '<span style="color:'+this.series.color+'">$'+this.y +'</span>';
            }else{
              return '<span style="color:'+this.series.color+'">'+this.y +'</span>';
            }
        }
    },
    legend: {
        floating: true,
        borderWidth: 0,
        y: -10,
        align: 'right',
        verticalAlign: 'top',
        itemStyle: { fontSize: '10px', color: '#3E9CCF' }
    },
    series: [
      {
        name: 'Impressions/promo hour',
        data: [9,12,4,19,131,19,30],
        color: '#3D9CCA'
      },
      {
        name: 'Cost/Impression',
        data: [1,3,1,2,4,1,0],
        color: '#94D6ED',
        yAxis: 1
      }
    ]
});