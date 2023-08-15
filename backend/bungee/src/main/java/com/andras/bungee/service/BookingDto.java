package com.andras.bungee.service;

import com.andras.bungee.entity.Booking;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {
    private String location;
    private String activity;
    private String bookedDate;
    private String bookedTime;
}
