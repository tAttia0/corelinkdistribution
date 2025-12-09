// src/components/MobileOrderSummary.tsx (FINAL WITH ARABIC DESCRIPTION)
import React from 'react';
import { Card, Typography, InputNumber, Row, Col, Divider, Button, message } from 'antd';
import type { SelectedProduct } from '../types/order';
import { useOrder } from '../context/OrderContext';
import { DeleteOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface MobileOrderSummaryProps {
  products: SelectedProduct[];
  subtotal: number;
  tax: number;
  grandTotal: number;
}

const MobileOrderSummary: React.FC<MobileOrderSummaryProps> = ({ products, subtotal, tax, grandTotal }) => {
  const { updateProductQuantity } = useOrder();

  const handleQuantityChange = (productId: string, value: number | null) => {
    const newQuantity = value === null ? 0 : value;
    updateProductQuantity(productId, newQuantity);
    if (newQuantity <= 0) {
        message.warning('Product removed from the order.');
    }
  };
  
  const handleRemoveItem = (productId: string, productTitle: string) => {
    updateProductQuantity(productId, 0); 
    message.warning(`${productTitle} removed from the order.`);
  };

  return (
    <div>
      {/* Product Cards Loop */}
      {products.map((item) => (
        <Card size="small" style={{ marginBottom: 16 }} key={item.id}>
          <Row justify="space-between" align="top" gutter={[16, 8]}>
            <Col flex="auto">
              <Text strong style={{ fontSize: '1.1em' }}>{item.title}</Text>
              {/* 💡 NEW: Arabic Description below the product title */}
              <Text 
                type="secondary" 
                style={{ 
                    display: 'block', 
                    direction: 'rtl', 
                    textAlign: 'right', 
                    fontSize: '0.9em' 
                }}
              >
                {item.title_ar}
              </Text>
            </Col>
            <Col>
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                size="small"
                onClick={() => handleRemoveItem(item.id, item.title)}
              />
            </Col>
          </Row>

          <Divider style={{ margin: '8px 0' }} />

          <Row gutter={[16, 8]} align="middle">
            {/* Price and Subtotal */}
            <Col xs={12}>
              <Text type="secondary">Price:</Text>
              <Text strong style={{ marginLeft: 8 }}>${item.price.toFixed(2)}</Text>
            </Col>
            <Col xs={12} style={{ textAlign: 'right' }}>
              <Text type="secondary">Subtotal:</Text>
              <Title level={5} style={{ margin: 0, color: '#1890ff' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </Title>
            </Col>
            
            {/* Quantity Input */}
            <Col xs={24}>
              <Row gutter={8} align="middle">
                <Col style={{ whiteSpace: 'nowrap' }}>
                  <Text type="secondary">Quantity:</Text>
                </Col>
                <Col flex="auto">
                  <InputNumber
                    min={1}
                    max={999}
                    value={item.quantity}
                    onChange={(value) => handleQuantityChange(item.id, value)}
                    style={{ width: '100%' }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      ))}
      
      {/* Grand Total Summary Card */}
      <Card size="default" style={{ marginTop: 24, border: '2px solid #1890ff' }}>
        
        {/* Subtotal Row */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
          <Col>
            <Text>Subtotal:</Text>
          </Col>
          <Col>
            <Text strong>${subtotal.toFixed(2)}</Text>
          </Col>
        </Row>

        {/* Tax Row */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
          <Col>
            <Text type="secondary">HST (13% CAD):</Text>
          </Col>
          <Col>
            <Text type="secondary">${tax.toFixed(2)}</Text>
          </Col>
        </Row>
        
        <Divider style={{ margin: '8px 0' }}/>
        
        {/* Grand Total Row */}
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0 }}>Grand Total:</Title>
          </Col>
          <Col>
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
              ${grandTotal.toFixed(2)}
            </Title>
          </Col>
        </Row>
      </Card>
      
    </div>
  );
};

export default MobileOrderSummary;