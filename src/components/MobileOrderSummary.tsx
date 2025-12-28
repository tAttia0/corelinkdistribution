// src/components/MobileOrderSummary.tsx
import { DeleteOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Col, Divider, InputNumber, message, Row, Typography } from 'antd';
import React from 'react';
import { useOrder } from '../context/OrderContext';
import type { SelectedProduct } from '../types/order';

const { Text, Title } = Typography;

interface MobileOrderSummaryProps {
  products: SelectedProduct[];
  subtotal: number;
}

const MobileOrderSummary: React.FC<MobileOrderSummaryProps> = ({ products, subtotal }) => {
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
          {/* 💡 Main Row: Keeps Title/Badge on left and Delete on right */}
          <Row justify="space-between" align="middle" wrap={false} gutter={[8, 0]}>
            <Col flex="auto" style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Text strong style={{ fontSize: '1.1em', marginRight: 8 }}>
                    {item.companyName + '-' + item.title + ' ' + item.quantityDescription}
                  </Text>
                  
                  {/* 💡 SOLD OUT Badge stays inline with text */}
                  {item.isSoldOut && (
                    <Badge
                      count="SOLD OUT"
                      style={{ backgroundColor: 'red', fontSize: '10px', verticalAlign: 'middle' }}
                    />
                  )}
                </div>
                
                {/* Arabic Title stays below but in the same left column */}
                <Text 
                  type="secondary" 
                  style={{ 
                    display: 'block', 
                    fontSize: '0.9em',
                    marginTop: 2 
                  }}
                >
                  {item.title_ar}
                </Text>
              </div>
            </Col>

            <Col flex="none">
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
              <Row gutter={8} align="middle" wrap={false}>
                <Col style={{ whiteSpace: 'nowrap' }}>
                  <Text type="secondary">Quantity:</Text>
                </Col>
                <Col flex="auto">
                  <InputNumber
                    mode='spinner'
                    min={1}
                    max={99}
                    value={item.quantity}
                    onChange={(value) => handleQuantityChange(item.id, value)}
                    style={{ 
                      width: '100%',
                      border: item.isSoldOut ? '1px solid red' : undefined
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      ))}
      
      {/* Grand Total Summary Card */}
      <Card size="default" style={{ marginTop: 24, border: '2px solid #1890ff' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
          <Col>
            <Text>Total:</Text>
          </Col>
          <Col>
            <Text strong style={{ fontSize: '1.2em' }}>${subtotal.toFixed(2)}</Text>
          </Col>
        </Row>

        <Row justify="space-between" align="middle" style={{ marginBottom: 4 }}>
          <Col span={24}>
            <Text type="secondary">Tax will be added if applicable.</Text>
          </Col>
        </Row>
        
        <Divider style={{ margin: '8px 0' }}/>
      </Card>
    </div>
  );
};

export default MobileOrderSummary;