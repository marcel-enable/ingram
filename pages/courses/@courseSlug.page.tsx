import React from 'react';
import CourseDetail from '../../components/CourseDetail/CourseDetail';
export { Page };
export { documentProps };
const documentProps = {
    title: 'Course Detail Page',
    description: 'The course detail page',
};

const Page = () => {
    return (
        <>
            <CourseDetail />
        </>
    );
};
