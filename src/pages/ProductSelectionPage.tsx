// src/pages/ProductSelectionPage.tsx

import { ForwardOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Empty, message, Row, Spin, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../App';
import ProductCard from '../components/ProductCard';
import { useOrder } from '../context/OrderContext';
import { fetchProducts } from '../firebase/api';
import type { Product } from '../types/order';

const { Title, Text } = Typography;

const ProductSelectionPage = () => {
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  // We use addProduct which handles both adding and updating quantity
  const { companyName, selectedProducts, addProduct } = useOrder();

  // Function to get the current quantity of a product for the ProductCard
  const getProductQuantity = (productId: string) => {
    const selected = selectedProducts.find(p => p.id === productId);
    return selected ? selected.quantity : 0;
  };

  // --- Data Fetching Effect (Existing Logic) ---
  useEffect(() => {
    if (!companyName) {
      navigate(ROUTES.COMPANY_INPUT);
      message.error('Please enter company information first.');
      return;
    }

    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setAvailableProducts(data);
      } catch (error) {
        message.error("Failed to load products from the database.");
        setAvailableProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [companyName, navigate]);

  // --- Handler for Product Card Change ---
  // This replaces the old handleAddToCart
  const handleProductChange = useCallback((product: Product, quantity: number) => {
    // The core context function (addProduct) manages the update/removal
    addProduct(product, quantity);

    // Optional: provide dynamic feedback
    if (quantity === 0) {
      message.info(`Removed ${product.title} from cart.`);
    } else if (getProductQuantity(product.id) === 0) {
      message.success(`Added ${product.title} (x${quantity}) to cart.`);
    }
  }, [addProduct]);


  // --- Calculation & Navigation (Existing Logic) ---
  const totalItems = selectedProducts.reduce((sum, item) => sum + item.quantity, 0);

  const handleProceedToSummary = () => {
    if (totalItems > 0) {
      navigate(ROUTES.ORDER_SUMMARY);
    } else {
      message.warning('Please select at least one item for your order.');
    }
  };

  // --- Rendering ---
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '15px' }}>Loading product catalog...</p>
      </div>
    );
  }

  return (
    <div>
      <Title level={2} style={{ marginBottom: 8 }}>
        Step 1: Product Selection
      </Title>
      <Alert title={"Placing order for: " + companyName} style={{ display: 'block', marginBottom: 24 }} type="info" />


      {/* Product List */}
      {availableProducts.length === 0 ? (
        <Empty
          description="No products available at this time."
          style={{ marginTop: 50 }}
        />
      ) : (
        <Row gutter={[24, 24]}>
          {availableProducts.map(product => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
              <ProductCard
                product={product}
                // 💡 FIX: Using the new prop names required by the modified ProductCard
                addProduct={handleProductChange}
                initialQuantity={getProductQuantity(product.id)}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Fixed Footer Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#f0f2f5',
          borderTop: '1px solid #e8e8e8',
          padding: '12px 20px',
          zIndex: 10,
        }}
      >
        <Row justify="space-between" align="middle" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Col>
            <Text style={{ fontSize: '1.1em' }}>
              <ShoppingCartOutlined /> Items Selected: <Text strong>{totalItems}</Text>
            </Text>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              onClick={handleProceedToSummary}
              disabled={totalItems === 0}
            >
              next ({totalItems}) <ForwardOutlined />
            </Button>
          </Col>
        </Row>
      </div>

      {/* Spacer to account for fixed footer */}
      <div style={{ height: '70px' }}></div>
    </div>
  );
};

export default ProductSelectionPage;