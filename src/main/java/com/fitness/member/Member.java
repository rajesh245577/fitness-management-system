package com.fitness.member;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "members")
public class Member {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Email @NotBlank
    @Column(unique = true)
    private String email;

    @Positive
    private double weightKg;

    protected Member() {}

    public Member(String name, String email, double weightKg) {
        this.name = name;
        this.email = email;
        this.weightKg = weightKg;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public double getWeightKg() { return weightKg; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setWeightKg(double weightKg) { this.weightKg = weightKg; }
}
