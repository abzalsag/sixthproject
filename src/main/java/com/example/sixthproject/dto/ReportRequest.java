package com.example.sixthproject.dto;

import com.example.sixthproject.entity.ReportReason;
import lombok.Data;

@Data
public class ReportRequest {
    private ReportReason reason;
    private String description;
}