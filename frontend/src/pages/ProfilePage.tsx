import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  useGetMeQuery,
  useUpdateMeMutation,
} from "../api/studentsApi";
import { useState, useEffect } from "react";
import { useToast } from "../hooks";
import { format, parseISO } from "date-fns";

export default function ProfilePage() {
  const { data, isLoading } = useGetMeQuery();
  const [updateMe, { isLoading: saving }] = useUpdateMeMutation();
  const { enqueueSnackbar } = useToast();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
  });

  useEffect(() => {
    if (data)
      setForm({
        first_name: data.first_name,
        last_name: data.last_name,
        date_of_birth: format(parseISO(data.date_of_birth), "yyyy-MM-dd"),
      });
  }, [data]);

  if (isLoading || !data)
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
      </Box>
    );

  const handleSave = async () => {
    await updateMe({
      first_name: form.first_name,
      last_name: form.last_name,
      date_of_birth: form.date_of_birth,
    }).unwrap();
    enqueueSnackbar("Profile saved", { variant: "success" });
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        My Profile
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 500 }}>
        <Stack spacing={2}>
          <TextField
            label="First name"
            value={form.first_name}
            onChange={(e) =>
              setForm((s) => ({ ...s, first_name: e.target.value }))
            }
          />
          <TextField
            label="Last name"
            value={form.last_name}
            onChange={(e) =>
              setForm((s) => ({ ...s, last_name: e.target.value }))
            }
          />
          <TextField
            label="Birth date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.date_of_birth}
            onChange={(e) =>
              setForm((s) => ({ ...s, date_of_birth: e.target.value }))
            }
          />
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            Save
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
