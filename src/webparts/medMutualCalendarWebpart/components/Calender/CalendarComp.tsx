import * as React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import * as moment from 'moment';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { WebPartContext } from '@microsoft/sp-webpart-base';

const localizer = momentLocalizer(moment);

type Props = {
  context: WebPartContext;
  listUrl: string;
};

// type CalendarItemProps = {
//   id: number;
//   title: string;
//   start: Date;
//   end: Date;
//   allDay: string;
//   category: string;
// }

const CalendarComp: React.FunctionComponent<Props> = ({ context, listUrl }) => {
  const [items, setItems] = React.useState([]);

  const _getListData = (): Promise<any> => {

    const url = listUrl || '/groups/526d3255-aeb3-4b56-89eb-371c97d13cdb';

    if (!url) {
      return Promise.resolve([]);
    }

    const dayStart = moment().startOf('day').add(1, 'minutes').toDate().toISOString();
    const dayEnd = moment().add(1, 'y').endOf('day').toDate().toISOString();
    console.log('******url', url + `/calendar/calendarView?startDateTime=${dayStart}&endDateTime=${dayEnd}&$orderby=start/dateTime`);

    context.msGraphClientFactory
      .getClient("3")
      .then((client: any): void => {
        // From https://github.com/microsoftgraph/msgraph-sdk-javascript sample
        client
          .api(`${url}/calendar/calendarView?startDateTime=${dayStart}&endDateTime=${dayEnd}&$orderby=start/dateTime`)
          .get((err: any, res: { value: any[]; }) => {
            console.log('****RESPONSE', res)
            if (err) {
              console.error('something bad happened');
              console.error(err);
              return;
            }

            const pickedItems = res.value.map(i => ({
              id: i.id,
              title: i.subject,
              start: new Date(_getEstDate(i.start.dateTime, i.isAllDay)),
              end: new Date(_getEstDate(i.end.dateTime, i.isAllDay)),
              allDay: i.isAllDay,
              category: i.categories[0]
            }));
            console.log('****RESPONSE222', pickedItems)
            setItems(pickedItems);
            return pickedItems;
          });

      })
      .catch((err: any) => {
        console.log('nope', err);
      });
  }


  React.useEffect(() => {
    const getListDataPromise = async (): Promise<void> => {
      await _getListData();
    };
    void getListDataPromise();
    console.log("Comp started");
  }, []);

  const _getEstDate = (date: string, allDay: boolean): string => {
    return allDay ? date.substr(0, date.length - 1) : date;
  }

  const onItemSelect = (e: any, r: any): void => {
    console.log("item selected", e, r);
  }

  const eventStyleGetter = (event: any, start: any, end: any, isSelected: any) => {
    console.log("rendered event", event);
    const colorCodes: { [key: string]: string } = {
      Red: "#F1919A",
      Green: "#75B172",
      Blue: "#4EA4BC",
      Yellow: "#A7A24C",
      Orange: "#FFBA66",
      Lightblue: "lightblue",
    };
    
    const backColor = event.category !== undefined ? event.category.split(' ')[0].toString() : "Lightblue";
    const backgroundColor = isSelected ? 'gray' : colorCodes[backColor];
     // Customize the background color based on isSelected and event properties
    const style = {
      backgroundColor,
      borderRadius: '0px',
      color: 'white',
      border: 'none',
      display: 'block',
      height:100
    };
    return {
      style,
    };
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={items || []}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyleGetter}
        onSelectEvent={onItemSelect}
        style={{ height: 500 }}
      />
    </div>
  )
}

export default CalendarComp;
