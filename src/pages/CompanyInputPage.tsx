import { HomeOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Row, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../App';
import { useOrder } from '../context/OrderContext';
import { getAppSettings } from '../firebase/api';

const { Title, Text } = Typography;

const CompanyInputPage = () => {
  const navigate = useNavigate();
  
  // 💡 ADDED: setCity to the destructuring
  const { companyName, setCompanyName, setCity, setWhatsappNumber } = useOrder();
  const [form] = Form.useForm();

  const [validAccessCode, setValidAccessCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getAppSettings();

        if (settings) {
          setValidAccessCode(settings.accessCode);
          setWhatsappNumber(settings.whatsAppNumber);
        } else {
          message.error("Configuration could not be loaded.");
        }
      } catch (error) {
        message.error("Database connection failed.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [setWhatsappNumber]);

  // --- Form Submission Handler ---
  const onFinish = (values: { companyName: string, city: string, accessCode: string }) => {
    setSubmitting(true);

    if (values.accessCode === validAccessCode) {
      // 💡 FIXED: Save BOTH company name and city to the global context
      setCompanyName(values.companyName);
      setCity(values.city); 

      message.success(`Access granted for ${values.companyName} in ${values.city}.`);
      setSubmitting(false);
      navigate(ROUTES.PRODUCT_SELECTION);
    } else {
      message.error('Invalid access code.');
      form.resetFields(['accessCode']);
      setSubmitting(false);
    }
  };

  const CARD_BACKGROUND_COLOR = 'rgb(0, 21, 41)';
  const CARD_FOREGROUND_COLOR = 'white';
  const PRIMARY_COLOR = '#1890ff';

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '15px' }}>Initializing application settings...</p>
      </div>
    );
  }

  if (!validAccessCode) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <Title level={3} type="danger">Configuration Error</Title>
        <Text>The application could not load the required access code from the database.</Text>
      </div>
    );
  }

  return (
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

            {/* City Input Field */}
            <Form.Item
              label={<span style={{ color: CARD_FOREGROUND_COLOR }}>City</span>}
              name="city"
              rules={[{ required: true, message: 'Please enter the city!' }]}
            >
              <Input
                prefix={<HomeOutlined style={{ color: PRIMARY_COLOR }} />}
                placeholder="Enter City"
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