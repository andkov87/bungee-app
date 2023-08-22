package com.andras.bungee.service;

import com.andras.bungee.dao.BookingRepository;
import com.andras.bungee.entity.Booking;
import com.andras.bungee.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.print.Book;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    @Autowired
    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Set<Booking> getBookingsForUser(User user) {
        return user.getBookings();
    }

    public List<BookingDateTimeDto> getAllBookedDatesAndTimes() {
        List<Booking> bookings = bookingRepository.findAll();

        return bookings.stream()
                .map(booking -> new BookingDateTimeDto(booking.getLocation(), booking.getActivity(), booking.getBookedDate(), booking.getBookedTime()))
                .collect(Collectors.toList());
    }

    public Optional<Booking> getBookingById(Integer bookingId) {
        return bookingRepository.findById(bookingId);
    }

    public void createBooking(Booking booking) {
        bookingRepository.save(booking);
    }

    public void updateBooking(Booking booking) {
        bookingRepository.save(booking);
    }

    public void deleteBooking(Booking booking) {
        bookingRepository.delete(booking);
    }
}
