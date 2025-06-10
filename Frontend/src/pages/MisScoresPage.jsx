// src/pages/MisScoresPage.jsx
import React from 'react';
import SideBar from '../components/mainMenu/SideBar';
import ScoresHistory from '../components/ScoresHistory';

const MisScoresPage = () => (
  <div style={{ display: 'flex', height: '100vh' }}>
    <SideBar />

    {/* main azul, que crece */}
    <main style={{
      flex: 1,
      backgroundColor: '#d5ecfd',
      overflow: 'auto',
    }}>
      <ScoresHistory />
    </main>
  </div>
);

export default MisScoresPage;
