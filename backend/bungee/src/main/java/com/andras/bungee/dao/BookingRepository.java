package com.andras.bungee.dao;

import com.andras.bungee.entity.Booking;
import com.andras.bungee.entity.User;
import jakarta.annotation.Nullable;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    Optional<Booking> findByUser(User user);
    Optional<Booking> findById(Integer id);
}
