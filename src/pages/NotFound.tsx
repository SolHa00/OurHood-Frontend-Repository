import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div>
      <p>Not Found!</p>
      <Link to='/'>Go Home</Link>
    </div>
  );
};

export default NotFound;
