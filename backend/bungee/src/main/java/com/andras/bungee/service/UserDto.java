package com.andras.bungee.service;

import com.andras.bungee.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String firstName;
    private String lastName;
    private String userName;
    private String email;
    private String profile_pic;
    private Set<BookingDto> bookings;

    public static UserDto fromUser(User user) {
        Set<BookingDto> bookingDtos = user.getBookings().stream()
                .map(booking -> BookingDto.builder()
                        .id(booking.getId())
                        .location(booking.getLocation())
                        .activity(booking.getActivity())
                        .bookedDate(booking.getBookedDate())
                        .bookedTime(booking.getBookedTime())
                        .build())
                        .collect(Collectors.toSet());


        return UserDto.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .userName(user.getUsername())
                .email(user.getEmail())
                .profile_pic(user.getProfile_pic())
                .bookings(bookingDtos)
                .build();
    }
}
