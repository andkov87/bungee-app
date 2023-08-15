    package com.andras.bungee.entity;


    import jakarta.persistence.*;
    import lombok.*;

    import java.time.LocalDate;
    import java.time.LocalTime;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Entity
    @Table(name = "booking")
    public class Booking {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id")
        private Integer Id;

        @Column(name = "location")
        private String location;

        @Column(name = "activity")
        private String activity;

        @Column(name = "booked_date")
        private String bookedDate;

        @Column(name = "booked_time")
        private String bookedTime;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id")
        private User user;
    }
