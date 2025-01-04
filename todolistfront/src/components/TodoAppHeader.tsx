import { AppBar, Toolbar, Typography, Container } from '@mui/material';

function TodoAppHeader() {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Container maxWidth="lg">
          <Typography variant="h5" color="inherit">
            TodoApp
          </Typography>
        </Container>
      </Toolbar>
    </AppBar>
  );
}

export default TodoAppHeader;
