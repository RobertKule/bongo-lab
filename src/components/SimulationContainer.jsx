import React from 'react';

/**
 * Wrapper for simulation views, providing consistent layout.
 * @param {{ children: React.ReactNode }} props
 */
const SimulationContainer = ({ children }) => {
  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-gray-50">
      {children}
    </div>
  );
};

export default SimulationContainer;
