package com.veriskill.veriskill_backend.controller;

import com.veriskill.veriskill_backend.dto.*;
import com.veriskill.veriskill_backend.service.AiMicroserviceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmailController {

    private final AiMicroserviceClient aiClient;

    @PostMapping("/analyze")
    public ResponseEntity<AnalysisResult> analyzeEmail(@RequestBody ScanRequest request) {
        request.setType("EMAIL");
        return ResponseEntity.ok(aiClient.analyze(request));
    }
}