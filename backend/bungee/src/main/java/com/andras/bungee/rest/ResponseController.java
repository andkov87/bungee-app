package com.andras.bungee.rest;

import com.andras.bungee.config.JwtService;
import com.andras.bungee.dao.UserRepository;
import com.andras.bungee.entity.User;
import com.andras.bungee.service.UserDto;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class ResponseController {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @GetMapping
    public UserDto getUserInfo() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();

        //retrieve user from database based on the username
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new EntityNotFoundException("User not found!"));

        //convert the User entity to userDto using the fromUser() method
        UserDto userDto = UserDto.fromUser(user);

        return userDto;
    }

    @DeleteMapping("/profile")
    @Transactional
    public ResponseEntity<String> deleteProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();

        userRepository.deleteUserByUserName(userName);

        return ResponseEntity.ok("Account has been deleted!");
    }

    @PutMapping("/profile/username")
    @Transactional
    public ResponseEntity<Map<String, String>> updateUsername(
            @RequestParam String newUserName) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();

        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new EntityNotFoundException("User not found!"));

        boolean isUserNameTaken = userRepository.existsByUserName(newUserName);

        if(isUserNameTaken) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Username is already taken!");
            return ResponseEntity.badRequest().body(response);
        }

        // Update the username
        user.setUserName(newUserName);
        userRepository.save(user);
        System.out.println(user.getUsername());

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
                user.getBookings());

        System.out.println(updatedUserDetails.getUsername());

        // Generate a new JWT token with the updated data
        String newToken = jwtService.generateToken(updatedUserDetails);
        System.out.println(newToken);


        // Replace the old Authentication in the SecurityContextHolder
        UsernamePasswordAuthenticationToken newAuthentication =
                new UsernamePasswordAuthenticationToken(updatedUserDetails, null, updatedUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(newAuthentication);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization","Bearer " + newToken);
        System.out.println(headers);

        Map<String, String> response = new HashMap<>();
        response.put("token", newToken);


        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/email")
    @Transactional
    public ResponseEntity<Map<String, String>> updateEmail(@RequestParam String newEmail) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();

        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new EntityNotFoundException("User not found!"));

        boolean isEmailTaken = userRepository.existsByEmail(newEmail);

        if(isEmailTaken) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Email is already taken!");
            return ResponseEntity.badRequest().body(response);
        }

        // Update the username or email
        user.setEmail(newEmail);
        userRepository.save(user);
        System.out.println(user.getEmail());

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

        System.out.println(updatedUserDetails.getUsername());

        // Generate a new JWT token with the updated data
        String newToken = jwtService.generateToken(updatedUserDetails);
        System.out.println(newToken);


        // Replace the old Authentication in the SecurityContextHolder
        UsernamePasswordAuthenticationToken newAuthentication =
                new UsernamePasswordAuthenticationToken(updatedUserDetails, null, updatedUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(newAuthentication);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization","Bearer " + newToken);
        System.out.println(headers);

        Map<String, String> response = new HashMap<>();
        response.put("token", newToken);


        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/profile_pic")
    public ResponseEntity<?> uploadProfilePicture(@RequestBody Map<String, String> requestMap) throws UnsupportedEncodingException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();

            //decode the profile_pic
            String base64Image = requestMap.get("profile_pic");
           // System.out.println("decoded: " + base64Image);

            String profilePicString = URLDecoder.decode(base64Image, StandardCharsets.UTF_8);
            profilePicString = profilePicString.replace(" ","+");

          //  String profilePicString = new String(Base64.getDecoder().decode(base64Image.getBytes(StandardCharsets.UTF_8)));

            // System.out.println("decoded: " + profilePicString);


            User user = userRepository.findByUserName(userName)
                    .orElseThrow(() -> new EntityNotFoundException("User not found!"));

        // Update the profile_pic
        user.setProfile_pic(profilePicString);
            userRepository.save(user);

        // Create a new UserDetails with the updated profile_pic
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
}
