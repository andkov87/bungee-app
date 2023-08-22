package com.andras.bungee.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDateTimeDto {
    private String location;
    private String activity;
    private String bookedDate;
    private String bookedTime;
}
