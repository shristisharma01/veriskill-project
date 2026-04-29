package com.veriskill.veriskill_backend.service;

import com.veriskill.veriskill_backend.dto.AnalysisResult;
import com.veriskill.veriskill_backend.dto.ScanRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class AiMicroserviceClient {

    private final WebClient webClient;

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    public AnalysisResult analyze(ScanRequest request) {
        return webClient.post()
                .uri(aiServiceUrl + "/analyze")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AnalysisResult.class)
                .block(); // sync for simplicity
    }
}