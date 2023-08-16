package com.andras.bungee.rest;

import com.andras.bungee.config.JwtService;
import com.andras.bungee.dao.BookingRepository;
import com.andras.bungee.dao.UserRepository;
import com.andras.bungee.entity.Booking;
import com.andras.bungee.entity.User;
import com.andras.bungee.service.BookingDto;
import com.andras.bungee.service.BookingService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/booking")
@RequiredArgsConstructor
public class BookingResponseController {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BookingService bookingService;


    @PostMapping("/new_booking")
    @Transactional
    public ResponseEntity<Map<String, String>> createNewBooking(@RequestBody BookingDto booking) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();

        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new EntityNotFoundException("User not found!"));

        // Create the new booking entity
        Booking newBooking = Booking.builder()
                .location(booking.getLocation())
                .activity(booking.getActivity())
                .bookedDate(booking.getBookedDate())
                .bookedTime(booking.getBookedTime())
                .user(user)
                .build();


        // Save the new booking to the database
        bookingService.createBooking(newBooking);

        // Create a new UserDetails with the updated username
        UserDetails updatedUserDetails = new User(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getUsername(),
                user.getPassword(),
                user.getRole(),
                user.getProfile_pic(),
                user.getBookings() );


        // Generate a new JWT token with the updated data
        String newToken = jwtService.generateToken(updatedUserDetails);

        // Replace the old Authentication in the SecurityContextHolder
        UsernamePasswordAuthenticationToken newAuthentication =
                new UsernamePasswordAuthenticationToken(updatedUserDetails, null, updatedUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(newAuthentication);

        Map<String, String> response = new HashMap<>();
        response.put("token", newToken);

        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/delete_booking/{bookingId}")
    @Transactional
    public ResponseEntity<Map<String, String>> deleteBooking(@PathVariable Integer bookingId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();

        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new EntityNotFoundException("User not found!"));

        Optional<Booking> bookingToDelete = bookingService.getBookingById(bookingId);

        if(bookingToDelete.isPresent() && bookingToDelete.get().getUser().equals(user)) {
            bookingService.deleteBooking(bookingToDelete.get());

            UserDetails updatedUserDetails = new User(
                    user.getId(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getUsername(),
                    user.getPassword(),
                    user.getRole(),
                    user.getProfile_pic(),
                    user.getBookings());

            String newToken = jwtService.generateToken(updatedUserDetails);

            UsernamePasswordAuthenticationToken newAuthentication =
                    new UsernamePasswordAuthenticationToken(updatedUserDetails, null, updatedUserDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(newAuthentication);

            Map<String, String> response = new HashMap<>();
            response.put("token", newToken);

            return ResponseEntity.ok(response);
        } else {

            Map<String, String> response = new HashMap<>();
            response.put("error", "Booking not found!");
            return ResponseEntity.badRequest().body(response);
        }
    }
}
