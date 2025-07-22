// src/main/java/com/vdm/backend/controller/CharacterController.java
package com.vdm.backend.controller;

import com.vdm.backend.model.Character;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/character")
@CrossOrigin(origins = "http://localhost:3000")
public class CharacterController {

    private Character savedCharacter;

    @PostMapping("/save")
    public String saveCharacter(@RequestBody Character character) {
        this.savedCharacter = character;
        return "Character saved successfully!";
    }

    @GetMapping("/load")
    public Character loadCharacter() {
        return savedCharacter;
    }
}
