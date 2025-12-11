# Analytics Module Documentation

## 📊 Overview

The Analytics Module provides comprehensive business intelligence dashboards with 4 specialized pages:

1. **Overview.jsx** - General analytics dashboard
2. **ProductAnalytics.jsx** - Product performance analysis
3. **CategoryAnalytics.jsx** - Category insights and comparisons
4. **SalesAnalytics.jsx** - Sales trends and forecasting

## 🎨 Key Features

### All Pages Include:
- ✅ **Google Analytics-inspired design** - Professional, modern UI
- ✅ **Interactive charts** - Powered by Recharts with rich tooltips
- ✅ **Export functionality** - PDF, Excel, and CSV exports
- ✅ **Smart insights** - Automated recommendations and alerts
- ✅ **Responsive design** - Mobile, tablet, and desktop optimized
- ✅ **Performance optimized** - React.memo, useMemo for efficiency
- ✅ **Fallback mode** - Works even when backend APIs unavailable
- ✅ **Accessible** - WCAG AAA compliant with ARIA labels
- ✅ **Toast notifications** - User feedback with react-hot-toast

## 📁 File Structure

```
salleManagementFrontend/frontend/src/
├── pages/Analytics/
│   ├── Overview.jsx                    # Main dashboard
│   ├── ProductAnalytics.jsx            # Product insights
│   ├── CategoryAnalytics.jsx           # Category analysis
│   └── SalesAnalytics.jsx              # Sales forecasting
├── components/Analytics/
│   ├── KPICard.jsx                     # Reusable KPI display
│   ├── ChartWrapper.jsx                # Chart container with loading/error states
│   ├── DateRangePicker.jsx             # Date filter component
│   ├── ExportButton.jsx                # Export dropdown (PDF/Excel/CSV)
│   ├── InsightCard.jsx                 # Smart insight display
│   └── LoadingSkeleton.jsx             # Loading placeholders
├── utils/
│   ├── analyticsCalculations.js        # Business logic calculations
│   ├── chartHelpers.js                 # Chart formatting utilities
│   └── exportHelpers.js                # Export functionality
└── services/
    └── analyticsService.js             # API endpoints
```

## 🔧 Technologies Used

### Core Dependencies
- **React 19** - UI framework
- **Recharts 3.5** - Charts and visualizations
- **Lucide-react** - Icons
- **date-fns** - Date manipulation
- **react-hot-toast** - Notifications
- **jspdf & jspdf-autotable** - PDF export
- **xlsx** - Excel export

## 📊 Page Descriptions

### 1. Overview.jsx
**Purpose:** High-level business performance dashboard

**Features:**
- KPI cards (Revenue, Sales, Avg Order, Low Stock)
- Daily and monthly revenue trends with forecasting
- Smart insights section with automatic alerts
- Category contribution pie chart
- Top products bar chart
- Hourly sales distribution
- Interactive heatmap (Day × Hour sales intensity)
- Export to PDF/Excel/CSV

**Key Metrics:**
- Total Revenue with MoM/YoY growth
- Total Sales count
- Average Order Value
- Low stock product count

### 2. ProductAnalytics.jsx
**Purpose:** Deep product performance analysis

**Features:**
- Product search and filtering
- BCG Matrix (Boston Consulting Group)
  - Stars (High Growth, High Share)
  - Cash Cows (Low Growth, High Share)
  - Question Marks (High Growth, Low Share)
  - Dogs (Low Growth, Low Share)
- Smart recommendations (restock, promote, maintain)
- Product performance scatter plot with status badges
- Interactive product cards with drill-down
- Status badges: Top Seller, Slow Mover, Low Stock

**Key Metrics:**
- Revenue per product
- Sales velocity
- Stock levels
- Price positioning

### 3. CategoryAnalytics.jsx
**Purpose:** Category-level insights and comparisons

**Features:**
- Category KPIs (Revenue, Quantity, Market Share)
- Treemap chart for hierarchical revenue visualization
- Performance comparison table with ranking
- Radar chart for multi-criteria comparison
- Growth matrix (scatter plot)
- Top/Flop products by category
- Advanced filters (sort by revenue, quantity, market share, growth)

**Key Metrics:**
- Revenue by category
- Market share percentage
- Growth rate
- Products per category

