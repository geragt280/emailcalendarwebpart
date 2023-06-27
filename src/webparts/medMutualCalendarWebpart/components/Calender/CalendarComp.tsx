import * as React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import * as moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { useBoolean } from '@fluentui/react-hooks';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import { DialogBodyProps } from './DialogBodyProps';
import Dialog from './Dialog';

const localizer = momentLocalizer(moment);

type CalendarCompProps = {
  context: WebPartContext;
  userId: string;
  textFileUrl: string;
};

type ColorCategoryProps = {
  id: string;
  displayName: string;
  color: string;
};

type EventProps = {
  category: string;
  end: Date;
  eventUrl: string;
  id: string;
  start: Date;
  title: string;
  eventDescription: string;
  timeZone: string;
  isAllDay: boolean;
  priority: string;
};

const colorCodes: { [key: string]: string } = {
  preset0: "#E74856",
  preset1: "#FFBA66",
  preset2: "#914900",
  preset3: "#A7A24C",
  preset4: "#75B172",
  preset5: "#007C7C",
  preset6: "#7A8447",
  preset7: "#4EA4BC",
  preset8: "#B0A4C8",
  preset9: "#990038",
  preset10: "#757575",
  preset11: "#414449",
  preset12: "#7C7C7C",
  preset13: "#4A4B4F",
  preset14: "#010101",
  preset15: "#7B2223",
  preset16: "#873E00",
  preset17: "#804004",
  preset18: "#877C00",
  preset19: "#022F1F",
  preset20: "#255462",
  preset21: "#353C01",
  preset22: "#000087",
  preset23: "#290132",
  preset24: "#4B091F",
  default: "#0d553f",
};

// type CalendarItemProps = {
//   id: number;
//   title: string;
//   start: Date;
//   end: Date;
//   allDay: string;
//   category: string;
// }


const CalendarComp: React.FunctionComponent<CalendarCompProps> = ({ context, userId, textFileUrl }) => {
  const [items, setItems] = React.useState<EventProps[]>([]);
  const [selectedEventCategoryColor, setSelectedEventCategoryColor] = React.useState<string | undefined>(undefined);
  const [colorCategories, setColorCategories] = React.useState<ColorCategoryProps[]>([
    {
      color: 'default',
      displayName: 'Default',
      id: '34e3cb90-1b09-414e-be75-7525728cf2d5',
    },
  ]);
  const [selectedItem, setSelectedItem] = React.useState<DialogBodyProps | undefined>(undefined);
  const graphColorCategoriesUrl = textFileUrl;
  const graphCalendarBaseUrl = `/users/${userId}/calendars`;
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);

  const getListData = async (): Promise<void> => {
    const url = graphCalendarBaseUrl || '/groups/526d3255-aeb3-4b56-89eb-371c97d13cdb';

    if (!url) {
      return;
    }

    const dayStart = moment().startOf('day').add(1, 'minutes').toDate().toISOString();
    const dayEnd = moment().add(1, 'y').endOf('day').toDate().toISOString();

    try {
      const client: MSGraphClientV3 = await context.msGraphClientFactory.getClient('3');
      const res = await client.api(`${url}/calendar/calendarView?startDateTime=${dayStart}&endDateTime=${dayEnd}&$orderby=start/dateTime&$top=30`)
        .header('Prefer', 'outlook.timezone="Eastern Standard Time"')
        .get();

      const pickedItems: EventProps[] = res.value.map((i: any) => ({
        id: i.id,
        title: i.subject,
        start: new Date(i.start.dateTime),
        end: new Date(i.end.dateTime),
        category: i.categories.length > 0 ? i.categories[0] : undefined,
        eventUrl: i.webLink,
        eventDescription: i.bodyPreview,
        isAllDay: i.isAllDay,
        priority: i.sensitivity,
        timeZone: i.start.timeZone,
      }));
      console.log("'****RESPONSE CalenderComp", pickedItems);
      setItems(pickedItems);
    } catch (err) {
      console.error('Something bad happened:', err);
    }
  };

  React.useEffect(() => {
    const getColorCategories = (): void => {
      fetch(graphColorCategoriesUrl)
      .then(response => response.text())
      .then(textData => {
        // Parse the text data as needed
        const serializedData = JSON.parse(textData);
        // Use the serialized data in your JavaScript code
        setColorCategories([...colorCategories, ...serializedData.value]);
        console.log("serializedData", serializedData);
      })
      .catch(error => {
        // Handle error
        console.error('Failed to read the category file:', error, "FileUrl", graphColorCategoriesUrl);
      });
    };

    getColorCategories();
    getListData();
    console.log('Component started');
  }, []);

  const onItemSelect = (e: EventProps): void => {
    const friendlyTime = e.start.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const friendlyEndTime = e.end.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const eventSubject = e.title;
    const eventStartDate = e.start.toDateString() + ' / ' + friendlyTime;
    const eventEndDate = e.end.toDateString() + ' / ' + friendlyEndTime;
    const eventDescription = e.eventDescription;
    const eventUrl = e.eventUrl;
    const eventCategory = e.category !== undefined ? e.category : 'Default';
    const currentPreset = colorCategories.length > 1 ? colorCategories.filter(e => e.displayName === eventCategory)[0] : colorCategories[0];
    const backgroundColor = colorCodes[currentPreset.color];
    const eventIsAllDay = e.isAllDay;
    const eventPriority = e.priority;
    const evnetTimeZone = e.timeZone;

    setSelectedEventCategoryColor(backgroundColor);
    setSelectedItem({
      eventSubject,
      eventStartDate,
      eventDescription,
      eventUrl,
      eventCategory,
      eventEndDate,
      eventIsAllDay,
      eventPriority,
      evnetTimeZone,
    });
    showModal();
  };

  const eventStyleGetter = (event: any, start: any, end: any, isSelected: any) => {
    const category = event.category !== undefined ? event.category : 'Default';
    const currentPreset = colorCategories.length > 1 ? colorCategories.filter((e) => e.displayName === category)[0] : colorCategories[0];
    const backgroundColor = colorCodes[currentPreset.color];
    const style = {
      backgroundColor,
      borderRadius: '5px',
      color: 'white',
      border: 'none',
      display: 'flex',
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
      
      {isModalOpen && (
        <Dialog hideModal={hideModal} selectedItem={selectedItem} categoryColor={selectedEventCategoryColor} />
      )}

    </div>
  );
};

export default CalendarComp;

