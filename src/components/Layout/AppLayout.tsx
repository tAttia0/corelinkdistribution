// src/components/Layout/AppLayout.tsx
import { Layout } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const { Content } = Layout;

// Define custom styles for the fixed header
const headerStyle: React.CSSProperties = {
  position: 'fixed', // Makes the header sticky/fixed
  zIndex: 10,
  width: '100%',
  padding: 0,
  lineHeight: '64px', // Antd default header height
  backgroundColor: '#001529', // Antd default dark header color
};

// Define custom styles for the main content area
const contentStyle: React.CSSProperties = {
  padding: '24px',
  marginTop: 64, // Margin for the fixed header
  minHeight: 'calc(100vh - 64px)', // The height of the fixed header is 64px
};

const AppLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Fixed/Sticky NavBar (Header) */}
      <Layout.Header style={headerStyle}>
        <NavBar />
      </Layout.Header>

      {/* Main Content Area */}
      <Content style={contentStyle}>
        
          {/* This is where the specific page component (e.g., CompanyInputPage) is rendered */}
          <Outlet />
        
      </Content>


    </Layout>
  );
};

export default AppLayout;