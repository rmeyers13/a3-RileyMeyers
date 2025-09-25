# Car Inventory Management System

**Live Application:** [Your Render Link Here]

A full-stack web application for managing personal car inventories with user authentication.

## Project Overview

This application allows users to create accounts and maintain a personal inventory of their vehicles. Each car entry includes model, year, MPG, with automatically calculated efficiency ratings and vehicle age.

### Features
- User registration and login with automatic account creation
- Add, edit, and delete car entries
- Automatic efficiency classification and age calculation
- Responsive design for all devices
- Secure password hashing and session management

## Technical Implementation

### Authentication
Custom username/password system using bcryptjs for password hashing. New accounts are automatically created when users log in with new usernames.

### CSS Framework
**Bootstrap 5.3.0** with custom Celtics-themed color scheme (green and gold). Custom CSS modifications include:
- Custom color variables and gradients
- Enhanced hover effects and shadows
- Responsive design improvements

### Express Middleware
- **express.json()**: Parses JSON requests
- **express.urlencoded()**: Handles form data
- **express.static()**: Serves static files
- **express-session**: Manages user sessions
- **Custom requireAuth**: Protects authenticated routes

## Challenges
- Implementing secure session management
- Data validation for car entries
- Ensuring responsive design with custom styling

