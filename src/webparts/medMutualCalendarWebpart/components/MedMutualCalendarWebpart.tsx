import * as React from 'react';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import * as moment from 'moment';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { IMedMutualCalendarWebpartProps } from './IMedMutualCalendarWebpartProps';
import CalendarComp from './Calender/CalendarComp';

// interface IMedMutualCalendarWebpartState {
//   items: any[] | undefined;
// }

// const localizer = momentLocalizer(moment);

export default class MedMutualCalendarWebpart extends React.Component<IMedMutualCalendarWebpartProps, {}> {
  // constructor(props : IMedMutualCalendarWebpartProps){
  //   super(props);
  //   this.state = {
  //     items : []
  //   }
  // }

  // public componentDidMount(): void {
  //   void this._getListData();
  // }

  // _getEstDate = (date :string, allDay: boolean) : string => {
  //   return allDay ? date.substr(0, date.length - 1) : date;
  // }

  // _getListData = () : Promise<any> => {
  //   const {context, listUrl} = this.props;

  //   const url = listUrl || '/groups/526d3255-aeb3-4b56-89eb-371c97d13cdb';

  //   if (!url) {
  //     return Promise.resolve([]);
  //   }

  //   const dayStart = moment().startOf('day').add(1, 'minutes').toDate().toISOString();
  //   const dayEnd = moment().add(1, 'y').endOf('day').toDate().toISOString();
  //   console.log('******url', url + `/calendar/calendarView?startDateTime=${dayStart}&endDateTime=${dayEnd}&$orderby=start/dateTime`);

  //   context.msGraphClientFactory
  //     .getClient("3")
  //     .then((client: any): void => {
  //       // From https://github.com/microsoftgraph/msgraph-sdk-javascript sample
  //       client
  //         .api(`${url}/calendar/calendarView?startDateTime=${dayStart}&endDateTime=${dayEnd}&$orderby=start/dateTime`)
  //         .get((err: any, res: { value: any[]; }) => {
  //           console.log('****RESPONSE', res)
  //           if (err) {
  //             console.error('something bad happened');
  //             console.error(err);
  //             return;
  //           }

  //           const pickedItems = res.value.map(i => ({ id: i.id, title: i.subject, start: new Date(this._getEstDate(i.start.dateTime, i.isAllDay)), end: new Date(this._getEstDate(i.end.dateTime, i.isAllDay)), allDay: i.isAllDay }));
  //           console.log('****RESPONSE222', pickedItems)
  //           this.setState({items: pickedItems});
  //           return pickedItems;
  //         });

  //     })
  //     .catch((err: any) => {
  //       console.log('nope', err);
  //     });
  // }


  public render(): React.ReactElement<IMedMutualCalendarWebpartProps> {
   

    return (
      <div>
        <CalendarComp
          context={this.props.context}
          listUrl={this.props.listUrl}
        />
      </div>
    );
  }
}
