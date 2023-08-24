package com.andras.bungee.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    //the minimum required security-level for Jwt is 256-bit!
    private static final String SECRET_KEY = "hB85zI9TR2+ZzAUTvrOL/Amh09BfzU2XoqON/shC6z0g+HmIV0nICa9oXfBTIoiy";


    //extract username from the token, subject is the username of the user
    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    //extract a single Claim
    public <T>  T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);

        return claimsResolver.apply(claims);
    }


    // generates a token without extra claims(without authorization or roles) only from userDetails!
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }


    //extraClaims = if we want to store e.g. authorities, or roles within the token! Subject is the username or email.
    //'setIssuedAt' = when this claim was created, helps us to calculate the expiration date or to check if the token is still valid or not!
    //'setExpiration' = set the validity of the token. this case is 24hrs + 1000ms.
    //signWith = which key we want to use to sign this token
    //compact = will generate and return the token
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts
                .builder() //starts the process of building a JWT
                .setClaims(extraClaims) //pieces of information included in the JWT payload
                .setSubject(userDetails.getUsername()) //the subject represents the entity
                .setIssuedAt(new Date(System.currentTimeMillis())) //indicates when token is issued
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 48)) //sets expiration time
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) //signs token with secret-key
                .compact(); //finalizes JWT building process
    }

    //validates a token. Need to pass UserDetails to validate if this token belongs to this userDetails.
    //checks if given username is equals with user details username + if the token is still valid
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String userName = extractUserName(token);

        return (userName.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    //checks if the token is still valid
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }


    //gets the expiration date from the token
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // SigningKey is a secret, that digitally signs the jwt. This method extracts all the claims
    public Claims extractAllClaims(String token){
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    //decodes our secret key
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
