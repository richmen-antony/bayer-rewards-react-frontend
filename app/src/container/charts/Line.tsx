import React , {Component } from 'react';

import AUX from "../../hoc/Aux_";
import Chart from "react-apexcharts";

type Props={

}

type States={
  options: object;
  series: Array<any>;
}

class Line extends Component<Props, States>{
    constructor(props: any) {
        super(props);
        this.state={
          options: {
           legend: {
             position: 'top',
             horizontalAlign: 'right'
           },
            colors : ['#4dc9ff'],
            chart: {
              id: "basic-bar",
              width: '100%',
              height: 'auto',
              toolbar: {
                show: false
              },
         
            },
            plotOptions: {
              bar: {
                columnWidth: "10%"
              }
            },
            stroke: {
              width: [8, 0, 0]
            },
            xaxis: {
              categories: ["Corn", "Rice", "Insecticides", "Insecticides"]
            },
            yaxis: {
                show: false,
            },
             axisBorder: {
                show: true
              },
              labels: {
                show: false
              },
              dataLabels: {
                show: false
              }
          },
          series: [
            {
              name: "Target",
              type: "column",
              data: [380, 200, 380, 250]
            }
          ],
        }
    }

    render(){
        return(
          <AUX>
            <div>
             <Chart
              options={this.state.options}
              series={this.state.series}
              type="bar"
              width="100%"
              height="auto"
              />
            </div>
            </AUX>
        );
    }
}
export default Line;