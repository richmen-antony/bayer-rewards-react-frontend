import React , {Component } from 'react';

import AUX from "../../hoc/Aux_";
import Chart from "react-apexcharts";

type Props={

}

type States={
  options: object;
  series: Array<any>;
}

class Bar extends Component<Props, States>{
    constructor(props: any) {
        super(props);
        this.state={
          options: {
           legend: {
             position: 'top',
             horizontalAlign: 'right'
           },
            colors : ['#003a57', '#4dc9ff'],
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
                columnWidth: "40%",
                barHeight: "10%"
              }
            },
            stroke: {
              width: [8, 0, 0]
            },
            xaxis: {
              categories: ["Corn", "Rice", "Insecticides", "Insecticides", "Herbicides", "Herbicides", "Fungicides", "Fungicides"]
            },
            yaxis: {
              tickAmount: 3,
              min: 100,
              max: 400,
            },
          },
          series: [
            {
              name: "Target",
              type: "column",
              data: [380, 200, 380, 250, 380, 350, 380, 380]
            },
            {
              name: "Actuals",
              type: "column",
              data: [300, 200, 120, 120, 120, 200, 250, 350]
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
              type="line"
              width="100%"
              height="auto"
              />
            </div>
            </AUX>
        );
    }
}
export default Bar;