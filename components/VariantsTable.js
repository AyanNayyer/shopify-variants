import { useState } from 'react';
import styles from '../styles/VariantsTable.module.css';

export default function VariantsTable({ options, variants, onVariantUpdate }) {
  const [groupBy, setGroupBy] = useState(options[0]?.name || '');
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  const toggleVariantSelection = (variantId) => {
    setSelectedVariants(prev => 
      prev.includes(variantId)
        ? prev.filter(id => id !== variantId)
        : [...prev, variantId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedVariants(prev => 
      prev.length === variants.length ? [] : variants.map(v => v.id)
    );
  };

  const toggleGroupExpansion = (groupName) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const collapseAll = () => setExpandedGroups(new Set());
  const expandAll = () => setExpandedGroups(new Set(Object.keys(groupVariants())));

  const groupVariants = () => {
    if (!groupBy) return variants;
    
    const grouped = {};
    const groupOptionIndex = options.findIndex(option => option.name === groupBy);
    
    if (groupOptionIndex === -1) return variants;
    
    variants.forEach(variant => {
      const groupValue = variant.combination[groupOptionIndex];
      if (!grouped[groupValue]) grouped[groupValue] = [];
      grouped[groupValue].push(variant);
    });
    
    return grouped;
  };

  const filterVariants = (variantsToFilter) => {
    if (!searchTerm.trim()) return variantsToFilter;
    
    return variantsToFilter.filter(variant => {
      const variantText = variant.combination.join(' ').toLowerCase();
      return variantText.includes(searchTerm.toLowerCase());
    });
  };

  const groupedVariants = groupVariants();
  const filteredVariants = filterVariants(variants);
  const totalInventory = variants.reduce((sum, variant) => sum + variant.inventory, 0);

  return (
    <div className={styles.variantsTable}>
      <div className={styles.tableHeader}>
        <div className={styles.groupControls}>
          <span>Group by</span>
          <select 
            value={groupBy} 
            onChange={(e) => setGroupBy(e.target.value)}
            className={styles.select}
          >
            {options.map(option => (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.searchControls}>
          {showSearch ? (
            <input
              type="text"
              placeholder="Search variants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              autoFocus
            />
          ) : (
            <span onClick={() => setShowSearch(true)}>🔍</span>
          )}
          <span onClick={() => setShowSearch(false)}>☰</span>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedVariants.length === variants.length}
                  onChange={toggleSelectAll}
                />
                Variant • <button className={styles.collapseBtn} onClick={collapseAll}>Collapse all</button> • <button className={styles.expandAllBtn} onClick={expandAll}>Expand all</button>
              </th>
              <th>Price</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {typeof groupedVariants === 'object' && !Array.isArray(groupedVariants) 
              ? Object.entries(groupedVariants).map(([groupName, groupVariants]) => {
                  const filteredGroupVariants = filterVariants(groupVariants);
                  if (filteredGroupVariants.length === 0) return null;
                  
                  return (
                    <GroupedVariants
                      key={groupName}
                      groupName={groupName}
                      variants={filteredGroupVariants}
                      options={options}
                      selectedVariants={selectedVariants}
                      onToggleSelection={toggleVariantSelection}
                      onVariantUpdate={onVariantUpdate}
                      isExpanded={expandedGroups.has(groupName)}
                      onToggleExpansion={toggleGroupExpansion}
                    />
                  );
                }).filter(Boolean)
              : filteredVariants.map(variant => (
                  <VariantRow
                    key={variant.id}
                    variant={variant}
                    options={options}
                    isSelected={selectedVariants.includes(variant.id)}
                    onToggleSelection={() => toggleVariantSelection(variant.id)}
                    onUpdate={onVariantUpdate}
                  />
                ))
            }
            
            {searchTerm.trim() && filteredVariants.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: '#6d7175' }}>
                  No variants found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <strong>Total inventory at Shop location: {totalInventory} available</strong>
      </div>
    </div>
  );
}

function GroupedVariants({ groupName, variants, options, selectedVariants, onToggleSelection, onVariantUpdate, isExpanded, onToggleExpansion }) {
  const priceRange = variants.length > 1 
    ? `₹ ${Math.min(...variants.map(v => v.price)).toFixed(2)} - ${Math.max(...variants.map(v => v.price)).toFixed(2)}`
    : `₹ ${variants[0]?.price.toFixed(2) || '0.00'}`;

  const getGroupTitle = () => {
    const option = options.find(opt => opt.name === groupName);
    return option ? option.name : groupName;
  };

  return (
    <>
      <tr className={styles.groupHeader}>
        <td>
          <div className={styles.groupTitle}>
            <input
              type="checkbox"
              checked={variants.every(v => selectedVariants.includes(v.id))}
              onChange={() => variants.forEach(v => onToggleSelection(v.id))}
            />
            <span className={styles.variantIcon}>📦</span>
            <div className={styles.groupInfo}>
              <div className={styles.groupName}>{getGroupTitle()}</div>
              <div className={styles.groupValue}>{groupName}</div>
            </div>
            <span className={styles.variantCount}>
              {variants.length} variant{variants.length > 1 ? 's' : ''}
            </span>
            <button 
              onClick={() => onToggleExpansion(groupName)}
              className={styles.expandBtn}
            >
              {isExpanded ? '▲' : '▼'}
            </button>
          </div>
        </td>
        <td>{priceRange}</td>
        <td>{variants.reduce((sum, v) => sum + v.inventory, 0)}</td>
      </tr>
      
      {isExpanded && variants.map(variant => (
        <VariantRow
          key={variant.id}
          variant={variant}
          options={options}
          isSelected={selectedVariants.includes(variant.id)}
          onToggleSelection={() => onToggleSelection(variant.id)}
          onUpdate={onVariantUpdate}
          isSubVariant={true}
          groupBy={groupName}
        />
      ))}
    </>
  );
}

function VariantRow({ variant, options, isSelected, onToggleSelection, onUpdate, isSubVariant = false, groupBy = null }) {
  const getVariantDisplay = () => {
    if (isSubVariant && groupBy) {
      const groupOptionIndex = options.findIndex(option => option.name === groupBy);
      if (groupOptionIndex !== -1) {
        return variant.combination
          .map((value, index) => {
            if (index === groupOptionIndex) return null;
            const optionName = options[index]?.name;
            return optionName ? `${optionName}: ${value}` : value;
          })
          .filter(Boolean)
          .join(' / ');
      }
    }
    
    return variant.combination.map((value, index) => {
      const optionName = options[index]?.name;
      return optionName ? `${optionName}: ${value}` : value;
    }).join(' / ');
  };

  const getVariantTitle = () => {
    if (isSubVariant && groupBy) {
      const groupOptionIndex = options.findIndex(option => option.name === groupBy);
      const remainingOptions = options
        .map((option, index) => index === groupOptionIndex ? null : option.name)
        .filter(Boolean);
      return remainingOptions.length > 0 ? remainingOptions.join(' / ') : 'Variant';
    }
    
    const optionNames = options.map(option => option.name).filter(Boolean);
    return optionNames.length > 0 ? optionNames.join(' / ') : 'Variant';
  };

  return (
    <tr className={`${styles.variantRow} ${isSubVariant ? styles.subVariant : ''}`}>
      <td>
        <div className={styles.variantCell}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelection}
          />
          <span className={styles.variantIcon}>📦</span>
          <div className={styles.variantInfo}>
            <div className={styles.variantTitle}>{getVariantTitle()}</div>
            <div className={styles.variantValues}>{getVariantDisplay()}</div>
          </div>
        </div>
      </td>
      <td>
        <input
          type="number"
          value={variant.price}
          onChange={(e) => onUpdate(variant.id, 'price', e.target.value)}
          className={styles.priceInput}
          step="0.01"
          min="0"
        />
      </td>
      <td>
        <input
          type="number"
          value={variant.inventory}
          onChange={(e) => onUpdate(variant.id, 'inventory', e.target.value)}
          className={styles.inventoryInput}
          min="0"
        />
      </td>
    </tr>
  );
}
