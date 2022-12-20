import React from 'react';

function StatusMessages({ isLoading, isSuccess, isGoodVibes }) {
  return (
    <div>
      <div className={`loading-message ${isLoading ? 'visible' : 'hidden'}`}>
        Confirm to send vibes...
      </div>
      <div className={`success-message ${isSuccess ? 'visible' : 'hidden'}`}>
        Vibes Sent!
      </div>
      <div className={`good-vibes-message ${isGoodVibes ? 'visible' : 'hidden'}`}>
        Sending Good Vibes into the Metaverse...
      </div>
    </div>
  );
}

export default StatusMessages;
