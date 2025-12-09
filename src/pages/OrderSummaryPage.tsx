// src/pages/OrderSummaryPage.tsx (COMPLETE CODE)

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Row, Col, List, Card, message, Divider, Modal } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useOrder } from '../context/OrderContext';
import { saveOrder, type OrderPayload } from '../firebase/api'; // 💡 IMPORT API AND PAYLOAD TYPE
import { ROUTES } from '../App';

const { Title, Text } = Typography;

const OrderSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const { companyName, selectedProducts, updateProductQuantity, clearOrder } = useOrder();

  // Redirect if critical data is missing
  if (!companyName || selectedProducts.length === 0) {
    // Navigate back to company input if order is empty
    if (selectedProducts.length === 0) {
        message.warning('Your cart is empty. Please select products first.');
    }
    navigate(ROUTES.PRODUCT_SELECTION);
    return null;
  }

  // Calculate total amount whenever selectedProducts changes
  const totalAmount = useMemo(() => {
    return selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [selectedProducts]);

  // --- Handlers ---

  const handlePlaceOrder = async () => {
    const payload: OrderPayload = {
      companyName: companyName, // guaranteed not null by the check above
      selectedProducts: selectedProducts,
      totalAmount: totalAmount,
    };

    try {
      // 💡 CALL THE FIREBASE SAVE FUNCTION
      const orderId = await saveOrder(payload);
      
      // Clear the context state immediately after successful save
      clearOrder(); 

      // Show success modal
      Modal.success({
        title: 'Order Placed Successfully!',
        icon: <CheckCircleOutlined />,
        content: (
          <div>
            <p>Your order for **{companyName}** has been saved.</p>
            <p>Order ID: **{orderId}**</p>
          </div>
        ),
        onOk() {
          navigate(ROUTES.COMPANY_INPUT); // Redirect back to start
        },
      });

    } catch (error) {
      // Show generic error message
      message.error(`Failed to place order: Please try again.`);
      console.error(error);
    }
  };

  return (
    <div>
      <Title level={2} style={{ marginBottom: 8 }}>
        Step 3: Order Summary
      </Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Finalizing order for: <Text strong>{companyName}</Text>
      </Text>

      {/* Order Details List */}
      <Card title="Order Items" style={{ marginBottom: 20 }}>
        <List
          itemLayout="horizontal"
          dataSource={selectedProducts}
          renderItem={item => (
            <List.Item
              actions={[
                // Simple quantity controls
                <Button 
                  onClick={() => updateProductQuantity(item.id, item.quantity + 1)} 
                  size="small"
                >
                  +
                </Button>,
                <Text style={{ width: 20, textAlign: 'center' }}>{item.quantity}</Text>,
                <Button 
                  onClick={() => updateProductQuantity(item.id, item.quantity - 1)} 
                  size="small" 
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={item.title}
                description={item.title_ar}
              />
              <Text strong>${(item.price * item.quantity).toFixed(2)}</Text>
            </List.Item>
          )}
        />
        <Divider />
        <Row justify="end">
          <Col>
            <Title level={4}>Total: ${totalAmount.toFixed(2)}</Title>
          </Col>
        </Row>
      </Card>
      
      {/* Action Buttons */}
      <Row gutter={16} justify="end">
        <Col>
          <Button 
            onClick={() => navigate(ROUTES.PRODUCT_SELECTION)}
            size="large"
          >
            Back to Selection
          </Button>
        </Col>
        <Col>
          <Button 
            type="primary" 
            size="large" 
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default OrderSummaryPage;