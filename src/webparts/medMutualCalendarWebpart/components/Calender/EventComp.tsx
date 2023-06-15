import * as React from 'react';
import * as moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { useBoolean } from '@fluentui/react-hooks';
import { MSGraphClientV3 } from '../../../../../node_modules/@microsoft/sp-http-msgraph/dist/index-internal'
import { DialogBodyProps } from './DialogBodyProps';
import Dialog from './Dialog';
import { DateBox, DateBoxSize } from './DateBox';
import { FocusZone, Icon } from 'office-ui-fabric-react';

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
  default: "#A8D1DF",
};

// type CalendarItemProps = {
//   id: number;
//   title: string;
//   start: Date;
//   end: Date;
//   allDay: string;
//   category: string;
// }

const EventComp: React.FunctionComponent<Props> = ({ context, userId }) => {
  const [items, setItems] = React.useState<EventProps[]>([]);
  const [selectedEventCategoryColor/*, setSelectedEventCategoryColor*/] = React.useState<string|undefined>(undefined);
  const [colorCategories, setColorCategories] = React.useState<ColorCategoryProps[] | undefined>([
    {
      color: "default",
      displayName: "Default",
      id: "34e3cb90-1b09-414e-be75-7525728cf2d5"
    }
  ]);
  const [selectedItem /*, setSelectedItem*/] = React.useState<DialogBodyProps | undefined>(undefined);
  const graphColorCategoriesUrl = `/users/${userId}/outlook/masterCategories`;
  const graphCalenderBaseUrl = `/users/${userId}/calendars`;
  const [isModalOpen, { /*setTrue: showModal,*/ setFalse: hideModal }] = useBoolean(false);
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
          .headers({
            'Prefer': 'outlook.timezone="Eastern Standard Time"',
            // Add more headers as needed
          })
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
    console.log("Comp started", items);
  }, []);

  const RenderEventItems: React.FunctionComponent<{ items: EventProps[] | undefined; }> = ({items}) =>{

    return <div>
      {items.map((item, i) => {
        const eventCategory = item.category !== undefined ? item.category : "Default";
        const currentPreset = colorCategories.filter(item => item.displayName === eventCategory)[0];
        const backgroundColor = colorCodes[currentPreset.color];
        const formattedDate = `${item.start.toLocaleDateString()} | ${item.start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
        return(
          <div style={{display:'flex', flex:1, borderBottom: '1px solid #ccc', flexDirection:'row', alignItems:'start' }}>
            <div style={{padding:5}}>
              <DateBox  startDate={item.start} endDate={item.end} size={DateBoxSize.Small} key={i} themeVariant={backgroundColor} />
            </div>
            <div className='event-info' style={{padding:'5px 0px 0px 0px'}}>
              <h5 style={{margin:0, color: 'orange'}}>{item.title}</h5>
              <p style={{margin:0, fontSize:9, marginTop:2}}>{formattedDate}</p>
            </div>
          </div>

        ) 
      })}
    </div>
  }

  // const onItemSelect = (e: EventProps): void => {
  //   // console.log("item selected", e);
  //   // const timeString = e.start.toTimeString();
  //   const friendlyTime = e.start.toLocaleTimeString([],
  //     {
  //       hour: '2-digit', minute: '2-digit'
  //     }
  //   );
  //   const eventSubject = e.title;
  //   const eventDate = e.start.toDateString() + ' / ' + friendlyTime;
  //   const eventDescription = e.eventDescription;
  //   const eventUrl = e.eventUrl;
  //   const eventCategory = e.category !== undefined ? e.category : "Default";
  //   const currentPreset = colorCategories.filter(item => item.displayName === eventCategory)[0];
  //   const backgroundColor = colorCodes[currentPreset.color];
  //   // console.log('background color', backgroundColor);
  //   setSelectedEventCategoryColor(backgroundColor);
  //   setSelectedItem({
  //     eventSubject,
  //     eventDate,
  //     eventDescription,
  //     eventUrl,
  //     eventCategory
  //   });
  //   showModal();
  // }
  console.log("rendering", items);
  return (
    <div style={{padding:10}}>
      <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'100%', alignItems:'center'}}>
        <div style={{display:'flex', flexDirection:'row', alignItems:'center', width:'12%', justifyContent:'space-between'}}>
          <Icon iconName='ZeroDayCalendar' style={{ fontSize: 15, color: 'orange' }} />
          <h3>Events</h3>
        </div>
        <div>
          <p style={{color:'#005C4B'}}>View All</p>
        </div>
      </div>
      <div>
        <FocusZone>
          <RenderEventItems items={items} />
        </FocusZone>
      </div>

      {isModalOpen &&
        <Dialog hideModal={hideModal} selectedItem={selectedItem} categoryColor={selectedEventCategoryColor} />
      }
      
    </div>
  )
}
export default EventComp;

