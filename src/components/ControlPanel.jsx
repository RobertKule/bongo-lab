import React from 'react';

/**
 * Reusable control panel for simulation parameters.
 * @param {{ children: React.ReactNode }} props
 */
const ControlPanel = ({ children }) => {
  return (
    <div className="control-panel">
      {children}
    </div>
  );
};

export default ControlPanel;
