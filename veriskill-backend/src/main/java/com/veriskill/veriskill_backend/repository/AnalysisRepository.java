package com.veriskill.veriskill_backend.repository;

import com.veriskill.veriskill_backend.entity.AnalysisRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnalysisRepository extends JpaRepository<AnalysisRecord, Long> {
    List<AnalysisRecord> findByAnalyzedByIdOrderByAnalyzedAtDesc(Long userId);
    List<AnalysisRecord> findByType(String type);
}
