import React from 'react';
import CourseDetail from '../../components/CourseDetail/CourseDetail';
import NavBar from '../../components/Navigation/NavBar';
export { Page };
export { documentProps };
const documentProps = {
  title: 'Course Detail Page',
  description: 'The course detail page',
};

const Page = () => {
  return (
    <>
      {/* <NavBar /> */}
      <CourseDetail />
    </>
  );
};
