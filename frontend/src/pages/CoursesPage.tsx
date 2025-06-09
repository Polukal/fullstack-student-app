import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import {
  useCreateCourseMutation,
} from "../api/coursesApi";
import CourseTable from "../components/CourseTable";
import { useState } from "react";
import { useToast } from "../hooks";

export default function CoursesPage() {
  const [name, setName] = useState("");
  const [createCourse, { isLoading }] = useCreateCourseMutation();
  const { enqueueSnackbar } = useToast();

  const handleAdd = async () => {
    await createCourse({ name }).unwrap();
    setName("");
    enqueueSnackbar("Course added", { variant: "success" });
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        Courses
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Course name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={isLoading || !name.trim()}
          >
            Add
          </Button>
        </Stack>
      </Paper>

      <Paper>
        <CourseTable />
      </Paper>
    </Box>
  );
}
