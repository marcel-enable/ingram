import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Cart } from '@thoughtindustries/cart';
import { usePageContext } from '../../renderer/usePageContext';
import awsLogo from '../../renderer/AWSLogo.png';
import Tabs from './Tabs';
import Header from './Header';
import currencyData from '../../utilities/currency.json';

interface ContenItem {
  displayCourse: string;
  title: string;
  __typename: string;
}

const CourseDetail = () => {
  const pageContext = usePageContext();
  const { currentUser, routeParams } = pageContext;
  // const currentUser = null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [currencyCode, setCurrencyCode] = useState(
    currentUser?.ref1 ? currentUser.ref1 : 'USD'
  );
  const [currencySymbol, setCurrencySymbol] = useState(
    currencyData[currencyCode as keyof typeof currencyData]
      ? currencyData[currencyCode as keyof typeof currencyData]['symbol']
      : '$'
  );

  const [tabs, setTabs] = useState([]);

  const catalogQuery = gql`
    query CatalogContent($page: Int!) {
      CatalogContent(page: $page) {
        contentItems {
          title
          displayCourse
        }
      }
    }
  `;

  const CourseQuery = gql`
    query CourseById($id: ID!) {
      CourseById(id: $id) {
        title
        courseGroup {
          description
          tabs {
            id
            body
            label
          }
        }
      }
    }
  `;
  const {
    data: catalogData,
    loading: catalogLoading,
    error: catalogError,
  } = useQuery(catalogQuery, { variables: { page: 1 } });

  if (catalogData) {
    const courseId = catalogData.CatalogContent.contentItems.filter(
      (item: ContenItem) =>
        item.title.toLowerCase() === routeParams.courseSlug.split('-').join(' ')
    )[0].displayCourse;
    // Hardcoding course ID
    // const courseId = '9479f7c8-9399-48fe-8f5e-8d47297dd78d';
    if (courseId) {
      const {
        data: courseData,
        loading: courseLoading,
        error: courseError,
      } = useQuery(CourseQuery, {
        variables: { id: courseId },
      });
      if (courseData) {
        console.log('coureData', courseData);
        useEffect(() => {
          setTitle(courseData.CourseById.title);
          setDescription(courseData.CourseById.courseGroup.description);
          setTabs(
            courseData.CourseById.courseGroup.tabs.map(
              (tab: { body: string; label: string }) => ({
                body: tab.body,
                label: tab.label,
              })
            )
          );
          setCourseId(courseId);
        }, []);
      } else if (courseError) {
        console.log('Error', courseError);
      }
    }
  }

  return (
    <>
      <Cart checkoutUrl="/orders" currencyCode={currencyCode}>
        <Header />

        <div className="grid grid-cols-3 gap-10 py-4 px-4">
          <div className="col-span-3 md:col-span-2">
            {title && (
              <h2 className="text-2xl font-bold font-header text-primary">
                {title}
              </h2>
            )}
            {description && (
              <div className="text-primary pt-6 text-lg">{description}</div>
            )}
          </div>
          <div className="col-span-3 md:col-span-1">
            <img
              src={awsLogo}
              alt="AWS select tier training"
              className="md:pt-16 w-full max-h-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-10 py-4 px-4">
          <div className="col-span-3 md:col-span-2">
            {tabs.length > 0 && courseId && (
              <Tabs data={tabs} courseId={courseId} />
            )}
          </div>
          <div className="col-span-3 md:col-span-1 mt-14">
            <div>
              <div className="panel p-4 mb-1 bg-secondary-background rounded">
                <div className="enroll__secondary-actions flex justify-between text-sm text-primary">
                  <button className="hover:text-primary-hover">
                    <i></i>
                    <span>Gift this course</span>
                  </button>
                  <button className="hover:text-primary-hover">
                    <i></i>
                    <span>Have a coupon?</span>
                  </button>
                </div>
              </div>
              <div className="course__detail__enrolled border border-secondary-border py-1 mb-4 rounded">
                <a
                  href="/learn/sign_in?return_to=%2Fcourses%2Fsystems-operations-on-aws-aws-sysops-na"
                  className="text-sm text-primary py-1.5 px-4 hover:text-link-hover"
                >
                  <i className="icon-lock" aria-label="lock"></i>
                  <span>Already Enrolled? Sign In</span>
                </a>
              </div>
            </div>
            <div className="py-8 px-4">
              <div className="break-words">
                <p className="text-center mb-4">
                  If you are interested in a private class session, please
                  contact your local Ingram Micro Training Specialist.
                </p>
              </div>
              <div className="widget__cta pt-4">
                <a
                  className="table mx-auto py-2 px-5 bg-accent border-accent text-accent-contrast"
                  href="https://www.ingrammicrotraining.com/pages/global-contact"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </Cart>
    </>
  );
};

export default CourseDetail;
