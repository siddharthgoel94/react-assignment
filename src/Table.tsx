import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { OverlayPanel } from "primereact/overlaypanel";
import { FaChevronDown } from "react-icons/fa";
import { Card } from "primereact/card";
import Loading from "./Loading";

import "primereact/resources/primereact.min.css"; // Core CSS for PrimeReact components
import "primereact/resources/themes/lara-light-purple/theme.css"; // Or any other theme
import './Table.css'

const Table = () => {
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [rowsPerPage] = useState(12);
  const [bitmaskArray, setBitmaskArray] = useState<number[]>([]); // Bitmask array for row selection
  const [selectedRows, setSelectedRows] = useState([]); // Selected rows for current page
  const op = useRef<OverlayPanel>(null);
  const [selectCount, setSelectCount] = useState<number | null>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch data and initialize bitmask for each page
  const fetchData = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${pageNumber + 1}`
      );
      const responseData = await response.json();

      setData(responseData.data);
      setTotalRecords(responseData.pagination.total);

      // Initialize bitmaskArray if it's empty
      if (bitmaskArray.length === 0) {
        const totalPages = Math.ceil(
          responseData.pagination.total / rowsPerPage
        );
        setBitmaskArray(Array(totalPages+1).fill(0));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pageNumber);
  }, [pageNumber]);

  // Update selected rows based on bitmaskArray for current page
  useEffect(() => {
    const currentPageMask = bitmaskArray[pageNumber];
    const selectedRowsForPage = data.filter(
      (_, index) => (currentPageMask & (1 << index)) !== 0
    );
    setSelectedRows(selectedRowsForPage);
  }, [bitmaskArray, data]);

  // Selection change handler
  const onSelectionChange = (e: any) => {
    console.log(e);

    e.value // current status of selected rows
    let newBitMask=0;
    for(let row of e.value){
       let index = data.findIndex((dataRow:any)=>dataRow.id===row.id)
       newBitMask = (1<<index) | newBitMask
       console.log(index);
       
    }
    const newBitmaskArray = [...bitmaskArray];
    newBitmaskArray[pageNumber] = newBitMask;
    setBitmaskArray(newBitmaskArray); // Update bitmask array
  };

  // Page change handler
  const onPageChange = (event: any) => {
    setPageNumber(event.page);
  };

  // Handle bulk selection based on the input number
  const handleSelectRows = () => {
    if (!selectCount || selectCount <= 0) return;

    let remainingCount = selectCount;
    let newBitmaskArray = [...bitmaskArray];
    let currentPage = pageNumber;

    while (remainingCount > 0 && currentPage < newBitmaskArray.length) {
      let currentPageMask = newBitmaskArray[currentPage];

      // Calculate how many rows to select on the current page
      const rowsToSelect = Math.min(remainingCount, rowsPerPage);
      for (let i = 0; i < rowsToSelect; i++) {
        currentPageMask |= 1 << i; // Select rows using bitwise OR
      }

      newBitmaskArray[currentPage] = currentPageMask;
      remainingCount -= rowsToSelect;
      currentPage++;
    }

    setBitmaskArray(newBitmaskArray); // Update the bitmask array
    op?.current?.hide()
  };

  // Header template for checkbox column with input overlay
  const headerTemplate = () => {
    
    return (
      <div style={{ position: "relative" }}>
        <FaChevronDown
          style={{
            position: "absolute",
            top: "50%",
            right: "52px",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
          onClick={(e) => op.current?.toggle(e)}
        />
        <OverlayPanel ref={op}>
          
          <div style={{ position: "absolute", top: "8rem" }}>
          <Card>
            <label htmlFor="rowsInput">Select Rows:</label>
            <InputNumber
              value={selectCount}
              onValueChange={(e) => setSelectCount(e.value??null)}
              placeholder="Enter number"
              style={{margin:"1rem"}}
            />
            <Button label="Submit" onClick={handleSelectRows}/>
            </Card>
          </div>
          
        </OverlayPanel>
        Title
      </div>
    );
  };

  return (
    <div className="card">
      <div className="table-title">
      <h2>React Assignment</h2>
      </div>
      {loading ? (
        <Loading/>
      ) : (
        <DataTable
          value={data}
          paginator
          first={rowsPerPage * pageNumber}
          rows={rowsPerPage}
          totalRecords={totalRecords}
          lazy
          selectionMode="multiple"
          onPage={onPageChange}
          showGridlines
          tableStyle={{ minWidth: "50rem" }}
          stripedRows
          selection={selectedRows}
          onSelectionChange={onSelectionChange}
          dataKey="id"
          className="custom-table"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          
          <Column
            field="title"
            header={headerTemplate()}
            headerStyle={{ textAlign: "center" }}
            style={{ width: "20%", textAlign: "center" }}
          ></Column>
          <Column
            field="place_of_origin"
            header="Place Of Origin"
            style={{ width: "10%" }}
          ></Column>
          <Column
            field="artist_display"
            header="Artist Display"
            style={{ width: "20%" }}
          ></Column>
          <Column
            field="inscriptions"
            header="Inscriptions"
            style={{ width: "25%" }}
          ></Column>
          <Column
            field="date_start"
            header="Date Start"
            style={{ width: "10%" }}
          ></Column>
          <Column
            field="date_end"
            header="Date End"
            style={{ width: "10%" }}
          ></Column>
        </DataTable>
      )}
    </div>
  );
};

export default Table;
