const API_BASE_URL = "http://localhost:8080/api/accounts";

const handleError = async (response, defaultMsg) => {
    try {
        const errorData = await response.json();
        throw new Error(errorData.message || defaultMsg);
    } catch (e) {
        // If parsing fails (not JSON) or extracting message fails, use text or default
        if (e.message && e.message !== defaultMsg && e.message !== "Unexpected end of JSON input" && !e.message.includes("is not valid JSON")) {
            throw e; // It was the error from above
        }
        const text = await response.text();
        throw new Error(text || defaultMsg);
    }
};

export const api = {
    // Admin
    createAccount: async (details, limit) => {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ details, limit: parseFloat(limit) })
        });
        if (!response.ok) await handleError(response, 'Failed to create account');
        return response.json();
    },

    getAllAccounts: async () => {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Failed to fetch accounts');
        return response.json();
    },

    deleteAccount: async (id) => {
        const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete account');
    },

    getTotalSystemBalance: async () => {
        const response = await fetch(`${API_BASE_URL}/total`);
        if (!response.ok) throw new Error('Failed to fetch total');
        return response.json();
    },

    // User
    getAccount: async (id) => {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) throw new Error('Account not found');
        // The API returns the account object with balance and transactions if implementation aligns.
        // Or we might need to fetch transactions separately if not included.
        // My Account entity includes `transactions` list and is EAGER or default lazy?
        // Default OneToMany is LAZY. Serialization might fail or be empty if not handled.
        // I annotated @OneToMany without FetchType.EAGER, so it's LAZY.
        // Spring Boot Jackson serialization of Lazy collection:
        // By default, accessing it outside transaction throws LazyInitException OR if OpenEntityManagerInView is true (default), it fetches it.
        // BUT, it might cause N+1 or serialization loop (Account -> Transaction -> Account).
        // I need to use @JsonIgnore or @JsonManagedReference on the relationship.
        // I should fix the Backend Model for serialization!
        return response.json();
    },

    deposit: async (id, amount) => {
        const response = await fetch(`${API_BASE_URL}/${id}/deposit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: parseFloat(amount), date: new Date().toISOString() })
        });
        if (!response.ok) await handleError(response, 'Deposit failed');
        return response.json();
    },

    withdraw: async (id, amount) => {
        const response = await fetch(`${API_BASE_URL}/${id}/withdraw`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: parseFloat(amount), date: new Date().toISOString() })
        });
        if (!response.ok) await handleError(response, 'Withdrawal failed');
        return response.json();
    }
};
