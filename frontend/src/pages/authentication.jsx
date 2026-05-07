import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar, Alert, CircularProgress } from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0ea5e9',
        },
        secondary: {
            main: '#f97316',
        },
        background: {
            default: '#f8fafc',
        },
    },
    shape: {
        borderRadius: 14,
    },
});

export default function Authentication() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    const handleAuth = async () => {
        if (!username || !password) {
            setError('Username and password are required');
            return;
        }

        if (formState === 1 && !name) {
            setError('Name is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (formState === 0) {
                await handleLogin(username, password);
            } else {
                const result = await handleRegister(name, username, password);
                setUsername('');
                setName('');
                setPassword('');
                setMessage(result || 'Registration successful!');
                setOpen(true);
                setFormState(0);
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err?.response?.data?.message || 'An error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAuth();
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
                    background:
                        'radial-gradient(circle at 10% 10%, rgba(56,189,248,0.15), transparent 28%), radial-gradient(circle at 95% 90%, rgba(249,115,22,0.12), transparent 28%), #f8fafc',
                }}
            >
                <Box
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        flexDirection: 'column',
                        justifyContent: 'center',
                        px: 8,
                        py: 6,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 5,
                            borderRadius: 5,
                            color: 'white',
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #0ea5e9 100%)',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        <VideoCallIcon sx={{ fontSize: 82, mb: 2, opacity: 0.95 }} />
                        <Typography variant="h3" fontWeight={800} gutterBottom>
                            MeetBridge
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.92, maxWidth: 520 }}>
                            Better meetings with smooth video, chat, and activity history in one place.
                        </Typography>
                    </Paper>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: { xs: 2, sm: 3, md: 5 },
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            width: '100%',
                            maxWidth: 480,
                            p: { xs: 3, sm: 4 },
                            borderRadius: 5,
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 24px 50px rgba(15, 23, 42, 0.08)',
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 62,
                                    height: 62,
                                    mb: 1,
                                    background: 'linear-gradient(135deg, #0ea5e9, #f97316)',
                                }}
                            >
                                <LockOutlinedIcon />
                            </Avatar>

                            <Typography component="h1" variant="h5" fontWeight={800} sx={{ mt: 1 }}>
                                {formState === 0 ? 'Welcome back' : 'Create your account'}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                                {formState === 0 ? 'Sign in to continue your meetings' : 'Join now and start collaborating'}
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 1.5, display: 'flex', gap: 1.2 }}>
                            <Button
                                fullWidth
                                variant={formState === 0 ? 'contained' : 'outlined'}
                                onClick={() => {
                                    setFormState(0);
                                    setError('');
                                }}
                            >
                                Sign In
                            </Button>
                            <Button
                                fullWidth
                                variant={formState === 1 ? 'contained' : 'outlined'}
                                onClick={() => {
                                    setFormState(1);
                                    setError('');
                                }}
                            >
                                Sign Up
                            </Button>
                        </Box>

                        <Box component="form" noValidate sx={{ mt: 2 }}>
                            {formState === 1 && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Full Name"
                                    name="name"
                                    value={name}
                                    autoComplete="name"
                                    autoFocus={formState === 1}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                />
                            )}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={username}
                                autoComplete="username"
                                autoFocus={formState === 0}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                value={password}
                                id="password"
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />

                            {error && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    mb: 1,
                                    py: 1.4,
                                    fontSize: '0.98rem',
                                    fontWeight: 700,
                                    background: 'linear-gradient(120deg, #0ea5e9, #f97316)',
                                }}
                                onClick={handleAuth}
                                disabled={loading}
                            >
                                {loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    formState === 0 ? 'Sign In' : 'Create Account'
                                )}
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Box>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}