### 4. SalesAnalytics.jsx
**Purpose:** Sales trends, forecasting, and customer insights

**Features:**
- Conversion funnel visualization
- Sales trend with 7-day forecast (moving average)
- Cohort analysis by acquisition period
- Sales distribution histogram with statistics
- Temporal analysis:
  - Sales by hour (24-hour)
  - Sales by day (weekly pattern)
  - Sales by month (seasonal)
- Top 10 clients with contribution percentage
- Advanced metrics (AOV, MoM/YoY growth, conversion rate)

**Key Metrics:**
- Total Revenue
- Total Orders
- Average Order Value (AOV)
- Month-over-Month (MoM) growth
- Year-over-Year (YoY) growth
- Conversion rate

## 🛠️ Component API

### KPICard
```jsx
<KPICard
  title="Revenue"
  value={12500}
  format="currency" // or "number", "percentage"
  variation={12.5} // percentage change
  icon={DollarSign}
  loading={false}
/>
```

### ChartWrapper
```jsx
<ChartWrapper
  title="Sales Trend"
  subtitle="Last 30 days"
  height="400px"
  loading={false}
  error={null}
  actions={<ExportButton />}
>
  {/* Chart content */}
</ChartWrapper>
```

### DateRangePicker
```jsx
<DateRangePicker
  onRangeChange={(range) => {
    console.log(range.start, range.end, range.label);
  }}
/>
```

### ExportButton
```jsx
<ExportButton
  data={analyticsData}
  filename="sales_report"
  title="Sales Analytics Report"
  pdfSections={[
    { title: 'KPIs', type: 'kpi', data: [...] },
    { title: 'Details', type: 'table', columns: [...], data: [...] }
  ]}
/>
```

### InsightCard
```jsx
<InsightCard
  type="success" // or "warning", "danger", "info", "insight", "trend"
  title="Strong Performance"
  message="Revenue is up 12% compared to last month"
  action={{
    label: "View Details",
    onClick: () => {}
  }}
/>
```

## 📐 Utility Functions

### analyticsCalculations.js
```javascript
// Growth rate calculation
calculateGrowthRate(current, previous) // returns percentage

// BCG Matrix classification
buildBCGMatrix(products, sales) // returns { stars, cashCows, questionMarks, dogs }

// Forecast generation (moving average)
generateForecast(historicalData, periods) // returns forecast array

// Statistical analysis
calculateStatistics(values) // returns { mean, median, std, min, max, q1, q3 }

// Average Order Value
calculateAOV(sales) // returns number
```

### chartHelpers.js
```javascript
// Color palette (Google Analytics inspired)
GA_COLORS = {
  blue: '#4285f4',
  green: '#34a853',
  yellow: '#fbbc05',
  red: '#ea4335',
  ...
}

// Formatting functions
formatCurrency(value) // "1,234.56 DH"
formatNumber(value) // "1.2K" or "1.5M"
formatPercentage(value) // "12.5%"

// Chart utilities
getHeatColor(value, max, baseColor) // returns rgba color
getBCGColor(quadrant) // returns color for BCG matrix
```

### exportHelpers.js
```javascript
// Export to CSV
exportToCSV(data, filename, columns)

// Export to Excel
exportToExcel(data, filename, sheetName)

// Export to PDF
exportToPDF(title, sections, filename)

// Multi-sheet Excel
exportMultiSheetExcel(sheets, filename)
```

## 🎯 Fallback Mode

All analytics pages implement a fallback mode that calculates metrics locally when backend APIs are unavailable:

```javascript
const loadAnalytics = async () => {
  try {
    // Try API first
    const data = await AnalyticsService.getGlobalKpi();
    setKpi(data);
  } catch (error) {
    // Fallback to local calculations
    await loadFallback();
  }
};

const loadFallback = async () => {
  const [sales, products] = await Promise.all([
    getSales(),
    getProducts()
  ]);
  
  // Calculate metrics locally
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  setKpi({ totalRevenue, ... });
};
```

## 🔌 API Endpoints

Expected backend endpoints (defined in `analyticsService.js`):

