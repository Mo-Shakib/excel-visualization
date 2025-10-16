# Sample Excel Files

This folder contains example Excel files to test the visualization app.

## Files Included

### 1. sample_data.xlsx
Sales data with 10 rows containing:
- **Date** (date type): Transaction dates
- **Product** (categorical): Product names
- **Category** (categorical): Product categories
- **Sales** (numeric): Sales amounts
- **Quantity** (numeric): Quantities sold

**Suggested visualizations:**
- Line chart: Sales over Date
- Bar chart: Sales by Product
- Pie chart: Product distribution
- Scatter plot: Quantity vs Sales

### 2. employee_data.xlsx
Employee records with 8 rows containing:
- **EmployeeID** (numeric): Employee identifiers
- **Name** (categorical): Employee names
- **Department** (categorical): Department names
- **Salary** (numeric): Salary amounts
- **HireDate** (date): Date of hire
- **Performance** (numeric): Performance ratings

**Suggested visualizations:**
- Line chart: Metrics over HireDate
- Bar chart: Salary by Department
- Pie chart: Department distribution
- Scatter plot: Performance vs Salary

## How to Use

1. Start the application with `npm start`
2. Open http://localhost:3000 in your browser
3. Upload any of these files
4. Explore the auto-generated visualizations
5. Customize charts using the control panel

## Creating Your Own Test Files

You can create additional test Excel files with any structure. The app will automatically:
- Detect column data types (numeric, categorical, or date)
- Suggest appropriate chart types based on data relationships
- Generate interactive visualizations
