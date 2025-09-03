# Shopify Product Variants Manager

A React-based web application for managing product variants with dynamic option combinations, built to replicate Shopify's product variant management interface.

## 🚀 Features

- **Dynamic Variant Generation**: Automatically generates all possible combinations of product options
- **Hierarchical Display**: Shows variants in a grouped, hierarchical table structure
- **Real-time Search**: Search through variants with instant filtering
- **Bulk Operations**: Select multiple variants for batch operations
- **Grouping & Collapsing**: Group variants by any option and expand/collapse groups
- **Validation**: Prevents duplicate values and ensures complete option configuration
- **Responsive Design**: Clean, modern UI that matches Shopify's design patterns

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0**: Modern React with hooks for state management
- **Next.js 15.5.2**: React framework for production-ready applications
- **CSS Modules**: Scoped styling for component isolation
- **TypeScript**: Type safety and better development experience

### Development Tools
- **ESLint**: Code quality and consistency
- **Turbopack**: Fast bundling and development server
- **PostCSS**: CSS processing and optimization

## 📁 Project Structure

```
shopify-variants/
├── components/
│   ├── VariantsManager.js    # Product options management
│   └── VariantsTable.js      # Variants display and interaction
├── pages/
│   └── index.js              # Main dashboard component
├── styles/
│   ├── Dashboard.module.css
│   ├── VariantsManager.module.css
│   └── VariantsTable.module.css
├── package.json
├── next.config.ts
└── README.md
```

## 🎯 Core Functionality

### 1. Product Options Management
- Add/remove product options (e.g., Size, Color, Material)
- Add/remove option values for each option
- Real-time validation and duplicate prevention
- Visual feedback for incomplete configurations

### 2. Variant Generation
- Automatic generation of all possible option combinations
- Cartesian product algorithm for complete variant coverage
- Real-time updates when options change

### 3. Variants Table
- Hierarchical display with group headers and subvariants
- Group by any option (Size, Color, etc.)
- Expand/collapse functionality for better organization
- Search and filter capabilities
- Bulk selection for multiple variants

### 4. Data Management
- Price and inventory tracking for each variant
- Real-time calculations and totals
- Persistent state management

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shopify-variants
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🎨 Design Philosophy

The application follows Shopify's design patterns:
- **Clean, minimal interface** with focus on functionality
- **Consistent spacing and typography** using Shopify's design tokens
- **Intuitive user interactions** with clear visual feedback
- **Responsive design** that works across different screen sizes
- **Accessibility considerations** with proper ARIA labels and keyboard navigation

## 🔄 State Management

The application uses React's built-in state management:
- **useState hooks** for local component state
- **Props drilling** for parent-child communication
- **Callback functions** for state updates across components
- **Derived state** for calculated values (totals, filtered results)

## 🧪 Key Algorithms

### Variant Generation Algorithm
```javascript
const generateVariants = (options) => {
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
```

### Grouping Algorithm
```javascript
const groupVariants = () => {
  const grouped = {};
  const groupOptionIndex = options.findIndex(option => option.name === groupBy);
  
  variants.forEach(variant => {
    const groupValue = variant.combination[groupOptionIndex];
    if (!grouped[groupValue]) grouped[groupValue] = [];
    grouped[groupValue].push(variant);
  });
  
  return grouped;
};
```

## 🚀 Performance Optimizations

- **Memoized calculations** for expensive operations
- **Efficient filtering** with early returns
- **Optimized re-renders** with proper dependency arrays
- **Lazy loading** of components when needed
- **CSS optimizations** with minimal repaints

## 🔮 Future Enhancements

- **Drag & Drop**: Reorder options and values
- **Bulk Editing**: Edit multiple variants simultaneously
- **Import/Export**: CSV/JSON data import/export
- **Advanced Filtering**: Multiple filter criteria
- **Real-time Collaboration**: Multi-user editing
- **Backend Integration**: API integration with Shopify

## 📝 License

MIT License - feel free to use this project for learning and development purposes.
