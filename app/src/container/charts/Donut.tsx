import React , {Component } from 'react';
import AUX from "../../hoc/Aux_";
import Chart from "react-apexcharts";
import { truncate } from 'node:fs';

type Props={

}

type States={
  options: object;
  series: any;
  labels: any;
}

class Donut extends Component<Props, States>{
    constructor(props: any) {
        super(props);
        this.state={
          options:{
            fill: {
              colors: ['#0bd750', '#4f7bf9', '#4dc9ff']
            },
            legend: {
              show: true,
              position: 'right',
              top: '50px',
              right: '42px',
              horizontalAlign: 'center', 
              floating: false,
              fontSize: '14px',
              fontFamily: 'Helvetica, Arial',
              fontWeight: 400,
              offsetX: 0,
              offsetY: 0
            },

          //   stroke: {
          //     show: true,
          //     curve: 'smooth',
          //     lineCap: 'butt',
          //     colors: undefined,
          //     width: 10,
          //     dashArray: 0,      
          // },
            plotOptions: {
              pie: {
                customScale: 1,
                size: 200,
                donut: {
                  labels: {
                    show: true,
                    // name: {
                    //   show: true,
                    // },
                    // value: {
                    //   show: true,
                    // },
                    total: {
                      show: true,
                      label: '25620',
                      formatter: () => 'Scans',
                      // formatter: function (w) {
                      //   return w.globals.seriesTotals.reduce((a, b) => {
                      //     return a + b
                      //   }, 0)
                      // }
                    }
                  }
                }
              },
              dataLabels: {
                show: false,
                enabled: false,
                // formatter: function (val: any) {
                //   return val + "%"
                // },
              },
            //   responsive: [{
            //     breakpoint: 480,
            //     options: {
            //         chart: {
            //             width: 200
            //         },
            //         legend: {
            //             position: 'bottom'
            //         }
            //     }
            // }]
            }
          },
          series: [44, 55, 41],
          labels: ['Send Goods', 'Receive Goods', 'Sell to Farmer'],
        }
    }

    render(){
        return(
          <AUX>
            <div>
              <Chart
                options={this.state.options}
                series={this.state.series}
                type="donut"
                width="300"
                />
            </div>
            </AUX>
        );
    }
}
export default Donut;