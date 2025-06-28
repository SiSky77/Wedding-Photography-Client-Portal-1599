import React from 'react';
import { HelpHub } from '@questlabs/react-sdk';
import { useAuth } from '../../contexts/AuthContext';
import questConfig from '../../config/questConfig';

const AppHelp = () => {
  const { user } = useAuth();
  
  // Generate a unique user ID based on the logged-in user or fallback to demo
  const uniqueUserId = user?.id || localStorage.getItem('userId') || questConfig.USER_ID;

  return (
    <div style={{ zIndex: 9999 }}>
      <HelpHub
        uniqueUserId={uniqueUserId}
        questId={questConfig.QUEST_HELP_QUESTID}
        accent={questConfig.PRIMARY_COLOR}
        botLogo={{
          logo: 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1741000949338-Vector%20%282%29.png'
        }}
        styleConfig={{
          zIndex: 9999,
          position: 'fixed'
        }}
      />
    </div>
  );
};

export default AppHelp;