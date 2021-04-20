import React from "react";
import { isValidDate } from "../../utility/helper";
import moment from "moment";
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip'

interface IDataTableColumn {
  id: string;
  name: string;
  enableSort?: boolean;
  align?: string;
  appendKey?: string;
}

interface IDataTableHeadProps {
  columns: IDataTableColumn[];
  order: Order;
  orderBy: keyof any;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof any
  ) => void;
}

interface IDataTableProps {
  rows: any[];
  columnData?: IDataTableColumn[];
  collapsible?: boolean;
  accordionKey?: any;
  subListName?: any[];
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  console.warn(a, b, orderBy);
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  console.warn(stabilizedThis);
  return stabilizedThis.map((el) => el[0]);
}

/**
 * Table header names
 * @param param
 * @returns
 */
const DataTableHead: React.FC<IDataTableHeadProps> = ({
  columns,
  order,
  orderBy,
  onRequestSort,
}): JSX.Element => {
  const createSortHandler = (property: keyof any) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };
  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th
            className={`${
              column.align === "max-width" ? "max-width-header" : ""
            }`}
          >
            {column.enableSort ? (
              <div onClick={createSortHandler(column.id)}>
                {column.name}
                <i
                  className={`fa ${
                    column.id === orderBy && order === "desc"
                      ? "fas fa-caret-down"
                      : "fas fa-caret-up"
                  } ml-3`}
                ></i>
              </div>
            ) : (
              column.name
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

/**
 * Custom Table component
 * @param param0
 * @returns
 */
const CustomTable: React.FC<IDataTableProps> = ({
  columnData,
  rows,
  accordionKey,
  subListName,
}): JSX.Element => {
  let internalColumnData: IDataTableColumn[] = [
    {
      id: "",
      name: "",
      align: "inherit",
      enableSort: false,
    },
  ];
  if (!columnData) {
    if (rows.length) {
      internalColumnData.length = 0;
      Object.keys(rows[0]).map((key) => {
        internalColumnData.push({
          id: String(key),
          name: String(key),
          align: "inherit",
          enableSort: false,
        });
      });
    }
  } else {
    internalColumnData = columnData;
  }

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof any>("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof any
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  /**
   * To append the table rows values
   * @param props
   * @returns
   */
  function Row(props: { row: any; accordionKey: string; subListName: any }) {
    const { row, accordionKey } = props;
    const [accordionView, handleAccordion] = React.useState(false);
    const [accordionId, setAccordionId] = React.useState("");
    const handleExpand = (value: any) => {
      handleAccordion(!accordionView);
      setAccordionId(value[accordionKey]);
    };

    return (
      <React.Fragment>
        <tr onClick={() => handleExpand(row)}>
          <td
            colSpan={internalColumnData?.length}
            className="tbl-row"
            style={
              row.scanstatus === "valid"
                ? { borderLeft: "10px solid #89D329" }
                : { borderLeft: "10px solid #FF4848" }
            }
          >
            <table>
              <tbody>
                <tr>
                  {internalColumnData.map((key, index) => (
                    <td
                      key={index}
                      className={`${
                        key.align === "max-width" ? "max-width-header" : ""
                      }`}
                    >
                      {row[key.id] && isValidDate(row[key.id]) ? (
                        moment(row[key.id]).format("DD-MM-YYYY")
                      ) : key.id === "firstname" &&
                        row["lastname"] &&
                        key?.appendKey ? (
                        <>
                          {row[key.id] +
                            " " +
                            row["lastname"] +
                            ", " +
                            row[key?.appendKey]}
                          <div className="label"> Distributor </div>
                        </>
                      ) : key.id === "action" ? (
                        !accordionView ? (
                          <i className="fas fa-caret-down"></i>
                        ) : (
                          <i className="fas fa-caret-up"></i>
                        )
                      ) : key.id === "quickaction" ? (
                        <div className="quick-action">
                          <i className="fas fa-edit"></i>
                          <i className="fas fa-times-circle"></i>
                        </div>
                      ) : (
                        row[key.id]?.length>18? <Tooltip title={row[key.id]} arrow>
                        <Button>{row[key.id].substr(0,9)} ...</Button>
                      </Tooltip> : row[key.id]
                        
                      )}
                    </td>
                  ))}
                </tr>
                {accordionView && row[accordionKey] === accordionId ? (
                  <tr>
                    <td colSpan={internalColumnData?.length}>
                      <div className="accordion-content">
                        {subListName &&
                          subListName.map((list, index) => {
                            return (
                              <div
                                className="accordion-content-col"
                                key={index}
                              >
                                <div>
                                  
                                    <div style={{ display: "flex",color:"#888888",fontSize:"12px"}}>
                                      <label htmlFor="">{list.name}:</label>

                                      <p>
                                        {isValidDate(row[list.key])
                                          ? moment(row[list.key]).format(
                                              "MMMM Do ,YYYY"
                                            )
                                          : row[list.key] || "-"}
                                      </p>
                                    </div>
                                    {list.name==='Sold To' &&  <p className="label">{"Retailers"}</p>}
                                  
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </td>
                  </tr>
                ) : (
                  ""
                )}
              </tbody>
            </table>
          </td>
        </tr>
      </React.Fragment>
    );
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className="table-responsive">
      <table className="table" id="tableData">
        <DataTableHead
          columns={internalColumnData}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />
        <tbody>
          {stableSort(rows, getComparator(order, orderBy)).map((row) => {
            return (
              <Row
                key={row.name}
                row={row}
                accordionKey={accordionKey}
                subListName={subListName}
              />
            );
          })}
          {!rows?.length && (
            <tr style={{ height: 53 * emptyRows }}>
              <td colSpan={internalColumnData?.length}>No records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
