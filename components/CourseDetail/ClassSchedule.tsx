import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { DateTime } from 'luxon';
import { AddToCartButton, EcommItemType } from '@thoughtindustries/cart';
import { usePageContext } from '../../renderer/usePageContext';
import currencyData from '../../utilities/currency.json';

const headers = [
  'ILT/VILT',
  'Location',
  'Start - End Date',
  'Start - End Time',
  'TZ',
  'Days',
  'GTR',
  'Price',
  '',
];
interface Meeting {
  startDate: string;
  endDate: string;
  id: string;
  title: string;

  timeZone: string;
  location: {
    state: string;
    city: string;
  };
}
interface FormattedMeetings {
  location: string;
  time: string;
  date: string;
  tz: string;
  days: number | undefined;
  id?: string;
  title?: string;
}
const formatDate = (startDateObj: DateTime, endDateObj: DateTime) => {
  const startDate = startDateObj.toLocaleString(DateTime.DATE_MED);
  const startYear = startDateObj.year;

  const endDate = endDateObj.toLocaleString(DateTime.DATE_MED);
  const endYear = endDateObj.year;

  return startYear === endYear
    ? `${startDate.split(',')[0]} - ${endDate.split(',')[0]}, ${endYear}`
    : `${startDate} - ${endDate}`;
};

const formatMeetings = (meetings: Meeting[]) => {
  return meetings.map((meeting) => {
    const startDateObj = DateTime.fromISO(meeting.startDate);
    const startTime = startDateObj.toLocaleString(DateTime.TIME_SIMPLE);

    const endDateObj = DateTime.fromISO(meeting.endDate);
    const endTime = endDateObj.toLocaleString(DateTime.TIME_SIMPLE);

    return {
      location: `${meeting.location.city}, ${meeting.location.state}`,
      time: `${startTime} - ${endTime}`,
      date: formatDate(startDateObj, endDateObj),
      tz: endDateObj.toFormat('ZZZZ'),
      days: endDateObj.diff(startDateObj, 'days').toObject().days,
    };
  });
};

const ClassSchedule = ({ courseId }: { courseId: string }) => {
  const pageContext = usePageContext();
  const { currentUser } = pageContext;
  const [meetings, setMeetings] = useState<FormattedMeetings[]>([]);
  const [price, setPrice] = useState(0);
  const [type, setType] = useState('');
  const [currencyCode, setCurrencyCode] = useState(
    currentUser?.ref1 ? currentUser.ref1 : 'USD'
  );
  const [currencySymbol, setCurrencySymbol] = useState(
    currencyData[currencyCode as keyof typeof currencyData]
      ? currencyData[currencyCode as keyof typeof currencyData]['symbol']
      : '$'
  );

  const query = gql`
    query CourseById($id: ID!) {
      CourseById(id: $id) {
        courseGroup {
          contentType {
            label
          }
        }
        priceInCents
        meetings {
          id
          title
          startDate
          endDate
          timeZone
          location {
            city
            state
          }
        }
      }
    }
  `;
  const { data, loading, error } = useQuery(query, {
    variables: { id: courseId },
  });

  useEffect(() => {
    if (data) {
      setMeetings(formatMeetings(data.CourseById.meetings));
      setPrice(data.CourseById.priceInCents);
      setType(data.CourseById.courseGroup.contentType.label);
    } else if (error) {
      console.log('Error', error);
    }
  }, [data]);

  return (
    <div className="my-4 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden ring-1 ring-gray-300">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-accent">
                <tr className="divide-x divide-gray-200">
                  {headers.map((header, idx) => (
                    <th
                      key={idx}
                      scope="col"
                      className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-medium text-white"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {meetings.length > 0 &&
                  meetings.map((meeting, idx) => {
                    const { id, title, location, date, time, tz, days } =
                      meeting;
                    return (
                      <tr key={idx} className="divide-x divide-gray-200">
                        <td className="whitespace-nowrap p-4 text-left text-sm text-gray-900">
                          {type === 'In Person Event' ? 'ILT' : 'VILT'}
                        </td>
                        <td className="whitespace-nowrap p-4 text-left text-sm text-gray-900">
                          {location}
                        </td>
                        <td className="whitespace-nowrap p-4 text-left text-sm text-gray-900">
                          {date}
                        </td>
                        <td className="whitespace-nowrap p-4 text-left text-sm text-gray-900">
                          {time}
                        </td>
                        <td className="whitespace-nowrap p-4 text-left text-sm text-gray-900">
                          {tz}
                        </td>
                        <td className="whitespace-nowrap p-4 text-left text-sm text-gray-900">
                          {days}
                        </td>
                        <td className="whitespace-nowrap p-4 text-left text-sm text-gray-900">
                          {currencyCode}
                        </td>
                        <td className="whitespace-nowrap p-4 text-left text-sm text-gray-900">
                          {`${currencySymbol} ${price / 100}`}
                        </td>
                        <td className="whitespace-nowrap p-4 text-left text-sm text-gray-900">
                          <AddToCartButton
                            className="bg-accent text-white py-2 px-4"
                            purchasableType={EcommItemType.Course}
                            shouldOpenCart={true}
                            purchasable={{
                              id: courseId,
                              priceInCents: price,
                              name: title,
                            }}
                          >
                            Add to Cart
                          </AddToCartButton>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSchedule;
