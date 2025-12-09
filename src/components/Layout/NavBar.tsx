// src/components/Layout/NavBar.tsx
import { Col, Row, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../App'; // Import the defined routes

const { Title } = Typography;

const NavBar = () => {
  return (
    // The Antd Row's height is implicitly set by the parent Header's height (64px)
    <Row
      justify="center" // 💡 Horizontally centers content
      align="middle" // 💡 Vertically centers content (Middle alignment)
      style={{ height: '100%' }} // Ensure the Row takes the full height of the Header
    >
      <Col>
        <Link to={ROUTES.COMPANY_INPUT} style={{ textDecoration: 'none' }}>
          <Title level={3} style={{ color: '#fff', margin: 0, padding: 0 }}>
            {/* margin: 0 and padding: 0 prevent Title from interfering with centering */}
            Corelink Distribution Inc.
          </Title>
        </Link>
      </Col>

      {/* Removed the second empty Col, as it interferes with simple centering */}

    </Row>
  );
};

export default NavBar;