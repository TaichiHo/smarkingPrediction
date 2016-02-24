const React = require('react');

const {AppBar, DatePicker} = require('material-ui');

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


    render() {
        "use strict";
        var title = "Smarking Prediction";
        return (
            <div>
                <AppBar
                    title={title}/>
                <DatePicker
                    mode="landscape"
                    hintText="Pick a date to see prediction"
                    autoOk={this.state.autoOk}
                    minDate={this.state.minDate}
                    maxDate={this.state.maxDate}
                    disableYearSelection={this.state.disableYearSelection}
                />
            </div>);
    }
}


export default Master;