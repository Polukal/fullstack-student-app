import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { clearToken } from "../authSlice";

export default function AppTopbar() {
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const logout = () => {
    dispatch(clearToken());
    nav("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Student App
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            component={RouterLink}
            to="/"
            color="inherit"
            size="small"
          >
            Courses
          </Button>
          <Button
            component={RouterLink}
            to="/profile"
            color="inherit"
            size="small"
          >
            My Profile
          </Button>
          <Button color="inherit" size="small" onClick={logout}>
            Logout
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
