// src/main/java/com/vdm/backend/model/Character.java
package com.vdm.backend.model;

import java.util.List;

public class Character {
    private String name;
    private String race;
    private String characterClass;
    private int level;
    private Stats stats;
    private List<String> equipment;
    private String background;

    // Getters and Setters

    public static class Stats {
        private int strength;
        private int dexterity;
        private int constitution;
        private int intelligence;
        private int wisdom;
        private int charisma;

        // Getters and Setters
    }
}
