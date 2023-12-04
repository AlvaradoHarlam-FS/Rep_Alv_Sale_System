import React, { useEffect, useState } from "react";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Update the current year when the component mounts
    setCurrentYear(new Date().getFullYear());
  }, []);

 

  return (
    <div className="--flex-center --py2">
      <p>© {currentYear} HJAWebServicesllc. All rights reserved.</p>
      </div>

  );
};

export default Footer;
