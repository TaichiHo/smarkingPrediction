/**
 * Created by Taichi1 on 2/24/16.
 */

const React = require('react');

const {AppBar, DatePicker} = require('material-ui');
var Dropzone = require('react-dropzone');
var D3Panel = require('./d3Panel');

class Master extends React.Component {
    constructor(props) {
        super(props);

        const minDate = new Date();
        const maxDate = new Date();
        minDate.setFullYear(2016, 1, 1);
        maxDate.setFullYear(2016, 1, 29);
        minDate.setHours(0, 0, 0, 0);
        maxDate.setHours(0, 0, 0, 0);

        this.state = {
            minDate: minDate,
            maxDate: maxDate,
            autoOk: true,
            disableYearSelection: true,
        };
    }

    onDrop(files) {
        console.log('Received files: ', files);
    }

    _onDismiss() {

    }

    _onShow() {

    }

    render() {
        "use strict";
        var title = "Smarking Prediction";
        return (
            <div>
                <AppBar
                    title={title}/>
                <Dropzone onDrop={this.onDrop} multiple={false}
                          accept="text/csv">
                    <div>Upload the actual occupancy here!</div>
                </Dropzone>
                <DatePicker
                    mode="landscape"
                    hintText="Pick a date to see prediction"
                    autoOk={this.state.autoOk}
                    minDate={this.state.minDate}
                    maxDate={this.state.maxDate}
                    disableYearSelection={this.state.disableYearSelection}
                />
                <D3Panel/>


            </div>);
    }
}


export default Master;