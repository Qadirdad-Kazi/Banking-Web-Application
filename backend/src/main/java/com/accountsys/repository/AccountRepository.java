package com.accountsys.repository;

import com.accountsys.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    
    @Query("SELECT SUM(a.balance) FROM Account a")
    Double getTotalSystemBalance();
}
