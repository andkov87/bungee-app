package com.andras.bungee.service;

import com.andras.bungee.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String firstName;
    private String lastName;
    private String userName;
    private String email;

    public static UserDto fromUser(User user) {
        return UserDto.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .userName(user.getUsername())
                .email(user.getEmail())
                .build();
    }
}
