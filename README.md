# API Data Table with Server-Side Pagination and Row Selection using PrimeReact

This project demonstrates how to display paginated data from an API using PrimeReact's `DataTable` component. The key features include:

- **Server-side pagination**: Fetches data from the server for each page request.
- **Row selection**: Allows the user to select rows across different pages and maintain the selections consistently.
- **Bit manipulation for selection storage**: A unique app1roach using bit manipulation to store row selections efficiently.

---

## Features

### 1. **Server-Side Pagination**
The data for the table is fetched from an API with each page request. Server-side pagination is implemented, where the table requests data for the relevant page from the backend rather than loading all data at once.

#### **How it works**:
- On a page change, the current page number is passed to the API.
- The API returns data for only the requested page (12 records per page in this case).
- The `DataTable` component uses this data to display the relevant rows while handling pagination, improving performance and reducing memory usage, especially for large datasets.

### 2. **Row Selection with Bit Manipulation**
The row selection is implemented in an optimized way using bit manipulation. Each page has a corresponding bitmask that keeps track of whether a row is selected or deselected. 

#### **Why Bit Manipulation?**
Bit manipulation is a space-efficient way to store boolean states (selected/deselected) for multiple rows:
- Each bit in an integer represents whether the corresponding row on a page is selected or not.
- This approach significantly reduces memory overhead compared to using arrays or objects for storing selection states.
  
**Advantages**:
- Reduces the storage needed for selection states.
- Fast operations for updating selections (e.g., toggling a bit).
- Efficient when handling a large number of rows across multiple pages.

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/siddharthgoel94/react-assignment
   cd react-assignment
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the app**:
   ```bash
   npm run dev
   ```

---

## How to Use

- The table will fetch the data from the API and display it in a paginated format.
- You can navigate between pages using the pagination controls at the bottom of the table.
- You can select rows, and the selection state is maintained across pages using the bitmask technique.
- The system allows for optimized row selection and deselection, even for large data sets.

---

## Technologies Used
- **React**: Front-end library for building user interfaces.
- **PrimeReact**: UI components for React, specifically the `DataTable` for displaying tabular data.
- **TypeScript**: Superset of JavaScript providing static typing.
- **API**: Data is fetched dynamically from an external API with pagination logic.

---

## Optimization

The bit manipulation technique for selection management is an optimal choice because:
- **Memory-efficient**: Each row's selection is represented by a single bit in an integer, reducing the overall memory footprint compared to storing a boolean value for each row.
- **Fast operations**: Bitwise operations are faster compared to array or object manipulations, making the process of selecting/deselecting rows more efficient.

By storing selections this way, you avoid the overhead of maintaining large arrays or objects and can efficiently handle selections across large datasets and multiple pages.


