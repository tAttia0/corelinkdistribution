import { DeleteOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Col, Divider, InputNumber, List, message, Popconfirm, Row, Typography } from 'antd';
import { doc, getDoc, getFirestore, increment, setDoc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../App';
import MobileOrderSummary from '../components/MobileOrderSummary';
import { useOrder } from '../context/OrderContext';
import { getAppSettings } from '../firebase/api';

const { Title, Text } = Typography;

const OrderSummaryPage = () => {
  const navigate = useNavigate();
  const {
    companyName,
    city,
    selectedProducts,
    updateProductQuantity,
    clearOrder,
    whatsappNumber,
    setWhatsappNumber
  } = useOrder();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const syncSettings = async () => {
      if (!whatsappNumber) {
        try {
          const settings = await getAppSettings();
          if (settings?.whatsAppNumber) {
            setWhatsappNumber(settings.whatsAppNumber);
          }
        } catch (err) {
          console.error("Failed to sync WhatsApp number:", err);
        }
      }
    };
    syncSettings();
  }, [whatsappNumber, setWhatsappNumber]);

  // --- Logic: Generate Daily Order ID (YYYYMMDD_SN) ---
  const getOrderIdentifier = async () => {
    const db = getFirestore();
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0].replace(/-/g, '');

    const counterRef = doc(db, 'settings', 'order_counters');

    try {
      await setDoc(counterRef, { [dateKey]: increment(1) }, { merge: true });
      const snap = await getDoc(counterRef);
      const sn = snap.data()?.[dateKey] || 1;
      return `${dateKey}_${sn.toString().padStart(2, '0')}`;
    } catch (e) {
      console.error("Counter error:", e);
      return `${dateKey}_${Math.floor(Math.random() * 90 + 10)}`;
    }
  };

  const subtotal = useMemo(() => {
    return selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [selectedProducts]);

  if (!companyName || selectedProducts.length === 0) {
    navigate(ROUTES.PRODUCT_SELECTION);
    return null;
  }

  const handleSendWhatsApp = async () => {
    if (!whatsappNumber) {
      message.warning("WhatsApp number is still loading...");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = await getOrderIdentifier();
      const now = new Date();
      const orderDate = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      const cleanNumber = whatsappNumber.replace(/\D/g, '');
      const separator = String.fromCharCode(45).repeat(50) + '%0A';
      const tab = '%20%20%20%20%20%20';

      let msg = `*NEW ORDER RECEIVED*%0A`;
      msg += separator;
      msg += `*Order ID:* ${orderId}%0A`;
      msg += `*Date:* ${orderDate}%0A`;
      msg += `*Customer:* ${companyName}%0A`;
      msg += `*City:* ${city || 'Not Specified'}%0A`;
      msg += separator;

      selectedProducts.forEach((item) => {
        const soldOutTag = item.isSoldOut ? ' [SOLD OUT]' : '';
        const desc = item.quantityDescription ? ` - ${item.quantityDescription}` : '';
        const title_ar = item.title_ar ? ` - ${item.title_ar}` : '';
        msg += `• *${item.title}${desc}${title_ar}*%0A`;
        msg += `${tab}Qty: ${item.quantity} | Total: $${(item.price * item.quantity).toFixed(2)}${soldOutTag}%0A`;
      });

      msg += separator;
      msg += `*Subtotal:* $${subtotal.toFixed(2)}%0A`;
      msg += `*Tax will be added if applicable.%0A`;
      msg += separator;
      msg += `_Your order is confirmed._`;

      const whatsappUrl = `https://wa.me/${cleanNumber}?text=${msg}`;
      window.open(whatsappUrl, '_blank');

      clearOrder();
      navigate(ROUTES.COMPANY_INPUT);
      message.success("WhatsApp opened and order cleared.");
    } catch (error) {
      message.error("Error processing order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: isMobile ? '10px' : '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={isMobile ? 3 : 2} style={{ marginBottom: 8 }}>Step 2: Order Summary</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Order for: <Text strong>{companyName}</Text> {city && `(${city})`}
      </Text>

      {isMobile ? (
        <MobileOrderSummary
          products={selectedProducts}
          subtotal={subtotal}
        />
      ) : (
        <Card title="Order Items" style={{ marginBottom: 20 }}>
          <List
            itemLayout="horizontal"
            dataSource={selectedProducts}
            renderItem={item => (
              <List.Item
                actions={[
                  <InputNumber
                    mode='spinner'
                    min={1}
                    max={99}
                    value={item.quantity}
                    onChange={(value) => updateProductQuantity(item.id, value || 1)}
                    style={{
                      width: '120px',
                      border: item.isSoldOut ? '1px solid red' : undefined
                    }}
                  />,
                  <Popconfirm
                    title="Remove this item?"
                    onConfirm={() => updateProductQuantity(item.id, 0)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined style={{ fontSize: '18px' }} />}
                    />
                  </Popconfirm>
                ]}
              >
                <List.Item.Meta
                  title={
                    <span>
                      {`${item.title} ${item.quantityDescription || ''}`}
                      {item.isSoldOut && (
                        <Badge
                          count="SOLD OUT"
                          style={{ backgroundColor: 'red', marginLeft: 10, fontSize: '10px' }}
                        />
                      )}
                    </span>
                  }
                  description={item.title_ar}
                />
                <Text strong style={{ minWidth: '80px', textAlign: 'right' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </List.Item>
            )}
          />
          <Divider />
          <Row gutter={[0, 8]}>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Text strong style={{ fontSize: '1.2em' }}>Total: ${subtotal.toFixed(2)}</Text>
            </Col>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Text type="secondary">Tax will be added if applicable.</Text>
            </Col>
          </Row>
        </Card>
      )}

      <Row gutter={[16, 16]} justify="end" style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Button onClick={() => navigate(ROUTES.PRODUCT_SELECTION)} size="large" block>
            Back to Selection
          </Button>
        </Col>
        <Col xs={24} sm={12} md={10}>
          <Button
            type="primary"
            size="large"
            onClick={handleSendWhatsApp}
            loading={isSubmitting}
            disabled={!whatsappNumber}
            block
          >
            Send WhatsApp
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default OrderSummaryPage;