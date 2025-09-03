import { useState } from 'react';
import VariantsManager from '../components/VariantsManager';
import VariantsTable from '../components/VariantsTable';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
  const [options, setOptions] = useState([]);
  const [variants, setVariants] = useState([]);

  const generateVariants = (options) => {
    if (options.length === 0) return [];
    
    const invalidOptions = options.filter(option => 
      !option.name.trim() || option.values.length === 0
    );
    
    if (invalidOptions.length > 0) return [];
    
    const combinations = options.reduce((acc, option) => {
      if (acc.length === 0) {
        return option.values.map(value => [value]);
      }
      
      const newAcc = [];
      acc.forEach(combination => {
        option.values.forEach(value => {
          newAcc.push([...combination, value]);
        });
      });
      return newAcc;
    }, []);

    return combinations.map((combination, index) => ({
      id: index + 1,
      combination,
      price: 0.00,
      inventory: 0
    }));
  };

  const handleOptionsChange = (newOptions) => {
    setOptions(newOptions);
    setVariants(generateVariants(newOptions));
  };

  const handleVariantUpdate = (variantId, field, value) => {
    setVariants(prev => prev.map(variant => 
      variant.id === variantId 
        ? { ...variant, [field]: parseFloat(value) || 0 }
        : variant
    ));
  };

  return (
    <div className={styles.dashboard}>
      <h1>Product Variants</h1>
      
      {variants.length > 0 ? (
        <VariantsTable 
          options={options}
          variants={variants}
          onVariantUpdate={handleVariantUpdate}
        />
      ) : (
        <div className={styles.emptyState}>
          <p>No variants available. Add product options below to generate variants.</p>
        </div>
      )}
      
      <VariantsManager 
        options={options}
        onOptionsChange={handleOptionsChange}
      />
    </div>
  );
}
