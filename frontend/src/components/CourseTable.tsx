import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
} from "@mui/x-data-grid";
import {
  useListCoursesQuery,
  useDeleteCourseMutation,
} from "../api/coursesApi";
import {
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useToast } from "../hooks";
import { useState } from "react";

export default function CourseTable() {
  const [pagination, setPagination] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useListCoursesQuery({
    page: pagination.page + 1,
    size: pagination.pageSize,
  });

  const [delCourse] = useDeleteCourseMutation();
  const { enqueueSnackbar } = useToast();

  const cols: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      width: 80,
      renderCell: ({ row }) => (
        <Tooltip title="Delete">
          <IconButton
            onClick={async () => {
              await delCourse(row.id).unwrap();
              enqueueSnackbar("Deleted", { variant: "success" });
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  if (isLoading || !data)
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
      </Box>
    );

  return (
    <DataGrid
      autoHeight
      rows={data.items}
      columns={cols}
      paginationMode="server"
      rowCount={data.total}
      paginationModel={pagination}
      onPaginationModelChange={setPagination}
      pageSizeOptions={[5, 10, 20]}
      disableRowSelectionOnClick
    />
  );
}
