/* eslint-disable react/prop-types */
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faHome, faCog, faEnvelope, faUser, faChartLine, faBook, faBars } from '@fortawesome/free-solid-svg-icons';

function Sidemenu({ onToggle }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    onToggle(!isCollapsed);
  };

  return (
    <div className={`fixed top-0 left-0 bg-base-200 text-base-content transition-all duration-300
      ${isCollapsed ? 'w-20' : 'w-64'} h-screen`}
    >
      <button onClick={toggleSidebar} className="btn btn-square btn-ghost m-2">
        <FontAwesomeIcon icon={faBars} />
      </button>
      <h2 className={`text-center text-xl mb-6 ${isCollapsed ? 'hidden' : 'block'}` }>Menu</h2>
      <ul className="menu p-4">
        <li>
          <a className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Dashboard</span>
          </a>
        </li>
        <li>
          <a className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Home</span>
          </a>
        </li>
        <li>
          <a className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <FontAwesomeIcon icon={faCog} className="mr-2" />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Services</span>
          </a>
        </li>
        <li>
          <a className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Contact</span>
          </a>
        </li>
        <li>
          <a className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Profile</span>
          </a>
        </li>
        <li>
          <a className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <FontAwesomeIcon icon={faChartLine} className="mr-2" />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Reports</span>
          </a>
        </li>
        <li>
          <a className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <FontAwesomeIcon icon={faBook} className="mr-2" />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Resources</span>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Sidemenu;
