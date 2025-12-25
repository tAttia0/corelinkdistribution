// src/components/ProductCard.tsx

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Card, Col, Image, InputNumber, Modal, Row, Typography } from 'antd';
import React, { useCallback, useState } from 'react';
import type { Product } from '../types/order';

const { Text } = Typography;

interface ProductCardProps {
  product: Product;
  onProductChange: (product: Product, quantity: number) => void;
  initialQuantity: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductChange, initialQuantity }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [modalVisible, setModalVisible] = useState(false);

  const totalImages = product.images.length;
  const currentImageUrl = totalImages > 0 ? product.images[currentImageIndex] : 'https://via.placeholder.com/300x200?text=No+Image';

  // --- Image Navigation ---
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  // --- Quantity Handler ---
  const handleQuantityChange = useCallback((value: number | null) => {
    const newQuantity = value === null || value < 0 ? 0 : value;
    const restrictedQuantity = Math.min(newQuantity, 99);

    setQuantity(restrictedQuantity);
    onProductChange(product, restrictedQuantity);
  }, [product, onProductChange]);

  return (
    <>
      <Card
        hoverable
        style={{ width: '100%', borderRadius: 8, overflow: 'hidden' }}
      >
        {/* Title Block */}
        <div
          style={{
            color: 'black',
            fontWeight: 'bold',
            textAlign: 'center',
            paddingBottom: '10px'
          }}
        >
          <Text strong style={{ color: 'black', display: 'block', fontSize: '1em' }}>{product.companyName + '-' + product.title}</Text>
          <Text strong style={{ color: 'black', display: 'block', fontSize: '0.9em' }}>{product.title_ar}</Text>
          <Text strong style={{ color: 'black', display: 'block', fontSize: '0.7em' }}>{product.quantityDescription}</Text>
          <Text strong style={{ color: 'black', display: 'block', marginTop: '4px' }}>${product.price.toFixed(2)}</Text>
        </div>

        {/* Image Cover Section */}
        <div
          style={{ position: 'relative', height: 160, cursor: 'pointer', overflow: 'hidden' }}
          onClick={() => setModalVisible(true)}
        >
          <img
            alt={product.title}
            src={currentImageUrl}
            style={{ height: '100%', width: '100%', objectFit: 'contain' }}
          />
          {totalImages > 1 && (
            <>
              <Button
                icon={<LeftOutlined />}
                size="small"
                onClick={handlePrev}
                style={{ position: 'absolute', left: 5, top: '50%', transform: 'translateY(-50%)' }}
              />
              <Button
                icon={<RightOutlined />}
                size="small"
                onClick={handleNext}
                style={{ position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)' }}
              />
            </>
          )}
        </div>

        <Card.Meta />

        {/* 💡 Quantity Input: Spans full width (same as image) */}
        <Row style={{ marginTop: 15 }}>
          <Col span={24}>
            {product.isSoldOut ?
              <Text strong style={{ color: 'white', display: 'block', fontSize: '1em', textAlign: 'center',backgroundColor:'red' }}>SOLD OUT</Text> :
              <InputNumber
                mode='spinner'
                min={0}
                max={99}
                value={quantity}
                onChange={handleQuantityChange}
                style={{ width: '100%' }} // 💡 Full width to match card/image
                size="large"
                placeholder="Qty"
              />

            }
          </Col>
        </Row>
        <Row>


        </Row>
      </Card>

      {/* Image Zoom Modal */}
      <Modal
        title={product.title}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={400}
        centered
      >
        <Image
          src={currentImageUrl}
          alt={product.title}
          preview={false}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              style={{
                width: 50,
                height: 50,
                margin: 5,
                objectFit: 'cover',
                cursor: 'pointer',
                border: index === currentImageIndex ? '2px solid #1890ff' : '1px solid #ccc',
              }}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </Modal>
    </>
  );
};

export default ProductCard;