```javascript
// Global metrics
GET /analytics/kpi
GET /analytics/sales/daily
GET /analytics/sales/monthly
GET /analytics/sales/hourly

// Products
GET /analytics/products/best-sellers?limit=5
GET /analytics/products/lifecycle
GET /analytics/products/bcg-matrix

// Categories
GET /analytics/categories
GET /analytics/categories/growth
GET /analytics/categories/treemap

// Advanced
GET /analytics/sales/forecast?days=7
GET /analytics/customers/cohorts
GET /analytics/sales/distribution
GET /analytics/clients/top?limit=10
GET /analytics/funnel/conversion
```

## 🎨 Design System

### Color Palette (Google Analytics Inspired)
```css
Primary Blue:   #4285f4
Blue Light:     #e8f0fe
Blue Dark:      #1a73e8
Green:          #34a853
Yellow:         #fbbc05
Red:            #ea4335
Purple:         #9334e9
Gray:           #5f6368
```

### Typography
- **Headlines:** 3xl (30px), bold
- **Section titles:** lg (18px), semibold
- **Body text:** sm (14px), regular
- **Captions:** xs (12px), regular

### Spacing (8pt grid)
- Small: 0.5rem (8px)
- Medium: 1rem (16px)
- Large: 1.5rem (24px)
- XLarge: 2rem (32px)

## 🚀 Performance Optimizations

1. **React.memo** - KPICard and ChartWrapper are memoized
2. **useMemo** - Heavy calculations cached
3. **useCallback** - Event handlers optimized
4. **Code splitting** - Pages loaded on demand
5. **Debouncing** - Search input debounced (300ms)
6. **Conditional rendering** - Charts rendered only when visible

## ♿ Accessibility

- **WCAG AAA** contrast ratios for text
- **ARIA labels** on all interactive elements
- **Keyboard navigation** with logical tab order
- **Screen reader** friendly descriptions
- **Focus indicators** on all focusable elements
- **Semantic HTML** for better structure

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Grid Layouts
- KPIs: 1 column (mobile), 2 columns (tablet), 4 columns (desktop)
- Charts: Full width on all devices with adjusted heights

## 🧪 Testing Checklist

- [ ] All charts render correctly with data
- [ ] Fallback mode works when API unavailable
- [ ] Export buttons generate valid files
- [ ] Search and filters work properly
- [ ] Date range picker updates data
- [ ] Tooltips show correct information
- [ ] Mobile responsive on all screen sizes
- [ ] Keyboard navigation works
- [ ] Screen reader announces content
- [ ] No console errors or warnings
- [ ] Performance is acceptable (< 2s load time)

## 🔮 Future Enhancements

- [ ] Dark mode support
- [ ] Real-time data updates (WebSocket)
- [ ] Custom dashboard builder (drag-and-drop)
- [ ] Saved views and bookmarks
- [ ] Scheduled report generation
- [ ] Email report delivery
- [ ] Advanced filtering (multiple criteria)
- [ ] Comparison mode (compare periods)
- [ ] Geographic maps (if location data available)
- [ ] AI-powered insights and anomaly detection

## 📝 Development Guidelines

### Adding a New Chart
1. Create component in `pages/Analytics/`
2. Use `ChartWrapper` for consistent styling
3. Implement fallback calculation if API unavailable
4. Add export functionality
5. Include rich tooltips
6. Make it responsive
7. Add loading and error states

### Adding a New Metric
1. Define calculation in `analyticsCalculations.js`
2. Add API endpoint to `analyticsService.js`
3. Implement fallback in component
4. Use `KPICard` for display
5. Add to export data

### Maintaining Consistency
- Use colors from `GA_COLORS`
- Follow existing component patterns
- Apply React.memo for performance
- Include accessibility attributes
- Test on multiple screen sizes

## 🐛 Common Issues

**Issue:** Charts not rendering
- **Solution:** Check data format matches expected structure

**Issue:** Export not working
- **Solution:** Ensure data is properly formatted using `prepareAnalyticsExport()`

**Issue:** Fallback mode not triggering
- **Solution:** Verify API error handling in try/catch blocks

**Issue:** Slow performance
- **Solution:** Check for unnecessary re-renders, apply React.memo where needed

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review component implementation in `src/components/Analytics/`
3. Examine example usage in existing analytics pages
4. Check browser console for errors

---

**Last Updated:** December 2024
**Version:** 1.0.0
**Maintained by:** ProjetJEE Team
