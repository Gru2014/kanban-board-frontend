import React, { useState } from "react";
import Modal from "../modal";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModal = () => {
    setIsModalOpen(true);
  };

  return (
    <header className=" bg-blue-500 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-2 sm:gap-6">
            <h1 className="text-xl sm:text-3xl font-semibold text-white">
              Kanban Board
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="px-3 sm:px-4 py-2 text-md font-bold text-blue-500  bg-white hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
              onClick={handleModal}
            >
              + Create
            </button>
            <div className="cursor-pointer">
              <img
                src="https://via.placeholder.com/32"
                alt="User avatar"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </header>
  );
};

export default Header;
