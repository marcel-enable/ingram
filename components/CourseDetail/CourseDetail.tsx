import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Cart } from '@thoughtindustries/cart';
import { usePageContext } from '../../renderer/usePageContext';
import awsLogo from '../../renderer/AWSLogo.png';
import CourseTabs from './CourseTabs';
import Header from './Header';

interface ContenItem {
    displayCourse: string;
    title: string;
    __typename: string;
}

const CourseDetail = () => {
    const pageContext = usePageContext();
    const { routeParams } = pageContext;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [courseId, setCourseId] = useState('');
    const [currencyCode, setCurrencyCode] = useState('USD');

    const [tabs, setTabs] = useState([]);

    const CourseQuery = gql`
        query CourseGroupBySlug($slug: Slug!) {
            CourseGroupBySlug(slug: $slug) {
                id
                title
                courses {
                    customFields
                    id
                }
                description
                tabs {
                    id
                    body
                    label
                }
            }
        }
    `;

    const {
        data: courseData,
        loading: courseLoading,
        error: courseError,
    } = useQuery(CourseQuery, { variables: { slug: routeParams.courseSlug } });

    if (courseData) {
        useEffect(() => {
            setTitle(courseData.CourseGroupBySlug?.title);
            setDescription(courseData.CourseGroupBySlug?.description);
            setTabs(
                courseData.CourseGroupBySlug.tabs.map(
                    (tab: { body: string; label: string }) => ({
                        body: tab.body,
                        label: tab.label,
                    })
                )
            );
            setCourseId(courseData.CourseGroupBySlug?.courses[0]?.id);
            if (
                courseData.CourseGroupBySlug?.courses[0]?.customFields
                    ?.currency[0]
            ) {
                setCurrencyCode(
                    courseData.CourseGroupBySlug.courses[0].customFields
                        .currency[0]
                );
            }
        }, []);
    } else if (courseError) {
        console.log('Error', courseError);
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
                            <div className="text-primary pt-6 text-lg">
                                {description}
                            </div>
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
                            <CourseTabs
                                tabs={tabs}
                                courseId={courseId}
                                currencyCode={currencyCode}
                            />
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
                                    <i
                                        className="icon-lock"
                                        aria-label="lock"
                                    ></i>
                                    <span>Already Enrolled? Sign In</span>
                                </a>
                            </div>
                        </div>
                        <div className="py-8 px-4">
                            <div className="break-words">
                                <p className="text-center mb-4">
                                    If you are interested in a private class
                                    session, please contact your local Ingram
                                    Micro Training Specialist.
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
