/**
 * Created by Taichi1 on 2/24/16.
 */

const React = require('react');
const d3 = require('d3');
import scriptLoader from 'react-async-script-loader'


class NvD3Panel extends React.Component {
    constructor(props) {
        super(props);
    }


    componentWillReceiveProps({ isScriptLoaded, isScriptLoadSucceed }) {
        if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
            if (isScriptLoadSucceed) {
                console.log("successOnLoading");
                this.setState({
                    isScriptLoaded: true,
                    isScriptLoadSucceed: true
                });
            }
            else this.props.onError()
        }
    }

    componentDidMount() {
        const { isScriptLoaded, isScriptLoadSucceed } = this.props;
        if (isScriptLoaded && isScriptLoadSucceed) {

            this.setState({
                isScriptLoaded: true,
                isScriptLoadSucceed: true
            });
            console.log("didMount successOnLoading");
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
        d3.csv("/actualOccupancy.csv", function (error, data) {
            if (error) throw error;

            component.setState({
                actualOccupancy: data
            });
        });

    }

    render() {
        console.log("nv d3 rendering");

        if (!this.state || !this.state.isScriptLoadSucceed) {
            return <div></div>;
        }
        var datum = [{
            key: "Prediction",
            values: this.state.predictions
        }
        ];
        if (this.state.actualOccupancy) {
            datum.push(
                {
                    key: "Actual Occupancy",
                    values: this.state.actualOccupancy
                }
            )
        }
        return (
            <NVD3Chart id="multiBarChart" type="multiBarChart" datum={datum} x="time" y="occupancy"/>);
    }
}

export default scriptLoader(
    'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js',
    "https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.1/nv.d3.min.js",
    "/dist/react-nvd3.js"
    //'http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js'
)(NvD3Panel);

//export default D3Panel;