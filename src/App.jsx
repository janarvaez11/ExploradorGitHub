import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  AppBar,
  Toolbar,
} from "@mui/material";
import RepoList from "./components/RepoList";

function App() {
  const [username, setUsername] = useState("");
  const [showRepoList, setShowRepoList] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setShowRepoList(true);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Mi Explorador de Repositorios
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ marginTop: "20px" }}>
        <form onSubmit={handleFormSubmit}>
          <TextField
            label="Nombre de Usuario"
            variant="outlined"
            value={username}
            onChange={handleUsernameChange}
            fullWidth
            sx={{ marginBottom: "10px" }}
          />
          <Button type="submit" variant="contained" fullWidth>
            Buscar Repositorios
          </Button>
        </form>
        {showRepoList && <RepoList username={username} />}
      </Container>
    </div>
  );
}

export default App;
