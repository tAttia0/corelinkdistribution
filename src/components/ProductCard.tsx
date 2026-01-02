// src/components/ProductCard.tsx
import { LeftOutlined, MinusOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Image, Modal, Typography } from 'antd';
import React, { useState } from 'react';
import type { Product } from '../types/order';

const { Text } = Typography;

interface ProductCardProps {
  product: Product;
  addProduct: (product: Product, quantity: number) => void;
  initialQuantity: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addProduct, initialQuantity }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [modalVisible, setModalVisible] = useState(false);

  const totalImages = product.images.length;
  const currentImageUrl = totalImages > 0 ? product.images[currentImageIndex] : 'https://via.placeholder.com/300x200?text=No+Image';

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  // 💡 Handlers for the Custom Buttons
  const increment = () => {
    const newQty = Math.min(quantity + 1, 99);
    setQuantity(newQty);
    addProduct(product, newQty);
  };

  const decrement = () => {
    const newQty = Math.max(quantity - 1, 0);
    setQuantity(newQty);
    addProduct(product, newQty);
  };

  return (
    <Badge.Ribbon
      text={product.isSoldOut ? 'SOLD OUT' : 'IN STOCK'}
      color={product.isSoldOut ? 'red' : 'blue'}
      style={{ marginTop: '-15px' }}>
      <Card
        hoverable
        style={{ width: '100%', borderRadius: 8, overflow: 'hidden' }}
      >
        {/* Title Block */}
        <div style={{ textAlign: 'center', paddingBottom: '10px' }}>
          <Text strong style={{ display: 'block', fontSize: '1em' }}>{product.companyName + '-' + product.title}</Text>
          <Text strong style={{ display: 'block', fontSize: '0.9em' }}>{product.title_ar}</Text>
          <Text strong style={{ display: 'block', fontSize: '1em' }}>{product.quantityDescription}</Text>
          <Text strong style={{ display: 'block', marginTop: '4px' }}>${(product.price || 0).toFixed(2)}</Text>
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
                style={{ position: 'absolute', left: 5, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
              />
              <Button
                icon={<RightOutlined />}
                size="small"
                onClick={handleNext}
                style={{ position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
              />
            </>
          )}
        </div>

        {/* 💡 CUSTOM QUANTITY CONTROL (Keyboard-Proof) */}
        <div style={{
          marginTop: 15,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: product.isSoldOut ? '2px solid red' : '1px solid #d9d9d9',
          borderRadius: '6px',
          padding: '4px'
        }}>
          <Button
            type="text"
            icon={<MinusOutlined />}
            onClick={decrement}
            disabled={quantity <= 0}
            style={{ width: '30%' }}
          />

          <div style={{ flex: 1, textAlign: 'center' }}>
            <Text strong style={{ fontSize: '1.2em' }}>{quantity}</Text>
          </div>

          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={increment}
            disabled={quantity >= 99}
            style={{ width: '30%' }}
          />
        </div>
      </Card>

      {/* Modal Section */}
      <Modal
        title={product.title}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={400}
        centered
      >
        <Image src={currentImageUrl} preview={false} style={{ width: '100%', height: 'auto' }} />
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              style={{
                width: 50, height: 50, margin: 5, objectFit: 'cover', cursor: 'pointer',
                border: index === currentImageIndex ? '2px solid #1890ff' : '1px solid #ccc',
              }}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </Modal>
    </Badge.Ribbon>
  );
};

export default ProductCard;