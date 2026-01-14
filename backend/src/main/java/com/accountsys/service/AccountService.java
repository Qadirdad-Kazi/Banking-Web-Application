package com.accountsys.service;

import com.accountsys.model.Account;
import com.accountsys.model.CustomerDetails;
import com.accountsys.model.Transaction;
import com.accountsys.model.TransactionType;
import com.accountsys.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    /*
     * addAccount(Details, Real): Create a new account with initial details and limit.
     */
    @Transactional
    public Account addAccount(CustomerDetails details, Double overdraftLimit) {
        if (overdraftLimit < 0) {
           throw new IllegalArgumentException("Overdraft limit must be non-negative (Z Invariant violation).");
        }
        Account account = new Account();
        account.setDetails(details);
        account.setLimit(overdraftLimit);
        account.setBalance(0.0); // Initial balance 0
        return accountRepository.save(account);
    }

    /*
     * removeAccount(AccNum): Delete an account (Guard: Account must exist).
     */
    @Transactional
    public void removeAccount(String accountNumber) {
        if (!accountRepository.existsById(accountNumber)) {
            throw new IllegalArgumentException("Account with ID " + accountNumber + " does not exist.");
        }
        accountRepository.deleteById(accountNumber);
    }

    /*
     * deposit(AccNum, Date, Real): Add funds to an account.
     */
    @Transactional
    public Account deposit(String accountNumber, Date date, Double amount) {
        Account account = getAccountOrThrow(accountNumber);
        
        if (amount <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive.");
        }

        account.setBalance(account.getBalance() + amount);
        
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setDate(date != null ? date : new Date());
        transaction.setAmount(amount);
        transaction.setType(TransactionType.DEPOSIT);
        
        account.getTransactions().add(transaction);
        
        return accountRepository.save(account);
    }

    /*
     * withdraw(AccNum, Date, Real): Deduct funds. 
     * Constraint: Must check if (Balance + Overdraft Limit) >= Withdrawal Amount.
     */
    @Transactional
    public Account withdraw(String accountNumber, Date date, Double amount) {
        Account account = getAccountOrThrow(accountNumber);

        if (amount <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be positive.");
        }

        // Formal Constraint Check
        if ((account.getBalance() + account.getLimit()) < amount) {
            throw new IllegalStateException("Insufficient funds (including overdraft limit). Withdrawal denied.");
        }

        // Invariant Check (Redundant but explicit)
        // New Balance = Balance - Amount
        // Invariant: New Balance + Limit >= 0
        // (Balance - Amount) + Limit >= 0 => Balance + Limit >= Amount. (Same as above)

        account.setBalance(account.getBalance() - amount);

        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setDate(date != null ? date : new Date());
        transaction.setAmount(amount);
        transaction.setType(TransactionType.WITHDRAW);

        account.getTransactions().add(transaction);

        return accountRepository.save(account);
    }

    /*
     * changeDetails(AccNum, Details): Update customer info.
     */
    @Transactional
    public Account changeDetails(String accountNumber, CustomerDetails details) {
        Account account = getAccountOrThrow(accountNumber);
        account.setDetails(details);
        return accountRepository.save(account);
    }

    /*
     * changeLimit(AccNum, Real): Adjust overdraft limit.
     */
    @Transactional
    public Account changeLimit(String accountNumber, Double newLimit) {
        Account account = getAccountOrThrow(accountNumber);
        
        if (newLimit < 0) {
            throw new IllegalArgumentException("Overdraft limit must be non-negative (Z Invariant violation).");
        }
        
        // Invariant Check: Balance + New Limit must always be positive (or zero)
        if (account.getBalance() + newLimit < 0) {
             throw new IllegalStateException("Cannot reduce limit to " + newLimit + ". Resulting state would violate invariant (Balance + Limit < 0).");
        }

        account.setLimit(newLimit);
        return accountRepository.save(account);
    }

    /*
     * getAllTransactions(AccNum): Return transaction history for a specific account.
     */
    @Transactional(readOnly = true)
    public List<Transaction> getAllTransactions(String accountNumber) {
        Account account = getAccountOrThrow(accountNumber);
        return account.getTransactions();
    }

    /*
     * getBalance(AccNum): Return current funds.
     */
    @Transactional(readOnly = true)
    public Double getBalance(String accountNumber) {
        Account account = getAccountOrThrow(accountNumber);
        return account.getBalance();
    }

    /*
     * getAccount(AccNum): Return full account details.
     */
    @Transactional(readOnly = true)
    public Account getAccount(String accountNumber) {
        return getAccountOrThrow(accountNumber);
    }

    /*
     * getAllAccounts(): Return all accounts (For Admin View).
     */
    @Transactional(readOnly = true)
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    /*
     * getTotal(): Return the sum of all funds in the system.
     */
    /*
     * getTotal(): Return the sum of all funds in the system.
     */
    @Transactional(readOnly = true)
    public Double getTotal() {
        Double total = accountRepository.getTotalSystemBalance();
        return total != null ? total : 0.0;
    }

    /*
     * contains(AccNum): Check if account exists.
     */
    @Transactional(readOnly = true)
    public boolean contains(String accountNumber) {
        return accountRepository.existsById(accountNumber);
    }

    /*
     * isEmpty(): Check if system has no accounts.
     */
    @Transactional(readOnly = true)
    public boolean isEmpty() {
        return accountRepository.count() == 0;
    }
    
    // Helper
    private Account getAccountOrThrow(String accountNumber) {
        return accountRepository.findById(accountNumber)
                .orElseThrow(() -> new IllegalArgumentException("Account with ID " + accountNumber + " does not exist."));
    }
}
