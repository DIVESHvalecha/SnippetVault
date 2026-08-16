const BASE_URL = 'http://localhost:8080';

export const loginApi = async (email, password) => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            email: email,
            password: password
        }),
        credentials: 'include',
        redirect: 'manual', // IMPORTANT
    });

    if (response.status === 200 || response.status === 302) {
        // Login successful, session cookie is set
        return { success: true };
    }

    const errorData = await response.json().catch(() => ({}));
    // console.log(errorData);
    throw new Error(errorData.error || 'Login failed');
};

export const logoutApi = async () => {
    const response = await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
    });

    if (!response.ok && response.status !== 302) {
        throw new Error('Logout failed');
    }

    return { success: true };
};

export const registerApi = async (name, username, email, password, phoneNo) => {
    const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, username, email, password, phoneNo }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.body || 'Signup failed');
    }

    return response.json();
};

export const forgotPasswordApi = async (email) => {
    const response = await fetch(`${BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.body || 'Password reset request failed');
    }

    return response.json();
};

export const validateTokenApi = async (token) => {
    const response = await fetch(`${BASE_URL}/validate-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.body || 'Password reset request failed');
    }

    return response.json();
}

export const resetPasswordApi = async (token, password) => {
    const response = await fetch(`${BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.body || 'Password reset failed');
    }

    return response.json();
}