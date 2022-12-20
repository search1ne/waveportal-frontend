import React, { useState } from 'react';

const CustomMessageForm = ({ wave }) => {
  const [customMessage, setCustomMessage] = useState('');

  const handleMessageChange = (event) => {
    setCustomMessage(event.target.value);
    console.log("Custom message:", customMessage);
  };

  return (
    <div className="waveForm">
      
      <div>
        <label htmlFor="custom-message">Enter your custom message:</label>
      </div>
      
      <div>
        <input
          type="text"
          id="custom-message"
          placeholder="send some good vibes"
          value={customMessage}
          onChange={handleMessageChange}
        />
      </div>
      
      <div>
        <button className="button" onClick={() => wave(customMessage)}>Send GM👋</button>
      </div>
      
    </div>
  );
};

export default CustomMessageForm;
