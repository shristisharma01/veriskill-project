package com.veriskill.veriskill_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "analysis_records")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AnalysisRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // "RESUME" or "EMAIL"

    @Column(columnDefinition = "TEXT")
    private String content;

    private Double credibilityScore;
    private String riskLevel; // LOW, MEDIUM, HIGH

    @Column(columnDefinition = "TEXT")
    private String suspiciousElements;

    @Column(columnDefinition = "TEXT")
    private String aiExplanation;

    private LocalDateTime analyzedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User analyzedBy;
}