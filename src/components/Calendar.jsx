import React,{ Component }  from 'react';
import moment from 'moment'
import './Calendar.scss'
import Next from '../assets/right.svg'
import Prev from '../assets/left.svg'




class Calendar extends Component {

    state = {
        weekdaysShort: moment.weekdaysShort(),
        dateObject: moment(),
        months: moment.months(),
        displayedEvents: [],
        displayRow: '',
        displayDay:'',
        events: [
            {
                start: moment('2020/04/1').format('l'),
                badgeColor: 'red'
            },
            {
                start: moment('2020/04/1').format('l'),
                badgeColor: 'red'
            },
            {
                start: moment().format('l')
            },
        ]
    }

    firstDayOfMonth = () => {
        const dateObject = this.state.dateObject;
        let firstDay = moment(dateObject)
                        .startOf('month')
                        .format('d')
        return firstDay;
    }

    handleDrop = ({event,date}) => {
        console.log(date)
        this.setState(state => ({
            events: [...state.events,{start:moment(date).format('l'),badgeColor:'purple'}]
        }))
    }

    setToday = () => this.setState(()=>({dateObject:moment()}))


    onDropFromOutside = (e) => {
        e.preventDefault()
    }


    renderBlanks = () => {
        const { dateObject }= this.state;
        let blanks = [];
        let i;
        const prevMDays = moment(dateObject).subtract(1,'M').daysInMonth();
        let day = prevMDays 
        for (i = 0; i < this.firstDayOfMonth();i++) {
            blanks.push(
                <td key={`empty${i}`} className="calendar-day empty">
                    <span>{day}</span>
                </td>
            )
            day = day - 1;
        }
        return blanks.reverse()
    }

    getEventsByDate = (date) => {
        const {events} = this.state        
        return events.filter(event => moment(event.start).format('l') === date )
    }

    daysInMonth = () => {
        const {dateObject, displayDay } = this.state
        const year = dateObject.year();
        const month = dateObject.month() + 1;
        let daysinmonths = [];
        let d;
        for ( d = 1; d <= this.state.dateObject.daysInMonth(); d++) {
            const fullDate = `${month}/${d}/${year}`
            const currentDay =  d;
            const events = this.getEventsByDate(fullDate)

            const day = (
                        <td key={d} 
                            className={`calendar-day ${fullDate === moment().format('l') ? 'today' : ''} ${displayDay === currentDay ? 'selected' : '' } ${events.length > 0 ? 'clickable' : ''}`} 
                            onClick={() =>
                                events.length > 0 
                                ? this.displayEvents(events,`row-${this.getRowNumber(fullDate)}`,currentDay)
                                : this.emptyFunction()
                                }
                                onDragOver={this.onDropFromOutside}
                                onDrop={(e,date = new Date(fullDate)) => this.handleDrop({event:e,date})}
                            
                        >
                            
                            {events.length > 0 && 
                            <small className="badge">
                            {events.length}
                            </small>
                            }
                            <span>{d}</span>
                            <div className="dots">
                            {events.length > 0 && events.map((event,i) => (
                                <a key={`b${i}`} className="dot" style={{background:event.badgeColor ? event.badgeColor : 'purple'}}></a>
                            ))}
                            </div>
                            {events.length > 10 && (
                                <div className="more-text">+ more...</div>
                            )}
                        </td>
            )
            

            daysinmonths.push(day)
        }
        return daysinmonths
    }

    displayEvents = (events,row,displayDay) => {

        this.setState(state =>({
            displayedEvents: events,
            displayDay: state.displayDay === displayDay ? '' : displayDay,
            displayRow: state.displayRow === row ? displayDay === state.displayDay ? '' : state.displayRow : row
        }))
    }

    emptyFunction = () => {return};

    onNext = () => {
        this.setState((state)=>({
            dateObject: moment(state.dateObject).add(1,'M'),
            displayedEvents: [],
            displayRow: '',
            displayDay:'',
        }))
    }

    onPrev = () => {
        this.setState((state)=>({
            dateObject: moment(state.dateObject).subtract(1,'M'),
            displayedEvents: [],
            displayRow: '',
            displayDay:'',
        }))
    }

    getRowNumber = (numberDay) => {
        const blanks = this.renderBlanks().length;
        const dayIncBlanks = blanks + Number(numberDay.split('/')[1])

        if(dayIncBlanks <= 7 ) {
            return 1;
        } else if (dayIncBlanks > 7 && dayIncBlanks <= 14) {
            return 2;
        } else if (dayIncBlanks > 14 && dayIncBlanks <= 21) {
            return 3;
        } else if (dayIncBlanks > 21 && dayIncBlanks <= 28) {
            return 4;
        } else {
            return 5;
        }
    }

    eventClicked = e => {
        console.log(e)
    }

render() {
    const { displayedEvents, displayRow } = this.state
    const totalSlots = [...this.renderBlanks(),...this.daysInMonth()]
    let rows = []
    let cells = []

    totalSlots.forEach((row,i) => {
        if(i % 7 !== 0) {
            cells.push(row)
        } else {
            rows.push(cells)
            cells = []
            cells.push(row)
        }
        if(i === totalSlots.length - 1) {
            if(cells.length === 7) {
                rows.push(cells)
            } else {
                let d = 1;
                for(let i = cells.length; i < 7; i++) {
                    cells.push(<td key={`e${d}`} className="calendar-day empty"><span>{d}</span></td>)
                    d = d + 1;
                }
                rows.push(cells)
            }
        }
    })

    let daysinmonth = rows.map((d,i)=>{
        if(i !== 0) {
        return (
        <React.Fragment key={i}>
        <tr>
            {d}
        </tr>
        {displayedEvents.length  > 0 && displayRow === `row-${i}` &&
        <tr>
            <td colSpan="7" className="events-display">
                    {displayedEvents.map((event,i) => (<div key={`_${i}`} onClick={()=>this.eventClicked(event)} className="displayed-event"><a style={{backgroundColor: event.badgeColor ? event.badgeColor : 'purple' }} className="event-detail-badge"></a>{event.start}</div>))}
            </td>
        </tr>
        }
        </React.Fragment>
        )} else return null;
    })

    let renderTh = () => {
        return this.state.weekdaysShort.map(day => (
            <th key={day} className="week-day">
                {day}
            </th>
        ))
    }


    const { months, dateObject} = this.state
    return (
        <div>
            <h2>Calendar</h2>
            <div draggable onDragStart={e => console.log(e,'hello')}>Hello</div>
            <div className="btns-group">
                <button className="today-btn" onClick={this.setToday}>Today</button>
            </div>
            <div className="_heading">
                <div>
                <button onClick={()=>this.onPrev()}><img src={Prev} alt="prev" /></button>
                </div>
                    <div className="month-name">{`${months[dateObject.month()]}, ${dateObject.year()}`}</div>
                <div>
                <button onClick={()=>this.onNext()}><img src={Next} alt="next" /></button>
                </div>
            </div>
            <table border={'1px'} cellPadding={0}>
                <thead>
                <tr>
                {renderTh()}
                </tr>
                </thead>
                <tbody>
                {daysinmonth}
                </tbody>
            </table>
        </div>
      );
}
  
}

export default Calendar;
