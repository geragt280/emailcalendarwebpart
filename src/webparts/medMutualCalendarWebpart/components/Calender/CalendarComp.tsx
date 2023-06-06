import * as React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import * as moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { useBoolean } from '@fluentui/react-hooks';
import { MSGraphClientV3 } from '../../../../../node_modules/@microsoft/sp-http-msgraph/dist/index-internal'
import { DialogBodyProps } from './DialogBodyProps';
import Dialog from './Dialog';

const localizer = momentLocalizer(moment);

type Props = {
  context: WebPartContext;
  userId: string;
};

type ColorCategoryProps = {
  id: string;
  displayName: string;
  color: string;
}

type EventProps = {
  allDay: string;
  category: string;
  end: Date;
  eventUrl: string;
  id: string;
  start: Date;
  title: string;
  eventDescription: string;
}

const colorCodes: { [key: string]: string } = {
  preset0: "#F1919A",
  preset1: "#FFBA66",
  preset2: "Brown",
  preset3: "#A7A24C",
  preset4: "#75B172",
  preset5: "Teal",
  preset6: "Olive",
  preset7: "#4EA4BC",
  preset8: "#B0A4C8",
  preset9: "cranberry",
  preset10: "steel",
  preset11: "darkSteel",
  preset12: "gray",
  preset13: "darkgray",
  preset14: "black",
  preset15: "darkred",
  preset16: "darkorange",
  preset17: "darkbrown",
  preset18: "darkyellow",
  preset19: "darkgreen",
  preset20: "darkteal",
  preset21: "darkolive",
  preset22: "darkblue",
  preset23: "darkpurple",
  preset24: "darkcranberry",
  default: "lightblue",
};

// type CalendarItemProps = {
//   id: number;
//   title: string;
//   start: Date;
//   end: Date;
//   allDay: string;
//   category: string;
// }

const CalendarComp: React.FunctionComponent<Props> = ({ context, userId }) => {
  const [items, setItems] = React.useState([]);
  const [colorCategories, setColorCategories] = React.useState<ColorCategoryProps[] | undefined>([
    {
      color: "default",
      displayName: "Default",
      id: "34e3cb90-1b09-414e-be75-7525728cf2d5"
    }
  ]);
  const [selectedItem, setSelectedItem] = React.useState<DialogBodyProps | undefined>(undefined);
  const graphColorCategoriesUrl = `/users/${userId}/outlook/masterCategories`;
  const graphCalenderBaseUrl = `/users/${userId}/calendars`;
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
  // const titleId = useId('title');

  // const _getEstDate = (date: string, allDay: boolean): string => {
  //   return allDay ? date.substr(0, date.length - 1) : date;
  // }

  const _getListData = (): Promise<EventProps[] | void> => {

    const url = graphCalenderBaseUrl || '/groups/526d3255-aeb3-4b56-89eb-371c97d13cdb';

    if (!url) {
      return Promise.resolve([]);
    }

    const dayStart = moment().startOf('day').add(1, 'minutes').toDate().toISOString();
    const dayEnd = moment().add(1, 'y').endOf('day').toDate().toISOString();
    console.log('******url', url + `/calendar/calendarView?startDateTime=${dayStart}&endDateTime=${dayEnd}&$orderby=start/dateTime`);

    context.msGraphClientFactory
      .getClient("3")
      .then((client: MSGraphClientV3): void => {
        client
          .api(`${url}/calendar/calendarView?startDateTime=${dayStart}&endDateTime=${dayEnd}&$orderby=start/dateTime`)
          .get((err: any, res: { value: any[]; }) => {
            console.log('****RESPONSE', res)
            if (err) {
              console.error('something bad happened');
              console.error(err);
              return;
            }

            const pickedItems: EventProps[] = res.value.map(i => ({
              id: i.id,
              title: i.subject,
              start: new Date(i.start.dateTime),
              end: new Date(i.end.dateTime),
              allDay: i.isAllDay,
              category: i.categories.length > 0 ? i.categories[0] : undefined,
              eventUrl: i.webLink,
              eventDescription: i.bodyPreview
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
    const getColorCategories = (): void => {
      context.msGraphClientFactory
        .getClient("3")
        .then((client: MSGraphClientV3): void => {
          client
            .api(`${graphColorCategoriesUrl}`)
            .get((err: any, res: { value: ColorCategoryProps[]; }) => {
              console.log("Color categories", res.value);
              setColorCategories([...colorCategories, ...res.value]);
            });
        })
        .catch((err: any) => {
          console.log('error gletting color category', err);
        });
    }
    void getColorCategories();
    void getListDataPromise();
    console.log("Comp started");
  }, []);


  const onItemSelect = (e: EventProps): void => {
    console.log("item selected", e);
    // const timeString = e.start.toTimeString();
    const friendlyTime = e.start.toLocaleTimeString([],
      // "en-PK", 
      {
        hour: '2-digit', minute: '2-digit'
        // , timeZone: "America/New_York" 
      });
    const eventSubject = e.title;
    const eventDate = e.start.toDateString() + ' / ' + friendlyTime;
    const eventDescription = e.eventDescription;
    const eventUrl = e.eventUrl;
    setSelectedItem({
      eventSubject,
      eventDate,
      eventDescription,
      eventUrl
    });
    showModal();
  }


  const eventStyleGetter = (event: any, start: any, end: any, isSelected: any) => {
    const category = event.category !== undefined ? event.category : "Default";
    const currentPreset = colorCategories.filter(e => e.displayName === category)[0];
    const backgroundColor = isSelected ? colorCodes['Default'] : colorCodes[currentPreset.color];
    console.log("styling item", category, currentPreset);
    // Customize the background color based on isSelected and event properties
    const style = {
      backgroundColor,
      borderRadius: '5px',
      color: 'white',
      // border: 'none',
      display: 'block',
      height: 60
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

      {isModalOpen &&
        <Dialog hideModal={hideModal} selectedItem={selectedItem} />
      }


    </div>
  )
}

export default CalendarComp;

