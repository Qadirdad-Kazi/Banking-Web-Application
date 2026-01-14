package com.accountsys.controller;

import com.accountsys.dto.CreateAccountRequest;
import com.accountsys.dto.TransactionRequest;
import com.accountsys.dto.UpdateLimitRequest;
import com.accountsys.model.Account;
import com.accountsys.model.CustomerDetails;
import com.accountsys.model.Transaction;
import com.accountsys.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestBody CreateAccountRequest request) {
        return ResponseEntity.ok(accountService.addAccount(request.getDetails(), request.getLimit()));
    }

    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeAccount(@PathVariable String id) {
        accountService.removeAccount(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccount(@PathVariable String id) {
        return ResponseEntity.ok(accountService.getAccount(id));
    }
    
    // Actually, I'll add getAccount to Service in the next step.
    
    @GetMapping("/{id}/balance")
    public ResponseEntity<Double> getBalance(@PathVariable String id) {
        return ResponseEntity.ok(accountService.getBalance(id));
    }

    @GetMapping("/{id}/transactions")
    public ResponseEntity<List<Transaction>> getTransactions(@PathVariable String id) {
        return ResponseEntity.ok(accountService.getAllTransactions(id));
    }

    @PostMapping("/{id}/deposit")
    public ResponseEntity<Account> deposit(@PathVariable String id, @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(accountService.deposit(id, request.getDate(), request.getAmount()));
    }

    @PostMapping("/{id}/withdraw")
    public ResponseEntity<Account> withdraw(@PathVariable String id, @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(accountService.withdraw(id, request.getDate(), request.getAmount()));
    }

    @PutMapping("/{id}/details")
    public ResponseEntity<Account> changeDetails(@PathVariable String id, @RequestBody CustomerDetails details) {
        return ResponseEntity.ok(accountService.changeDetails(id, details));
    }

    @PutMapping("/{id}/limit")
    public ResponseEntity<Account> changeLimit(@PathVariable String id, @RequestBody UpdateLimitRequest request) {
        return ResponseEntity.ok(accountService.changeLimit(id, request.getLimit()));
    }

    @GetMapping("/total")
    public ResponseEntity<Double> getTotal() {
        return ResponseEntity.ok(accountService.getTotal());
    }
}
