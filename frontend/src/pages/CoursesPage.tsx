import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";
import {
  useListCoursesQuery,
  useCreateCourseMutation,
} from "../api/coursesApi";

export default function CoursesPage() {
  const [pagination, setPagination] = useState({ page: 1, size: 10 });
  const { data = [], isLoading, refetch } = useListCoursesQuery(pagination);

  const [newCourse, setNewCourse] = useState("");
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();

  const handleAdd = async () => {
    const name = newCourse.trim();
    if (!name) return;
    await createCourse({ name }).unwrap();
    setNewCourse("");
    refetch();
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        Courses
      </Typography>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add a new course
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            label="Course name"
            fullWidth
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={isCreating || !newCourse.trim()}
          >
            {isCreating ? "Adding…" : "Add"}
          </Button>
        </Box>
      </Paper>

      <Paper>
        {isLoading ? (
          <Box p={4} textAlign="center">
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="60">#</TableCell>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((c, idx) => (
                <TableRow key={c.id}>
                  <TableCell>
                    {(pagination.page - 1) * pagination.size + idx + 1}
                  </TableCell>
                  <TableCell>{c.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}
