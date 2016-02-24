/**
 * Created by Taichi1 on 2/24/16.
 */

const React = require('react');
import scriptLoader from 'react-async-script-loader'

class D3Panel extends React.Component {
    constructor(props) {
        super(props);
    }

    static getInitialState() {
        return {
            isScriptLoaded: false,
            isScriptLoadSucceed: false
        }
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
            //console.log("didMount successOnLoading");
        }
    }

    render() {
        console.log("rendering");
        var datum = [{

            key: "Cumulative Return",
            values: [
                {
                    "label": "A",
                    "value": -29.765957771107
                },
                {
                    "label": "B",
                    "value": 0
                },
                {
                    "label": "C",
                    "value": 32.807804682612
                },
                {
                    "label": "D",
                    "value": 196.45946739256
                },
                {
                    "label": "E",
                    "value": 0.19434030906893
                },
                {
                    "label": "F",
                    "value": -98.079782601442
                },
                {
                    "label": "G",
                    "value": -13.925743130903
                },
                {
                    "label": "H",
                    "value": -5.1387322875705
                }
            ]
        }
        ];
        return (this.state && this.state.isScriptLoadSucceed ?
            <NVD3Chart id="barChart" type="discreteBarChart" datum={datum} x="label" y="value"/> :
            <div></div>);
    }
}

export default scriptLoader(
    'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js',
    ["https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.2/nv.d3.min.js",
        '/dist/react-nvd3.js'
    ]
)(D3Panel);