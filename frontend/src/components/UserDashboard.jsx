import React, { useState } from 'react';
import { api } from '../api';

export default function UserDashboard({ onBack }) {
    const [accountId, setAccountId] = useState('');
    const [account, setAccount] = useState(null);
    const [error, setError] = useState('');
    const [amount, setAmount] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await api.getAccount(accountId);
            setAccount(data);
        } catch (err) {
            setError(err.message);
            setAccount(null);
        }
    };

    const handleTransaction = async (type) => {
        try {
            setError('');
            let res;
            if (type === 'deposit') res = await api.deposit(account.accNum, amount);
            else res = await api.withdraw(account.accNum, amount);

            setAccount(res); // API returns updated account
            setAmount('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">User Banking</h2>
                <button onClick={onBack} className="text-gray-500 hover:text-gray-700">Back to Home</button>
            </div>

            {!account ? (
                <div className="card max-w-md mx-auto mt-10">
                    <h3 className="text-xl font-bold mb-4 text-center">Access Your Account</h3>
                    <form onSubmit={handleSearch} className="space-y-4">
                        <input
                            className="input-field text-center text-lg"
                            placeholder="Enter Account Number"
                            value={accountId}
                            onChange={e => setAccountId(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary w-full">Access Account</button>
                    </form>
                    {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

                    <div className="mt-6 p-4 bg-yellow-50 rounded text-sm text-yellow-800">
                        <p className="font-bold">Demo Hint:</p>
                        <p>Ask Admin for an Account ID if you don't have one.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    {/* Account Header */}
                    <div className="card bg-white border-l-4 border-indigo-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Welcome, {account.details?.name}</h1>
                                <p className="text-gray-500">Account: {account.accNum}</p>
                                <p className="text-gray-500">{account.details?.address} | {account.details?.email}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Current Balance</p>
                                <p className="text-4xl font-bold text-indigo-600">PKR {account.balance.toFixed(2)}</p>
                                <p className="text-xs text-gray-400 mt-1">Overdraft Limit: PKR {account.limit.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}

                    {/* Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card">
                            <h3 className="text-lg font-bold mb-4">Make a Transaction</h3>
                            <div className="space-y-4">
                                <input
                                    type="number"
                                    className="input-field"
                                    placeholder="Amount (PKR)"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleTransaction('deposit')}
                                        className="btn btn-secondary w-full"
                                        disabled={!amount}
                                    >
                                        Deposit
                                    </button>
                                    <button
                                        onClick={() => handleTransaction('withdraw')}
                                        className="btn btn-danger w-full"
                                        disabled={!amount}
                                    >
                                        Withdraw
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Transactions */}
                        <div className="card">
                            <h3 className="text-lg font-bold mb-4">Transaction History</h3>
                            <div className="overflow-y-auto max-h-64 space-y-3">
                                {account.transactions && account.transactions.length > 0 ? (
                                    account.transactions.slice().reverse().map((tx, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100">
                                            <div>
                                                <span className={`font-bold ${tx.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {tx.type}
                                                </span>
                                                <div className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString()}</div>
                                            </div>
                                            <div className="font-mono font-medium">
                                                {tx.type === 'DEPOSIT' ? '+' : '-'} PKR {tx.amount.toFixed(2)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No transactions yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
