import React , {Component } from 'react';

import AUX from "../../hoc/Aux_";
import Chart from "react-apexcharts";

type Props={
}

type States={
  optionsRadial: object;
  seriesRadial: Array<any>;
}

class Radial extends Component<Props, States>{
    constructor(props: any) {
        super(props);
        this.state={
          optionsRadial: {
            plotOptions: {
              radialBar: {
                startAngle: 0,
                endAngle: 360,
                hollow: {
                   size: "70%",
                  background: "#fff",
                },
                // track: {
                //   background: "green",
                //   strokeWidth: "67%",
                //   margin: 0, // margin is in pixels
                //   dropShadow: {
                //     enabled: true,
                //     top: -3,
                //     left: 0,
                //     blur: 4,
                //     opacity: 0.35
                //   }
                // },
    
                dataLabels: {
                  // showOn: "always",
                  name: {
                    // offsetY: -20,
                    // show: true,
                    color: "black",
                    fontSize: "13px"
                  },
                  value: {
                    formatter: function (val: any) {
                      return val;
                    },
                    color: "black",
                    fontSize: "30px",
                    show: true
                  }
                }
              }
            },
            fill: {
              colors: ["#4f7bf9"],
              type: "gradient",
              // gradient: {
              //    type: "horizontal",
              //   shadeIntensity: 0.5,
              //   gradientToColors: ["black"],
              //   inverseColors: true,
              //   opacityFrom: 1,
              //   opacityTo: 1,
              //   stops: [0, 100]
              // }
            },
            stroke: {
              lineCap: "round"
            },
            labels: ["Progress"]
          },
          seriesRadial: [84],
        }
    }

    render(){
        return(
          <AUX>
            <div>
             <Chart
                options={this.state.optionsRadial}
                series={this.state.seriesRadial}
                type="radialBar"
                width="280"
                />
            </div>
            </AUX>
        );
    }
}
export default Radial;