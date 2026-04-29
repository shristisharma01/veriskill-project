package com.veriskill.veriskill_backend.dto;

import lombok.Data;

@Data
public class ScanRequest {
    private String content;  // raw text of resume or email
    private String type;     // "RESUME" or "EMAIL"
}