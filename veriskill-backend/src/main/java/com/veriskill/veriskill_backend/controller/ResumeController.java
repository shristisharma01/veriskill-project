package com.veriskill.veriskill_backend.controller;

import com.veriskill.veriskill_backend.dto.*;
import com.veriskill.veriskill_backend.entity.AnalysisRecord;
import com.veriskill.veriskill_backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/analyze")
    public ResponseEntity<AnalysisResult> analyze(@RequestBody ScanRequest request,
                                                  Authentication auth) {
        return ResponseEntity.ok(resumeService.analyzeResume(request, auth.getName()));
    }

    @GetMapping("/history")
    public ResponseEntity<List<AnalysisRecord>> history(Authentication auth) {
        return ResponseEntity.ok(resumeService.getHistory(auth.getName()));
    }
}
