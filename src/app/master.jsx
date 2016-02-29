/**
 * Created by Taichi1 on 2/24/16.
 */

const React = require('react');

const {AppBar, DatePicker, FlatButton, Snackbar} = require('material-ui');
var Dropzone = require('react-dropzone');
var NvD3Panel = require('./nvd3.jsx');
var NvD32 = require('./nvd3Simple.jsx');


const minDate = new Date();
const maxDate = new Date();
minDate.setFullYear(2016, 1, 1);
maxDate.setFullYear(2016, 1, 29);
minDate.setHours(0, 0, 0, 0);
maxDate.setHours(0, 0, 0, 0);

class Master extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date("2016-02-01 00:00:00")
        };
    }


    _onDrop(files) {
        console.log("send new props");

        this.setState({
            actual: files[0]
        });
    }

    _onDismiss() {

    }

    _onClickOnUpload() {
        this.refs.dz.open();
    }

    _handleFileUploaded() {
        this.setState({
            actual: this.refs.inputFile.files[0].preview
        })
    }

    _onChangeDate(e, newDate) {
        console.log("Select new date: " + newDate);
        this.setState({
            date: newDate
        })
    }

    render() {
        "use strict";
        var title = "Smarking Prediction";
        var label = "Upload Your Data";

        var flatButton = <FlatButton label={label} onClick={this._onClickOnUpload.bind(this)}/>;
        return (
            <div>
                <AppBar
                    title={title} iconElementRight={flatButton}/>

                <Dropzone onDrop={this._onDrop.bind(this)} multiple={false}
                          ref="dz"
                          style={{width:0, height:0}}
                          accept="text/csv">
                </Dropzone>
                <div style={{margin:"0 auto", width: 300}}>
                    <DatePicker
                        mode="landscape"
                        hintText="Pick a date to see prediction"
                        autoOk={true}
                        minDate={minDate}
                        maxDate={maxDate}
                        disableYearSelection={true}
                        onChange={this._onChangeDate.bind(this)}
                        defaultDate={this.state.date}
                    />
                </div>

                <div style={{height:500}}>

                    <NvD3Panel actual={this.state.actual} date={this.state.date}
                               onError={this._onError}/>
                </div>


                <Snackbar ref="snackbar" message={this.state.errorMessage ? this.state.errorMessage:""}/>
            </div>
        );
    }

    _onError() {
        this.setState({
            errorMessage: "Error in Script Loading"
        })
    }

}


export default Master;