package com.example.sixthproject.repository;

import com.example.sixthproject.entity.Report;
import com.example.sixthproject.entity.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByStatus(ReportStatus status);
    List<Report> findByReportedUserId(Long userId);
}