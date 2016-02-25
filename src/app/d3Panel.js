/**
 * Created by Taichi1 on 2/24/16.
 */

const React = require('react');
const d3 = require('d3');
import scriptLoader from 'react-async-script-loader'
const ReactFauxDOM = require('react-faux-dom');


class D3Panel extends React.Component {
    constructor(props) {
        super(props);
    }


    //componentWillReceiveProps({ isScriptLoaded, isScriptLoadSucceed }) {
    //if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
    //    if (isScriptLoadSucceed) {
    //        console.log("successOnLoading");
    //        this.setState({
    //            isScriptLoaded: true,
    //            isScriptLoadSucceed: true
    //        });
    //    }
    //    else this.props.onError()
    //}
    //}

    componentDidMount() {
        //const { isScriptLoaded, isScriptLoadSucceed } = this.props;
        //if (isScriptLoaded && isScriptLoadSucceed) {
        //
        //    this.setState({
        //        isScriptLoaded: true,
        //        isScriptLoadSucceed: true
        //    });
        //    //console.log("didMount successOnLoading");
        //}
        var component = this;
        this.setState({
            loaded: false
        });
        d3.tsv('/data.tsv', function (error, data) {
            if (error) {
                throw error;
            }

            component.setState({
                loaded: true,
                data: data
            });
        })
    }

    render() {
        console.log("rendering");

        if (!this.state || !this.state.loaded) {
            return <div></div>;
        }


        var data = this.state.data;
        var margin = {top: 20, right: 20, bottom: 30, left: 50}
        var width = 960 - margin.left - margin.right
        var height = 500 - margin.top - margin.bottom

        var parseDate = d3.time.format('%d-%b-%y').parse

        var x = d3.time.scale()
            .range([0, width])

        var y = d3.scale.linear()
            .range([height, 0])

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')

        var line = d3.svg.line()
            .x(function (d) {
                return x(d.date)
            })
            .y(function (d) {
                return y(d.close)
            })

        var node = ReactFauxDOM.createElement('svg')
        var svg = d3.select(node)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        data.forEach(function (d) {
            d.date = parseDate(d.date)
            d.close = +d.close
        })

        x.domain(d3.extent(data, function (d) {
            return d.date
        }))
        y.domain(d3.extent(data, function (d) {
            return d.close
        }))

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Price ($)')

        svg.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('d', line)

        return node.toReact()

    }
}

//export default scriptLoader(
//    'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js',
//    'http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js'
//)(D3Panel);

export default D3Panel;