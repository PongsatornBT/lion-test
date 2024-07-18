import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

function Machine() {
  const [machine, setMachine] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  async function fetchData() {
    try {
      const res = await fetch('public/machine.json');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const normalizedData = data.flat();
      setMachine(normalizedData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (machine) => {
    setSelectedMachine(machine);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedMachine(null);
    setModalIsOpen(false);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    const truncated = text.substr(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    return `${truncated.substr(0, lastSpaceIndex)}...`;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const filteredMachine = machine.filter((m) =>
    m.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMachine.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredMachine.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <h1 className="lg:text-3xl font-bold mb-4">Machine List</h1>
      <div className="flex justify-end mb-4">
        {/* <span className="mr-2 text-3xl text-gray-600">Search:</span> */}
        <input
          type="text"
          placeholder="Search by Label..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4">Picture</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4">Label</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4">Speed</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4">Details</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4">More Detail</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((m, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'}`}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  <img src={m.picture} alt={m.label} className="h-12 w-12 rounded-full" />
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{m.label}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{m.speed}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  {truncateText(m.detail, 75)}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  <button 
                    onClick={() => openModal(m)}
                    className="text-gray-200 hover:text-gray-500 transition duration-100"
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-end flex-row mt-4">
        {pageNumbers
          .filter((num) => num === 1 || num === totalPages || (num >= currentPage - 1 && num <= currentPage + 1))
          .map((num) => (
            <button
              key={num}
              onClick={() => paginate(num)}
              className={`mx-1 px-4 py-2 rounded-md ${currentPage === num ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
            >
              {num}
            </button>
          ))}
      </div>

      {modalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-4 rounded-lg 
            // Adjusting width and height based on screen width
            sm:w-1/2 sm:h-4/6 
            md:w-4/5 md:h-4/7 
            lg:w-1/2 lg:h-3/4
            overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-black hover:text-red-500 transition duration-300"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedMachine.label}</h2>
            <img src={selectedMachine.picture} alt={selectedMachine.label} className="mb-2" />
            <p><strong>Speed:</strong> {selectedMachine.speed}</p>
            <p className="text-justify"><strong>Details:</strong> {selectedMachine.detail}</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default Machine;
