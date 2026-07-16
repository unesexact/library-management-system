package com.library.librarymanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http

                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/login", "/css/**", "/js/**", "/images/**").permitAll()

                        .anyRequest().authenticated()

                )

                .formLogin(form -> form

                        .loginPage("/login").defaultSuccessUrl("/index.html", true).failureUrl("/login?error").permitAll()

                )

                .logout(logout -> logout

                        .logoutSuccessUrl("/login?logout").permitAll()

                )

                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

}