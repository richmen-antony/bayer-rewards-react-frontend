import {
  createStyles,
  TablePagination,
  Theme,
} from "@material-ui/core";
import {
  makeStyles,
  TableSortLabel,
} from "@material-ui/core";
import React from "react";
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

interface IDataTableColumn {
  id: string;
  name: string;
  enableSort?: boolean;
  align?: "center" | "inherit" | "justify" | "left" | "right";
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
  history?: any[];
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


  const useStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  });


const DataTableHead: React.FC<IDataTableHeadProps> = ({
  columns,
  order,
  orderBy,
  onRequestSort,
}): JSX.Element => {
  console.log(columns);
  const createSortHandler = (property: keyof any) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };
  return (
      <TableHead>
        <TableRow>
        <TableCell />
          {columns.map((column) => (
            <TableCell
              key={column.id}
              align="right"
              sortDirection={orderBy === column.id ? order : false}
            >
              {column.enableSort ? (
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : "asc"}
                  onClick={createSortHandler(column.id)}
                >
                  {column.name}
                </TableSortLabel>
              ) : (
                column.name
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
  );
};

const DataTable: React.FC<IDataTableProps> = ({
  columnData,
  rows,
  history
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
  console.log({internalColumnData});

  const classes =  useStyles();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof any>("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof any
  ) => {
    console.log(orderBy, property);
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  function objectValues<T extends {}>(obj: T) {
    return Object.keys(obj).map((objKey) => obj[objKey as keyof T]);
  }
  
  function objectKeys<T extends {}>(obj: T) {
    return Object.keys(obj).map((objKey) => objKey as keyof T);
  }
  function Row(props: { row:  any,history:any}) {
    const { row,history } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();
   console.log('check',row);
    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          {internalColumnData.map((key, index) => (
                          
                          <TableCell
                            align={"right"
                              // internalColumnData[index].align
                              //   ? internalColumnData[index].align
                              //   : "inherit"
                            }
                            key={key.id}
                            component="th" scope="row"  
                          >
                            
                            {row[key.id]&&row[key.id]}
                          </TableCell>
                        ))}
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  History
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Total price ($)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {history?.map((historyRow :any) => (
                      <TableRow key={historyRow.date}>
                        <TableCell component="th" scope="row">
                          {historyRow.date}
                        </TableCell>
                        <TableCell>{historyRow.customerId}</TableCell>
                        <TableCell align="right">{historyRow.amount}</TableCell>
                        <TableCell align="right">
                          {Math.round(historyRow.amount * row.price * 100) / 100}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
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
    const [open, setOpen] = React.useState(false);

  return (
          <TableContainer component={Paper}>
            <Table
              aria-label="collapsible table"
            >
              <DataTableHead
                columns={internalColumnData}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {rows.map((row) => {
                    return (
                      <Row key={row.name} row={row} history={history} />
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        
        
  
  );
};

export default DataTable;
