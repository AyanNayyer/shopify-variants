import { useState } from 'react';
import styles from '../styles/VariantsManager.module.css';

export default function VariantsManager({ options, onOptionsChange }) {
  const addOption = () => {
    const newOption = {
      id: Date.now(),
      name: '',
      values: []
    };
    onOptionsChange([...options, newOption]);
  };

  const deleteOption = (optionId) => {
    onOptionsChange(options.filter(option => option.id !== optionId));
  };

  const updateOptionName = (optionId, newName) => {
    if (!newName.trim()) return;
    onOptionsChange(options.map(option => 
      option.id === optionId ? { ...option, name: newName.trim() } : option
    ));
  };

  const addValue = (optionId, newValue) => {
    if (!newValue.trim()) return;
    
    const option = options.find(opt => opt.id === optionId);
    if (option && option.values.includes(newValue.trim())) return;
    
    onOptionsChange(options.map(option => 
      option.id === optionId 
        ? { ...option, values: [...option.values, newValue.trim()] }
        : option
    ));
  };

  const deleteValue = (optionId, valueIndex) => {
    onOptionsChange(options.map(option => 
      option.id === optionId 
        ? { ...option, values: option.values.filter((_, index) => index !== valueIndex) }
        : option
    ));
  };

  const updateValue = (optionId, valueIndex, newValue) => {
    onOptionsChange(options.map(option => 
      option.id === optionId 
        ? { 
            ...option, 
            values: option.values.map((value, index) => 
              index === valueIndex ? newValue : value
            )
          }
        : option
    ));
  };

  return (
    <div className={styles.variantsManager}>
      <h2>Product Options</h2>
      
      {options.length === 0 && (
        <div className={styles.emptyState}>
          <p>This product has no options, like size or color.</p>
        </div>
      )}
      
      {options.length > 0 && options.some(option => !option.name.trim() || option.values.length === 0) && (
        <div className={styles.validationWarning}>
          <p>⚠️ Please complete all option names and add at least one value to each option to generate variants.</p>
        </div>
      )}
      
      {options.map(option => (
        <OptionEditor
          key={option.id}
          option={option}
          onUpdateName={(name) => updateOptionName(option.id, name)}
          onAddValue={(value) => addValue(option.id, value)}
          onDeleteValue={(index) => deleteValue(option.id, index)}
          onUpdateValue={(index, value) => updateValue(option.id, index, value)}
          onDelete={() => deleteOption(option.id)}
        />
      ))}
      
      <div className={styles.addOption}>
        <button onClick={addOption} className={styles.addButton}>
          ➕ Add another option
        </button>
      </div>
    </div>
  );
}

function OptionEditor({ option, onUpdateName, onAddValue, onDeleteValue, onUpdateValue, onDelete }) {
  const [newValue, setNewValue] = useState('');

  const handleAddValue = () => {
    if (newValue.trim()) {
      onAddValue(newValue);
      setNewValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddValue();
    }
  };

  return (
    <div className={styles.optionEditor}>
      <div className={styles.optionHeader}>
        <label>Option name</label>
        <input
          type="text"
          value={option.name}
          onChange={(e) => onUpdateName(e.target.value)}
          placeholder="e.g., Size, Color, Material"
          className={styles.input}
        />
      </div>
      
      <div className={styles.optionValues}>
        <label>Option values</label>
        {option.values.length === 0 && (
          <div className={styles.emptyValues}>
            <p>Add values for this option</p>
          </div>
        )}
        
        {option.values.map((value, index) => (
          <div key={index} className={styles.valueRow}>
            <span className={styles.dragHandle}>⋮⋮</span>
            <input
              type="text"
              value={value}
              onChange={(e) => onUpdateValue(index, e.target.value)}
              className={styles.input}
            />
            <button 
              onClick={() => onDeleteValue(index)}
              className={styles.deleteButton}
              title="Delete value"
            >
              🗑️
            </button>
          </div>
        ))}
        
        <div className={styles.addValueRow}>
          <span className={styles.dragHandle} style={{opacity: 0}}>⋮⋮</span>
          <input
            type="text"
            placeholder="Add another value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyPress={handleKeyPress}
            onBlur={handleAddValue}
            className={styles.addValueInput}
          />
        </div>
      </div>
      
      <div className={styles.optionActions}>
        <button onClick={onDelete} className={styles.deleteOption}>
          Delete
        </button>
        <button className={styles.doneButton}>Done</button>
      </div>
    </div>
  );
}
