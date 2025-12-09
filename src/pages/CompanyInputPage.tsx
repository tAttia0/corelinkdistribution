// src/pages/CompanyInputPage.tsx (MODIFIED LAYOUT AND INTEGRATED FIREBASE)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Form, Card, Typography, message, Row, Col, Spin } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ROUTES } from '../App';
import { useOrder } from '../context/OrderContext';
import { getAccessCode } from '../firebase/api'; // 💡 Import the Firebase API function

const { Title, Text } = Typography;

const CompanyInputPage: React.FC = () => {
  const navigate = useNavigate();
  const { companyName, setCompanyName } = useOrder();
  const [form] = Form.useForm();
  
  // --- Firebase Integration States ---
  const [validAccessCode, setValidAccessCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Initial loading state for fetching code
  const [submitting, setSubmitting] = useState(false); // State for form submission

  // --- Fetch Access Code from Database ---
  useEffect(() => {
    const fetchCode = async () => {
      try {
        const code = await getAccessCode(); 
        setValidAccessCode(code);

        if (!code) {
          message.error("Access code could not be loaded from settings.");
        }
      } catch (error) {
        message.error("Failed to connect to the database to load access code.");
      } finally {
        setLoading(false);
      }
    };
    fetchCode();
  }, []);
  
  // --- Form Submission Handler (Integrated Firebase Check) ---
  const onFinish = (values: { companyName: string, accessCode: string }) => {
    setSubmitting(true);

    if (values.accessCode === validAccessCode) {
      setCompanyName(values.companyName);
      message.success(`Access granted for ${values.companyName}.`);
      setSubmitting(false);
      navigate(ROUTES.PRODUCT_SELECTION);
    } else {
      message.error('Invalid access code.');
      form.resetFields(['accessCode']); // Clear password field
      setSubmitting(false);
    }
  };

  // --- Styling Constants ---
  const CARD_BACKGROUND_COLOR = 'rgb(0, 21, 41)'; // Dark background
  const CARD_FOREGROUND_COLOR = 'white'; // White text
  const PRIMARY_COLOR = '#1890ff'; // Default Ant Design Blue

  // --- Loading / Error Rendering ---
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '15px' }}>Initializing application settings...</p>
      </div>
    );
  }

  // If code failed to load entirely
  if (!validAccessCode) {
      return (
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
              <Title level={3} type="danger">Configuration Error</Title>
              <Text>The application could not load the required access code from the database.</Text>
          </div>
      );
  }

  // --- Main Render ---
  return (
    // Use Row and Col to center the card vertically and horizontally
    <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
      <Col xs={24} sm={20} md={12} lg={8} xl={6}>
        <Card 
          style={{ 
            width: '100%', 
            backgroundColor: CARD_BACKGROUND_COLOR, 
            borderRadius: 10,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
          styles={{ body: { padding: '40px 30px', textAlign: 'center' } }}
        >
          <Title level={3} style={{ color: CARD_FOREGROUND_COLOR, marginBottom: 30 }}>
            Start Your Order
          </Title>
          
          <Form
            form={form}
            name="company_input"
            initialValues={{ companyName }}
            onFinish={onFinish}
            layout="vertical"
          >
            {/* Company Name Input */}
            <Form.Item
              label={<span style={{ color: CARD_FOREGROUND_COLOR }}>Company Name</span>}
              name="companyName"
              rules={[{ required: true, message: 'Please enter the company name!' }]}
            >
              <Input 
                prefix={<UserOutlined style={{ color: PRIMARY_COLOR }} />} 
                placeholder="Enter Company Name" 
                size="large" 
              />
            </Form.Item>

            {/* Access Code Input */}
            <Form.Item
              label={<span style={{ color: CARD_FOREGROUND_COLOR }}>Access Code</span>}
              name="accessCode"
              rules={[{ required: true, message: 'Please enter the access code!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined style={{ color: PRIMARY_COLOR }} />}
                placeholder="Access Code" 
                size="large" 
              />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item style={{ marginTop: 20 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={submitting}
                style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
              >
                Continue
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default CompanyInputPage;