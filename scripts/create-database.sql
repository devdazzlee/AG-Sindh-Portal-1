-- Create database schema for Letter Management System

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('rd-department', 'other-department', 'courier')),
    department VARCHAR(100),
    full_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    head_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Letters table
CREATE TABLE IF NOT EXISTS letters (
    id SERIAL PRIMARY KEY,
    letter_id VARCHAR(20) UNIQUE NOT NULL,
    barcode VARCHAR(50) UNIQUE NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_department_id INTEGER REFERENCES departments(id),
    recipient_name VARCHAR(255),
    recipient_department_id INTEGER REFERENCES departments(id),
    subject TEXT NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('urgent', 'normal')),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in-review', 'completed', 'returned')),
    letter_type VARCHAR(20) NOT NULL CHECK (letter_type IN ('incoming', 'outgoing')),
    received_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_date TIMESTAMP,
    completed_date TIMESTAMP,
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size INTEGER,
    created_by INTEGER REFERENCES users(id),
    assigned_to INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Letter tracking table
CREATE TABLE IF NOT EXISTS letter_tracking (
    id SERIAL PRIMARY KEY,
    letter_id INTEGER REFERENCES letters(id),
    status VARCHAR(30) NOT NULL,
    location VARCHAR(255),
    notes TEXT,
    updated_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    letter_id INTEGER REFERENCES letters(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('info', 'warning', 'urgent')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System logs table
CREATE TABLE IF NOT EXISTS system_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    letter_id INTEGER REFERENCES letters(id),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courier services table
CREATE TABLE IF NOT EXISTS courier_services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Outgoing letters courier tracking
CREATE TABLE IF NOT EXISTS outgoing_courier_tracking (
    id SERIAL PRIMARY KEY,
    letter_id INTEGER REFERENCES letters(id),
    courier_service_id INTEGER REFERENCES courier_services(id),
    tracking_number VARCHAR(100),
    pickup_date TIMESTAMP,
    delivery_date TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'picked-up', 'in-transit', 'delivered', 'failed')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_letters_barcode ON letters(barcode);
CREATE INDEX IF NOT EXISTS idx_letters_status ON letters(status);
CREATE INDEX IF NOT EXISTS idx_letters_priority ON letters(priority);
CREATE INDEX IF NOT EXISTS idx_letters_received_date ON letters(received_date);
CREATE INDEX IF NOT EXISTS idx_letter_tracking_letter_id ON letter_tracking(letter_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);
