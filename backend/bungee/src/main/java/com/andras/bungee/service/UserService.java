package com.andras.bungee.service;

import com.andras.bungee.entity.User;

import java.util.List;


public interface UserService {
    List<User> getAllUsers();
    void deleteById(int id);
    User getUser(String userName);

}
