package com.localkart.controller;

import com.localkart.dto.PredictionDTO;
import com.localkart.security.CustomUserDetails;
import com.localkart.service.PredictionService;
import com.localkart.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/predictions")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    /** Get AI-based predictions for the current user */
    @GetMapping
    public ResponseEntity<?> getPredictions(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<PredictionDTO> predictions = predictionService.getPredictions(userDetails.getUserId());
        return ResponseEntity.ok(new ApiResponse("success", "Predictions retrieved", predictions));
    }
}
