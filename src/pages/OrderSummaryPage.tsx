import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, List, message, Modal, Row, Typography, InputNumber } from 'antd';
import { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../App';
import { useOrder } from '../context/OrderContext';
import { saveOrder, getAppSettings, type OrderPayload } from '../firebase/api';
import MobileOrderSummary from '../components/MobileOrderSummary'; // 💡 Import your mobile component

const { Title, Text } = Typography;

const OrderSummaryPage = () => {
  const navigate = useNavigate();
  const { 
    companyName, 
    selectedProducts, 
    updateProductQuantity, 
    clearOrder, 
    whatsappNumber, 
    setWhatsappNumber 
  } = useOrder();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // --- 💡 Responsive Listener ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- 💡 State Auto-Heal Hook ---
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

  // Calculations for Mobile Props
  const subtotal = useMemo(() => {
    return selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [selectedProducts]);

  const tax = subtotal * 0.13; // 13% HST as per your Mobile component
  const grandTotal = subtotal + tax;

  if (!companyName || selectedProducts.length === 0) {
    if (selectedProducts.length === 0) {
      message.warning('Your cart is empty.');
    }
    navigate(ROUTES.PRODUCT_SELECTION);
    return null;
  }

  const sendWhatsAppMessage = (orderId: string) => {
    if (!whatsappNumber) {
      message.error("WhatsApp number is still loading.");
      return;
    }

    const cleanNumber = whatsappNumber.replace(/\D/g, '');

    let msg = `*📦 NEW ORDER RECEIVED*%0A`;
    msg += `--------------------------%0A`;
    msg += `*Order ID:* ${orderId}%0A`;
    msg += `*Customer:* ${companyName}%0A`;
    msg += `--------------------------%0A`;

    selectedProducts.forEach((item) => {
      msg += `• ${item.title + ' ' + item.quantityDescription} (${item.title_ar})%0A`;
      msg += `  Qty: ${item.quantity} | Total: $${(item.price * item.quantity).toFixed(2)}%0A`;
    });

    msg += `--------------------------%0A`;
    msg += `*TOTAL AMOUNT: $${grandTotal.toFixed(2)}*%0A`; // 💡 Using Grand Total
    msg += `--------------------------%0A`;
    msg += `_Your order is confirmed._`;

    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${msg}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePlaceOrder = async () => {
    if (!whatsappNumber) {
        message.warning("System settings are still loading...");
        return;
    }

    setIsSubmitting(true);

    const payload: OrderPayload = {
      companyName: companyName,
      selectedProducts: selectedProducts,
      totalAmount: grandTotal, // 💡 Save the grand total
    };

    try {
      const orderId = await saveOrder(payload);

      Modal.success({
        title: 'Order Saved Successfully!',
        icon: <CheckCircleOutlined />,
        content: (
          <div>
            <p>Order for **{companyName}** has been saved.</p>
            <p>Click **OK** to send via WhatsApp.</p>
          </div>
        ),
        onOk() {
          sendWhatsAppMessage(orderId);
          clearOrder();
          navigate(ROUTES.COMPANY_INPUT);
        },
      });

    } catch (error) {
      message.error(`Failed to place order.`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: isMobile ? '10px' : '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={isMobile ? 3 : 2} style={{ marginBottom: 8 }}>Step 2: Order Summary</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Finalizing order for: <Text strong>{companyName}</Text>
      </Text>

      {/* 💡 CONDITIONAL RENDERING: Mobile vs Desktop */}
      {isMobile ? (
        <MobileOrderSummary 
          products={selectedProducts}
          subtotal={subtotal}
          tax={tax}
          grandTotal={grandTotal}
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
                    min={1}
                    max={999}
                    value={item.quantity}
                    onChange={(value) => updateProductQuantity(item.id, value || 1)}
                    style={{ width: '80px' }}
                  />
                ]}
              >
                <List.Item.Meta
                  title={`${item.title} ${item.quantityDescription || ''}`}
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
              <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
            </Col>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Text type="secondary">HST (13%): ${tax.toFixed(2)}</Text>
            </Col>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Title level={4} style={{ margin: 0 }}>Total: ${grandTotal.toFixed(2)}</Title>
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
            onClick={handlePlaceOrder}
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