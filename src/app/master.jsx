/**
 * Created by Taichi1 on 2/24/16.
 */

const React = require('react');

const {AppBar, DatePicker, FlatButton} = require('material-ui');
var Dropzone = require('react-dropzone');
var D3Panel = require('./d3Panel');
var NvD3Panel = require('./nvd3.jsx');

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

    _onClickOnUpload() {
        console.log("click");
        this.refs.dz.open();
    }

    _handleFileUploaded() {
        console.log("handleFileUploaded");
        console.log(this.refs.inputFile.files[0]);
        this.setState({
            actual: this.refs.inputFile.files[0].preview
        })
    }

    render() {
        "use strict";
        var title = "Smarking Prediction";
        var label = "Upload Your Data";

        var flatButton = <FlatButton label={label} onClick={this._onClickOnUpload.bind(this)}/>;

        //<form>
        //    <input ref="inputFile" type='file' style={{width:0, height:0}} accept="text/csv"
        //           onchange={this._handleFileUploaded.bind(this)}/>​
        //</form>
        return (
            <div>
                <AppBar
                    title={title} iconElementRight={flatButton}/>

                <Dropzone onDrop={this.onDrop} multiple={false}
                          ref="dz"
                          style={{width:0, height:0}}
                          accept="text/csv">
                </Dropzone>
                <div style={{margin:"0 auto", width: 300}}>
                    <DatePicker
                        mode="landscape"
                        hintText="Pick a date to see prediction"
                        autoOk={this.state.autoOk}
                        minDate={this.state.minDate}
                        maxDate={this.state.maxDate}
                        disableYearSelection={this.state.disableYearSelection}
                    />
                </div>


                <NvD3Panel actual={this.state.actual} onError={this._onError}/>
            </div>
        );
    }

    _onError() {

    }

}


export default Master;