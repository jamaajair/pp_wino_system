package com.wino.demo;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class HelloController {
    
    @GetMapping("/")
    public String hello() {
        return "Wino Backend is running!";
    }
    
    @GetMapping("/api/health")
    public String health() {
        return "OK";
    }
    
    @GetMapping("/api/status")
    public Map<String, Object> status() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Backend is operational");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}