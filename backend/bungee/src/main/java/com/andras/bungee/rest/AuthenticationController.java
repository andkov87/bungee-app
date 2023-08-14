package com.andras.bungee.rest;

import com.andras.bungee.dao.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        boolean isUserNameTaken = userRepository.existsByUserName(request.getUserName());
        boolean isEmailTaken = userRepository.existsByEmail(request.getEmail());

        //check both username and email are already taken
        if(isUserNameTaken && isEmailTaken) {
            //return the error response indicating that the username and email are already taken
            return ResponseEntity.badRequest().body(new RegistrationErrorResponse("Username and Email are already taken!"));
        }
        //check if username is already taken
        else if(isUserNameTaken) {

            //return the error response indicating that the username is already taken
            return ResponseEntity.badRequest().body(new RegistrationErrorResponse("Username is already taken!"));
        }
        //check if the email is already taken
        else if(isEmailTaken) {
            return ResponseEntity.badRequest().body(new RegistrationErrorResponse("Email is already taken!"));
        }

        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }
}
