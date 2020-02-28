import React, { Component } from 'react'
//styles
import './scss/app.scss';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
//icons
import { ReactComponent as ArrowBack } from './assets/arrow-back.svg'
import { ReactComponent as ArrowNext } from './assets/arrow-next.svg'
import { ReactComponent as Close } from './assets/close.svg'
// third party components
import { DateRangePicker  } from 'react-date-range'
import Interactable from 'react-interactable/noNative'
// functions
import dateDiff from './utils/dateDiff'
import getDateInFormat from './utils/getDateInFormat'
import calculateGradients from './utils/calculateGradients'

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      calendarOpen: true,
      selectionRange: [{
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      }]
    }
  }

  toggleCalendar = () => {
    if(this.state.calendarOpen === false) {
      this.setState({ ...this.state, calendarOpen: true })
    }
    else {
      this.setState({ ...this.state, calendarOpen: false })
    }
  }

  getCurrentDate = () => {
    // get date in the format displayed inside calendar 
    // .rdrMonthAndYearPickers (see componentDidMount)
    
    let newDate = new Date()
    let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    let weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    let day = weekday[newDate.getDay()]
    let monthName = months[newDate.getMonth()];
    let date = newDate.getDate();
    
    return `${day} - ${monthName} ${date}`
  }
  
  handleSelect = async (date) => {
    this.setState({ ...this.state, selectionRange: [date.selection]})
  }

  handleDatesGradient = () => {
    const dates = this.state.selectionRange[0]
    const diffDays = dateDiff(dates.startDate, dates.endDate)

    let gradientArray = calculateGradients(diffDays, '#cef9fa', '#d9dbf7')    
    let arrElements = document.querySelectorAll(".rdrInRange, .rdrStartEdge, .rdrEndEdge")

    arrElements.forEach((el, i) => {
      return el.style.background = `linear-gradient(to right,
        rgb( ${Math.floor(gradientArray[i][0].r)},
        ${Math.floor(gradientArray[i][0].g)},
        ${Math.floor(gradientArray[i][0].b)}),
        rgb( ${Math.floor(gradientArray[i][1].r)},
        ${Math.floor(gradientArray[i][1].g)},
        ${Math.floor(gradientArray[i][1].b)}))`
    })
  }

  imperativeCalendarUpdates = () => {
    // handle some imperative update on the third party Calendar 
    // component 'react-date-range'

    document.querySelector(".rdrMonthAndYearPickers").textContent = this.getCurrentDate()
    let hr = document.createElement("hr")
    document.querySelector(".rdrMonthAndYearWrapper").appendChild(hr)
  }

  componentDidMount() {
    this.imperativeCalendarUpdates()
  }
  
  componentDidUpdate() {
    this.handleDatesGradient()
    if(!this.state.calendarOpen) this.handleAnimation()
  }

  handleAnimation() {
    // animation tha makes Interactable view snaps
    // to snap point of index 1. For now, in practice,
    // it just closes the calendar modal.
    this.animatedViewRef.snapTo({index:1})
  }

  render() {
    
    let state = this.state;
    
    return (
    <div className="App">
      <div className="background-img"/>
      <div className={`draggable-wrapper`}>

        <Interactable.View
        verticalOnly={true}
        snapPoints={[{y: 0}, {y: 455}]}
        boundaries={{top: -150, bottom: 456}}
        onLayout = {() => this.handleAnimation() }
        ref = {ref => this.animatedViewRef = ref}
        onSnap={e => e.index === 0 ? this.setState({ ...state, calendarOpen: true}) : null}
        >
          <div className={`calendar-wrapper`}>
            <div className="calendar-header">
              <button 
              onClick={this.toggleCalendar} 
              className="x-btn"><Close /></button>
              <p>Calendar</p>
            </div>

            <DateRangePicker
            showPreview={false}
            className="custom-calendar"
            ranges={state.selectionRange}
            showMonthAndYearPickers={false}
            showDateDisplay={false}
            weekdayDisplayFormat="EEEEE"
            onChange={this.handleSelect}
            />
            
            <button onClick={this.toggleCalendar} className="apply-btn">Apply</button>
          </div>
        </Interactable.View>
      </div>

      <div className="selected-dates">
        <div>Selected days:</div>
        <div>
          <strong>
            {state.selectionRange[0] ? 
              getDateInFormat(state.selectionRange[0].startDate) 
            : null}
          </strong>
          <span> to </span> 
          <strong>
            {state.selectionRange[0] ? 
              getDateInFormat(state.selectionRange[0].endDate) 
            : null}
          </strong>
        </div>
      </div>

      <div className="swipe-up-wrapper">
        <div>
          <span className="swipe-up" onClick={this.toggleCalendar}>
            <span>Swipe up</span>
            <ArrowNext/> 
          </span>
        </div>
      </div>

    </div>
    )
  }
}
