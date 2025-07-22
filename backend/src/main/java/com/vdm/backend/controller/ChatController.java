package com.vdm.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class ChatController {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamChat(@RequestParam String prompt) {
        SseEmitter emitter = new SseEmitter();

        new Thread(() -> {
            try {
                // Open connection to Ollama API
                URL url = new URL("http://localhost:11434/api/generate");
                HttpURLConnection con = (HttpURLConnection) url.openConnection();
                con.setRequestMethod("POST");
                con.setRequestProperty("Content-Type", "application/json");
                con.setDoOutput(true);

                // JSON body with prompt and stream=true
                String systemPrompt = "You are a fantasy Dungeon Master. Always respond in immersive, descriptive prose. Avoid lists or bullet points. Speak as if telling a story to adventurers around a fire.";
                String formattedPrompt = systemPrompt + "\n\nUser: " + prompt;

                // SAFELY escape JSON
                String promptEscaped = objectMapper.writeValueAsString(formattedPrompt);
                String body = String.format("{\"model\": \"mistral\", \"prompt\": %s, \"stream\": true}",
                        promptEscaped);

                try (OutputStream os = con.getOutputStream()) {
                    os.write(body.getBytes(StandardCharsets.UTF_8));
                }

                // Read response line by line
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(con.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        if (!line.trim().isEmpty()) {
                            try {
                                // Parse the streamed JSON chunk
                                JsonNode jsonNode = objectMapper.readTree(line);
                                if (jsonNode.has("response")) {
                                    String token = jsonNode.get("response").asText();

                                    // Send as clean JSON to frontend
                                    String formatted = objectMapper.writeValueAsString(
                                            objectMapper.createObjectNode().put("response", token));
                                    emitter.send(SseEmitter.event().data(formatted));
                                }
                            } catch (Exception parseEx) {
                                System.err.println("Failed to parse line: " + line);
                                parseEx.printStackTrace();
                            }
                        }
                    }
                }

                emitter.complete();
            } catch (Exception e) {
                try {
                    emitter.send(SseEmitter.event().name("error").data(e.getMessage()));
                } catch (IOException ioException) {
                    ioException.printStackTrace();
                }
                emitter.completeWithError(e);
            }
        }).start();

        return emitter;
    }
}
