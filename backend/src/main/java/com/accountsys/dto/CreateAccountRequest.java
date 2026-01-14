package com.accountsys.dto;

import com.accountsys.model.CustomerDetails;

public class CreateAccountRequest {
    private CustomerDetails details;
    private Double limit;

    public CustomerDetails getDetails() {
        return details;
    }

    public void setDetails(CustomerDetails details) {
        this.details = details;
    }

    public Double getLimit() {
        return limit;
    }

    public void setLimit(Double limit) {
        this.limit = limit;
    }
}
