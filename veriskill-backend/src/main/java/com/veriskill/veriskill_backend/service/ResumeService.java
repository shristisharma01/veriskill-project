package com.veriskill.veriskill_backend.service;

import com.veriskill.veriskill_backend.dto.*;
import com.veriskill.veriskill_backend.entity.*;
import com.veriskill.veriskill_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final AiMicroserviceClient aiClient;
    private final AnalysisRepository analysisRepository;
    private final UserRepository userRepository;

    public AnalysisResult analyzeResume(ScanRequest request, String userEmail) {
        request.setType("RESUME");
        AnalysisResult result = aiClient.analyze(request);

        User user = userRepository.findByEmail(userEmail).orElseThrow();
        AnalysisRecord record = AnalysisRecord.builder()
                .type("RESUME")
                .content(request.getContent())
                .credibilityScore(result.getCredibilityScore())
                .riskLevel(result.getRiskLevel())
                .suspiciousElements(String.join(", ", result.getSuspiciousElements()))
                .aiExplanation(result.getExplanation())
                .analyzedAt(LocalDateTime.now())
                .analyzedBy(user)
                .build();
        analysisRepository.save(record);

        return result;
    }

    public List<AnalysisRecord> getHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        return analysisRepository.findByAnalyzedByIdOrderByAnalyzedAtDesc(user.getId());
    }
}