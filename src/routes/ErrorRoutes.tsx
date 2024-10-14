import React from 'react';
import { Route } from 'react-router-dom';
import ErrorPage from '../components/ErrorPage';

const ErrorRoutes: React.FC = () => (
  <>
    <Route path="/403" element={<ErrorPage code={403} imageSrc="/403 Forbidden.png" />} />
    <Route path="/404" element={<ErrorPage code={404} imageSrc="/404 NotFound.png" />} />
    <Route path="/418" element={<ErrorPage code={418} imageSrc="/418 I'm a teapot.png" />} />
    <Route path="/500" element={<ErrorPage code={500} imageSrc="/500 InternalServerError.png" />} />
    <Route path="/503" element={<ErrorPage code={503} imageSrc="/503 ServiceUnavailable.png" />} />
    <Route path="*" element={<ErrorPage code={404} imageSrc="/404 NotFound.png" />} />
  </>
);

export default ErrorRoutes;
