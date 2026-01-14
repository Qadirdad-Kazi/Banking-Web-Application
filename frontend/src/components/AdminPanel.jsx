import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function AdminPanel({ onBack }) {
    const [accounts, setAccounts] = useState([]);
    const [total, setTotal] = useState(0);
    const [formData, setFormData] = useState({ name: '', address: '', email: '', limit: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const accs = await api.getAllAccounts();
            setAccounts(accs);
            const sysTotal = await api.getTotalSystemBalance();
            setTotal(sysTotal);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createAccount({
                name: formData.name,
                address: formData.address,
                email: formData.email
            }, formData.limit);
            setFormData({ name: '', address: '', email: '', limit: '' });
            loadData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.deleteAccount(id);
            loadData();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
                <button onClick={onBack} className="text-gray-500 hover:text-gray-700">Back to Home</button>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                    <h3 className="text-xl font-bold mb-4">Create New Account</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input className="input-field" placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        <input className="input-field" placeholder="Address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required />
                        <input className="input-field" placeholder="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                        <input className="input-field" placeholder="Overdraft Limit" type="number" value={formData.limit} onChange={e => setFormData({ ...formData, limit: e.target.value })} required />
                        <button type="submit" className="btn btn-primary w-full">Create Account</button>
                    </form>
                </div>

                <div className="card bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    <h3 className="text-xl font-bold mb-2">System Overview</h3>
                    <div className="text-4xl font-bold mb-4">PKR {total.toFixed(2)}</div>
                    <div className="text-indigo-100">Total Funds in System</div>
                    <div className="mt-4 text-indigo-100">Total Accounts: {accounts.length}</div>
                </div>
            </div>

            <div className="card">
                <h3 className="text-xl font-bold mb-4">All Accounts</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limit</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {accounts.map(acc => (
                                <tr key={acc.accountNumber}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{acc.accNum}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{acc.details?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PKR {acc.balance.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PKR {acc.limit.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleDelete(acc.accNum)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
