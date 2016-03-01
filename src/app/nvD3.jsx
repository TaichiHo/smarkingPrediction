/**
 * Created by Taichi1 on 2/24/16.
 */

const React = require('react');
const {Paper} = require('material-ui');

import scriptLoader from 'react-async-script-loader'
var moment = require('moment');
var d3 = require('d3');


class NvD3Panel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actualOccupancy: []
        }
    }


    componentWillReceiveProps({ isScriptLoaded, isScriptLoadSucceed, actual }) {
        if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
            if (isScriptLoadSucceed) {
                this.setState({
                    isScriptLoaded: true,
                    isScriptLoadSucceed: true
                });
            }
            else this.props.onError()
        }

        // received new props from parent, should be the uploaded document
        var component = this;
        if (actual)
            d3.csv(actual.preview, function (error, data) {
                if (error) throw error;

                component.setState({
                    actualOccupancy: data
                });
            });
    }

    componentDidMount() {
        const { isScriptLoaded, isScriptLoadSucceed } = this.props;
        if (isScriptLoaded && isScriptLoadSucceed) {

            this.setState({
                isScriptLoaded: true,
                isScriptLoadSucceed: true
            });
        }
        this.setState({
            isScriptLoaded: false,
            isScriptLoadSucceed: false
        });
        var component = this;
        d3.csv("/predictions.csv", function (error, data) {
            if (error) throw error;

            component.setState({
                predictions: data
            });
        });
    }

    render() {

        if (!this.state || !this.state.isScriptLoadSucceed) {
            return <div></div>;
        }
        var predictionValues = this.state.predictions.filter((el) => {
            return moment(new Date(el.time)).format('MMMM Do YYYY') ===
                moment(this.props.date).format('MMMM Do YYYY');
        });

        predictionValues = predictionValues.map((el)=> {
            return {
                time: moment(new Date(el.time)).format('MMMM Do YYYY h a'),
                occupancy: el.occupancy
            }
        });


        var actualValues = this.state.actualOccupancy.filter((el) => {
            //console.log(moment(new Date(el.time)).format('MMMM Do YYYY')
            //    + " " + moment(this.props.date).format('MMMM Do YYYY'));

            return moment(new Date(el.hour)).format('MMMM Do YYYY') ===
                moment(this.props.date).format('MMMM Do YYYY');
        });


        actualValues = actualValues.map((el)=> {
            return {
                time: moment(new Date(el.hour)).format('MMMM Do YYYY h a'),
                occupancy: el.occupancy
            }
        });
        //console.log(actualValues);

        var squareError = predictionValues.reduce((prev, el, index, arr) => {
            //console.log(index);
            //console.log(prev, el, index);
            //console.log(actualValues[index]);
            //console.log(el);
            if (actualValues.length == 0 || !actualValues[index]) {
                return prev;
            }
            if (el.time != actualValues[index].time) {
                return prev;
            }
            return prev + Math.pow(el.occupancy - actualValues[index].occupancy, 2);
        }, 0);

        var rmse = actualValues.length == 0 ? 0 : Math.sqrt(squareError / actualValues.length).toFixed(2);

        var datum = [{
            key: "Prediction",
            //values: this.state.predictions
            values: predictionValues
        }
        ];
        if (actualValues.length > 0) {
            datum.push(
                {
                    key: "Actual Occupancy",
                    values: actualValues
                }
            );
        }

        var paperStyle = {
            textAlign: 'center',
            width: 250,
            lineHeight: "50px",
            margin: "0 auto",
            display: 'block'
        };
        var showError = !(squareError == 0);


        return (
            <div>
                {
                    showError ?
                        <Paper style={paperStyle} zDepth={2}>
                            Prediction Error<sup>*</sup>: {rmse}
                        </Paper> : ""

                }
                <NVD3Chart id="multiBarChart" type="multiBarChart" margin={{left:100, right:100}}
                           height={600}
                           showValues="true" datum={datum} x="time" y="occupancy"
                           containStyle={{height:500}}
                           xAxis={{axisLabel: 'Hour'}} yAxis={{axisLabel:'Occupancy'}}
                           configure={this.configureChart.bind(this)}
                />
                {showError ? <div style={{fontSize:12, marginLeft:"100"}}>
                    <sup>*</sup>Calculation of prediction error: Math.sqrt(sum((prediction - actual) ^ 2) /
                    lengthOfPredictionPair)</div> : ""}
            </div>);
    }

    configureChart(chart) {
        chart.yAxis
            .tickFormat(d3.format(',f'));
        chart.forceY([0, 2500]);
    }

}

NvD3Panel.propTypes = {
    actual: React.PropTypes.instanceOf(File),
    date: React.PropTypes.instanceOf(Date),
    onError: React.PropTypes.func.isRequired
};


export default scriptLoader(
    'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js',
    "https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.1/nv.d3.min.js",
    "/dist/react-nvd3.js"
)(NvD3Panel);
