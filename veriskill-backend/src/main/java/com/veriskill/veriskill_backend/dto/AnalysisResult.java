package com.veriskill.veriskill_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class AnalysisResult {
    private Double credibilityScore;
    private String riskLevel;
    private List<String> suspiciousElements;
    private String explanation;
    private Boolean isFake;
}
