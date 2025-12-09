// src/components/ProductCard.tsx (MODIFIED: Quantity Input size and limit)

import React, { useState, useCallback } from 'react';
import { Card, Button, Typography, Row, Col, InputNumber, Checkbox, Modal, Image } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { Product } from '../types/order';

const { Text } = Typography;

// --- Interface Definition ---
interface ProductCardProps {
  product: Product;
  onProductChange: (product: Product, quantity: number) => void; 
  initialQuantity: number; 
}

// --- Component ---
const ProductCard: React.FC<ProductCardProps> = ({ product, onProductChange, initialQuantity }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(initialQuantity > 0 ? initialQuantity : 0);
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
  
  // --- Quantity and Checkbox Handlers ---
  const handleQuantityChange = useCallback((value: number | null) => {
    const newQuantity = value === null || value < 0 ? 0 : value;
    // Enforce max 99 (two digits)
    const restrictedQuantity = Math.min(newQuantity, 99); 

    setQuantity(restrictedQuantity);
    onProductChange(product, restrictedQuantity);
  }, [product, onProductChange]);

  const handleCheckboxChange = useCallback((e: any) => {
    const isChecked = e.target.checked;
    const newQuantity = isChecked ? 1 : 0; 
    setQuantity(newQuantity);
    onProductChange(product, newQuantity);
  }, [product, onProductChange]);

  const isSelected = quantity > 0;

  return (
    <>
      <Card
        hoverable
        style={{ width: '100%', borderRadius: 8, overflow: 'hidden' }}
      >
        
        {/* Title Block (Above Image) */}
        <div 
            style={{ 
                color: 'black', 
                fontWeight: 'bold', 
                textAlign: 'center', 
                paddingBottom: '10px' 
            }}
        >
            {/* Line 1: English Title */}
            <Text strong style={{ color: 'black', display: 'block', fontSize: '1em' }}>{product.title}</Text>
            {/* Line 2: Arabic Title */}
            <Text strong style={{ color: 'black', display: 'block', fontSize: '0.9em' }}>{product.title_ar}</Text>
            {/* Line 3: Price */}
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
            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
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
        
        <Card.Meta description={null} />

        {/* Checkbox and Quantity Input: Now on the same line */}
        <Row gutter={10} align="middle" style={{ marginTop: 15 }}>
          
          {/* Checkbox (Takes minimal space) */}
          <Col>
            <Checkbox checked={isSelected} onChange={handleCheckboxChange}>
              Select
            </Checkbox>
          </Col>
          
          {/* InputNumber (Fixed width for 2 digits) */}
          <Col>
            <InputNumber
              min={isSelected ? 1 : 0} 
              max={99} // 💡 Enforce two-digit maximum
              value={quantity}
              onChange={handleQuantityChange}
              disabled={!isSelected}
              style={{ width: '80px' }} // 💡 Set fixed width for two digits
              size="large"
            />
          </Col>
        </Row>
      </Card>

      {/* Image Zoom Modal (Remains the same) */}
      <Modal
        title={product.title}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
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