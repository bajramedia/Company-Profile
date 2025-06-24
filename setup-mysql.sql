-- MySQL/MariaDB Database Setup for Bajramedia
-- Run this script to create the database

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS db_bajramedia;

-- Grant all privileges to root user (already has access by default)
-- GRANT ALL PRIVILEGES ON db_bajramedia.* TO 'root'@'localhost';

-- Use the database
USE db_bajramedia;

-- Show confirmation
SELECT 'Database db_bajramedia created successfully!' as message;
