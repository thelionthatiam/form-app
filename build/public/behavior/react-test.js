class AlarmClock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            time: '',
            savedTimes: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }
    componentWillMount() {
        clearInterval(this.timerID);
    }
    tick() {
        let now = this.state.date.toTimeString().split(' ')[0];
        let times = this.state.savedTimes;
        for (let i = 0; i < times.length; i++) {
            let alarm = times[i] + ':00';
            if (now === alarm) {
                alert('your alarm at ' + alarm + ' just happend. go do something about it!');
            }
        }
        this.setState({
            date: new Date()
        });
    }
    handleSubmit(event) {
        let currentTimes = this.state.savedTimes;
        currentTimes.push(this.state.time);
        this.setState({
            savedTime: currentTimes
        });
        event.preventDefault();
    }
    handleChange(event) {
        this.setState({
            time: event.target.value
        });
    }
    render() {
        return (<div>
        <Clock time={this.state.date.toLocaleTimeString()}/>
        <AlarmForm formSubmit={this.handleSubmit} time={this.state.time} inputChange={this.handleChange}/>
        <Alarms savedTimes={this.state.savedTimes}/>
      </div>);
    }
}
function Clock(props) {
    return (<div className='clock'>
      <h1>
        {props.time}
      </h1>
    </div>);
}
function AlarmForm(props) {
    return (<div className='alarmForm'>
        <h4>create a new alarm</h4>
        <form onSubmit={props.formSubmit}>
          <input type='time' time={props.time} onChange={props.inputChange}/>
          <button>
            add
          </button>
        </form>
      </div>);
}
class Alarms extends React.Component {
    constructor(props) {
        super(props);
        this.alarms = props.savedTimes;
    }
    render() {
        return (<div className='alarms'>
        <SavedAlarmsTitle alarms={this.alarms}/>
        <SavedAlarms alarms={this.alarms}/>
      </div>);
    }
}
function SavedAlarmsTitle(props) {
    const alarms = props.alarms;
    if (alarms.length < 1) {
        return <p>start adding alarms to see them here!</p>;
    }
    else {
        return <p>saved alarms</p>;
    }
}
function SavedAlarms(props) {
    const alarms = props.alarms;
    const savedAlarms = alarms.map((alarm) => <li key={alarm}>
      {alarm}
    </li>);
    return (<ul>{savedAlarms}</ul>);
}
ReactDOM.render(<AlarmClock />, document.getElementById('root'));
//# sourceMappingURL=react-test.js.map