import './App.css'
import Sidemenu from './components/sidebar/Sidemenu'
import { useState } from 'react';
import Machine from './components/machine/Machine'
import Tagname from './components/storage/Tagname'

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex">
      <Sidemenu onToggle={handleSidebarToggle} />
      {/* <div className={`flex-1 flex flex-col ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        <div className="p-10 bg-gray-800 rounded-lg m-3">
          <Machine />
        </div>
        <div className="p-10 bg-gray-800 rounded-lg m-3">
          <Tagname />
        </div>
      </div> */}
      <div className={`flex-1 flex flex-col overflow-auto 
        ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300
        
      `}
      // ${window.innerWidth < 500 ? 'ml-0' : ''}
      >
      <div className="p-4 bg-gray-800 rounded-lg m-3">
        <Machine />
      </div>
      <div className="p-4 bg-gray-800 rounded-lg m-3">
        <Tagname />
      </div>
    </div>
    </div>
  );
}

export default App
