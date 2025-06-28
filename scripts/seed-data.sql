-- Seed data for Letter Management System

-- Insert departments
INSERT INTO departments (name, code, head_name, contact_email, contact_phone) VALUES
('Finance Department', 'FIN', 'Ahmed Hassan', 'finance@sindh.gov.pk', '+92-21-99201234'),
('Education Department', 'EDU', 'Fatima Khan', 'education@sindh.gov.pk', '+92-21-99201235'),
('Health Department', 'HLT', 'Dr. Ali Raza', 'health@sindh.gov.pk', '+92-21-99201236'),
('Transport Department', 'TRP', 'Muhammad Usman', 'transport@sindh.gov.pk', '+92-21-99201237'),
('Agriculture Department', 'AGR', 'Sana Malik', 'agriculture@sindh.gov.pk', '+92-21-99201238'),
('Records Department', 'RD', 'Tariq Mahmood', 'records@sindh.gov.pk', '+92-21-99201239');

-- Insert users
INSERT INTO users (email, password_hash, user_type, department, full_name) VALUES
('admin@rd.sindh.gov.pk', '$2b$10$example_hash_1', 'rd-department', 'Records Department', 'RD Administrator'),
('finance@sindh.gov.pk', '$2b$10$example_hash_2', 'other-department', 'Finance Department', 'Finance Officer'),
('education@sindh.gov.pk', '$2b$10$example_hash_3', 'other-department', 'Education Department', 'Education Officer'),
('health@sindh.gov.pk', '$2b$10$example_hash_4', 'other-department', 'Health Department', 'Health Officer'),
('courier1@tcs.com', '$2b$10$example_hash_5', 'courier', 'TCS Express', 'TCS Courier'),
('courier2@leopards.com', '$2b$10$example_hash_6', 'courier', 'Leopards Courier', 'Leopards Agent');

-- Insert courier services
INSERT INTO courier_services (name, contact_person, phone, email, address) VALUES
('TCS Express', 'Muhammad Ali', '+92-21-111-123-456', 'info@tcs.com.pk', 'TCS House, Karachi'),
('Leopards Courier', 'Sara Ahmed', '+92-21-111-456-789', 'info@leopards.com.pk', 'Leopards Building, Karachi'),
('Pakistan Post', 'Umar Farooq', '+92-21-99123456', 'info@pakpost.gov.pk', 'GPO Karachi'),
('Call Courier', 'Aisha Khan', '+92-21-111-789-123', 'info@callcourier.com.pk', 'Call Courier Center, Karachi');

-- Insert sample letters
INSERT INTO letters (letter_id, barcode, sender_name, sender_department_id, recipient_name, recipient_department_id, subject, description, priority, status, letter_type, created_by) VALUES
('LTR001', 'BAR001234567', 'Ahmed Ali', 1, 'Finance Officer', 1, 'Budget Approval Request', 'Request for budget approval for Q2 2024', 'urgent', 'pending', 'incoming', 1),
('LTR002', 'BAR001234568', 'M. Khan', 2, 'Education Officer', 2, 'School Infrastructure Report', 'Annual report on school infrastructure development', 'normal', 'assigned', 'incoming', 1),
('LTR003', 'BAR001234569', 'Sarah Shah', 3, 'Health Officer', 3, 'Medical Equipment Purchase', 'Request for medical equipment procurement', 'urgent', 'completed', 'incoming', 1),
('LTR004', 'BAR001234570', 'Aisha Qureshi', 1, 'Finance Officer', 1, 'Audit Report Submission', 'Monthly audit report submission', 'normal', 'pending', 'incoming', 1),
('OUT001', 'BAR001234571', 'RD Department', 6, 'Ministry of Finance', 1, 'Budget Allocation Report', 'Quarterly budget allocation report', 'urgent', 'delivered', 'outgoing', 1),
('OUT002', 'BAR001234572', 'RD Department', 6, 'Education Department KHI', 2, 'School Audit Results', 'Annual school audit results', 'normal', 'in-transit', 'outgoing', 1);

-- Insert letter tracking records
INSERT INTO letter_tracking (letter_id, status, location, notes, updated_by) VALUES
(1, 'received', 'RD Department - Reception', 'Letter received and logged', 1),
(1, 'scanned', 'RD Department - Scanning Station', 'Letter scanned and digitized', 1),
(1, 'pending', 'RD Department - Processing Queue', 'Awaiting assignment', 1),
(2, 'received', 'RD Department - Reception', 'Letter received and logged', 1),
(2, 'assigned', 'Education Department', 'Assigned to Education Department', 1),
(3, 'received', 'RD Department - Reception', 'Letter received and logged', 1),
(3, 'completed', 'Health Department', 'Processing completed', 1);

-- Insert notifications
INSERT INTO notifications (user_id, letter_id, title, message, type) VALUES
(2, 1, 'New Letter Assigned', 'A new urgent letter has been assigned to Finance Department', 'urgent'),
(3, 2, 'Letter Update', 'Letter LTR002 has been assigned to your department', 'info'),
(4, 3, 'Letter Completed', 'Letter LTR003 has been marked as completed', 'info');

-- Insert system logs
INSERT INTO system_logs (user_id, letter_id, action, details, ip_address) VALUES
(1, 1, 'Letter Scanned', 'Letter LTR001 scanned and processed', '192.168.1.100'),
(1, 2, 'Letter Assigned', 'Letter LTR002 assigned to Education Department', '192.168.1.100'),
(4, 3, 'Status Updated', 'Letter LTR003 marked as completed', '192.168.1.101'),
(1, NULL, 'User Login', 'RD Administrator logged in', '192.168.1.100'),
(2, NULL, 'User Login', 'Finance Officer logged in', '192.168.1.102');

-- Insert outgoing courier tracking
INSERT INTO outgoing_courier_tracking (letter_id, courier_service_id, tracking_number, pickup_date, status) VALUES
(5, 1, 'TCS123456789', '2024-04-11 10:00:00', 'delivered'),
(6, 2, 'LEO987654321', '2024-04-10 14:30:00', 'in-transit');
