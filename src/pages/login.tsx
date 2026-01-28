import {
  Box,
  Paper,
  TextField,
  Typography,
  Button
} from "@mui/material";

type LoginProps = {
  onLogin: () => void;
};

export default function Login({ onLogin }: LoginProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5"
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: 360,
          borderRadius: 2
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 1, textAlign: "center" }}
        >
          AEDnow Admin
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, textAlign: "center" }}
        >
          Sign in to your account
        </Typography>

        <TextField
          label="Email"
          type="email"
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          sx={{ mb: 3 }}
        />

        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{
            backgroundColor: "#DC0000",
            "&:hover": {
              backgroundColor: "#b30000"
            }
          }}
          onClick={onLogin}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
}
