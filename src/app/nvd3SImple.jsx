/**
 * Created by Taichi1 on 2/24/16.
 */

const React = require('react');
const d3 = require('d3');
import scriptLoader from 'react-async-script-loader'
//const nv = require('nvd3');
const ReactFauxDOM = require('react-faux-dom');


class NvD3Simple extends React.Component {
    constructor(props) {
        super(props);
    }


    componentWillReceiveProps({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
        if (isScriptLoadSucceed) {
            console.log("successOnLoading Simple");
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
            console.log("didMount successOnLoading Simple");
        }
        var component = this;
        this.setState({
            loaded: false
        });
        //d3.tsv('/data.tsv', function (error, data) {
        //    if (error) {
        //        throw error;
        //    }
        //
        //    component.setState({
        //        loaded: true,
        //        data: data
        //    });
        //})
    }

    render() {
        console.log("rendering Simple");

        if (!this.state || !this.state.isScriptLoadSucceed) {
            return <div></div>;
        }

        console.log("loaded finished");

        function stream_index(d, i) {
            return {x: i, y: Math.max(0, d)};
        }
        function stream_layers(n, m, o) {
            if (arguments.length < 3) o = 0;
            function bump(a) {
                var x = 1 / (.1 + Math.random()),
                    y = 2 * Math.random() - .5,
                    z = 10 / (.1 + Math.random());
                for (var i = 0; i < m; i++) {
                    var w = (i / m - y) * z;
                    a[i] += x * Math.exp(-w * w);
                }
            }
            return d3.range(n).map(function() {
                var a = [], i;
                for (i = 0; i < m; i++) a[i] = o + o * Math.random();
                for (i = 0; i < 5; i++) bump(a);
                return a.map(stream_index);
            });
        }


        //var test_data = stream_layers(3,128,.1).map(function(data, i) {
        var test_data = stream_layers(3, 128, .1).map(function (data, i) {
            return {
                key: (i == 1) ? 'Non-stackable Stream' + i : 'Stream' + i,
                nonStackable: (i == 1),
                values: data
            };
        });
        var node = ReactFauxDOM.createElement('svg');
        nv.addGraph({
            generate: function () {
                var width = nv.utils.windowSize().width,
                    height = nv.utils.windowSize().height;
                console.log(width + " " + height);
                var chart = nv.models.multiBarChart()
                    .width(width)
                    .height(height)
                    .stacked(true)
                    ;
                chart.dispatch.on('renderEnd', function () {
                    console.log('Render Complete');
                });
                var svg = d3.select(node).datum(test_data);
                console.log('calling chart');
                svg.call(chart);
                return chart;
            },
            callback: function (graph) {
                nv.utils.windowResize(function () {
                    var width = nv.utils.windowSize().width;
                    var height = nv.utils.windowSize().height;
                    console.log(width + " " + height);
                    graph.width(width).height(height);
                    d3.select(node)
                        .attr('width', width)
                        .attr('height', height)
                        .transition().duration(0)
                        .call(graph);
                });
            }
        });

        return node.toReact();


        //var data = this.state.data;
        //var margin = {top: 20, right: 20, bottom: 30, left: 50}
        //var width = 960 - margin.left - margin.right
        //var height = 500 - margin.top - margin.bottom
        //
        //var parseDate = d3.time.format('%d-%b-%y').parse
        //
        //var x = d3.time.scale()
        //    .range([0, width])
        //
        //var y = d3.scale.linear()
        //    .range([height, 0])
        //
        //var xAxis = d3.svg.axis()
        //    .scale(x)
        //    .orient('bottom')
        //
        //var yAxis = d3.svg.axis()
        //    .scale(y)
        //    .orient('left')
        //
        //var line = d3.svg.line()
        //    .x(function (d) {
        //        return x(d.date)
        //    })
        //    .y(function (d) {
        //        return y(d.close)
        //    })
        //
        //var node = ReactFauxDOM.createElement('svg')
        //var svg = d3.select(node)
        //    .attr('width', width + margin.left + margin.right)
        //    .attr('height', height + margin.top + margin.bottom)
        //    .append('g')
        //    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        //
        //data.forEach(function (d) {
        //    d.date = parseDate(d.date)
        //    d.close = +d.close
        //})
        //
        //x.domain(d3.extent(data, function (d) {
        //    return d.date
        //}))
        //y.domain(d3.extent(data, function (d) {
        //    return d.close
        //}))
        //
        //svg.append('g')
        //    .attr('class', 'x axis')
        //    .attr('transform', 'translate(0,' + height + ')')
        //    .call(xAxis)
        //
        //svg.append('g')
        //    .attr('class', 'y axis')
        //    .call(yAxis)
        //    .append('text')
        //    .attr('transform', 'rotate(-90)')
        //    .attr('y', 6)
        //    .attr('dy', '.71em')
        //    .style('text-anchor', 'end')
        //    .text('Price ($)')
        //
        //svg.append('path')
        //    .datum(data)
        //    .attr('class', 'line')
        //    .attr('d', line)
        //
        //return node.toReact()

    }
}

//export default scriptLoader(
//    'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js',
//    'http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js'
//)(D3Panel);

//export default NvD3Simple;

export default scriptLoader(
    'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js',
    "https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.1/nv.d3.min.js"
)(NvD3Simple);