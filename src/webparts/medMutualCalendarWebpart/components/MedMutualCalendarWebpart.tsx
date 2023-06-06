import * as React from 'react';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { IMedMutualCalendarWebpartProps } from './IMedMutualCalendarWebpartProps';
import CalendarComp from './Calender/CalendarComp';

export default class MedMutualCalendarWebpart extends React.Component<IMedMutualCalendarWebpartProps, {}> {
  
  public render(): React.ReactElement<IMedMutualCalendarWebpartProps> {
   

    return (
      <div>
        <CalendarComp
          context={this.props.context}
          userId={this.props.userId}
        />
      </div>
    );
  }
}
