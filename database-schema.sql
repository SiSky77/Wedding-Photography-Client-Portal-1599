-- Sky Photography Wedding Client Management Database Schema
-- This file contains the complete database structure for Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('client', 'admin');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  role user_role DEFAULT 'client',
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wedding forms table
CREATE TABLE wedding_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  form_data JSONB NOT NULL DEFAULT '{}',
  completion_percentage INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  wedding_date DATE,
  bride_name TEXT,
  groom_name TEXT,
  venue_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Form auto-save table for draft storage
CREATE TABLE form_autosave (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, section)
);

-- Email reminders table
CREATE TABLE email_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL, -- '4_weeks', '2_weeks', '1_week'
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  is_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Additional forms table (for optional forms like album choices, etc.)
CREATE TABLE additional_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  form_type TEXT NOT NULL, -- 'album_choices', 'surprise_plans', 'group_updates'
  form_data JSONB NOT NULL DEFAULT '{}',
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin settings table
CREATE TABLE admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_wedding_forms_user_id ON wedding_forms(user_id);
CREATE INDEX idx_wedding_forms_wedding_date ON wedding_forms(wedding_date);
CREATE INDEX idx_wedding_forms_completion ON wedding_forms(completion_percentage);
CREATE INDEX idx_form_autosave_user_section ON form_autosave(user_id, section);
CREATE INDEX idx_email_reminders_scheduled ON email_reminders(scheduled_for) WHERE NOT is_sent;
CREATE INDEX idx_additional_forms_user_type ON additional_forms(user_id, form_type);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_autosave ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE additional_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Wedding forms policies
CREATE POLICY "Users can view own wedding forms" ON wedding_forms
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wedding forms" ON wedding_forms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wedding forms" ON wedding_forms
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all wedding forms" ON wedding_forms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Form autosave policies
CREATE POLICY "Users can manage own autosave data" ON form_autosave
  FOR ALL USING (auth.uid() = user_id);

-- Email reminders policies
CREATE POLICY "Users can view own reminders" ON email_reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reminders" ON email_reminders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Additional forms policies
CREATE POLICY "Users can manage own additional forms" ON additional_forms
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all additional forms" ON additional_forms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Admin settings policies (admin only)
CREATE POLICY "Admins can manage settings" ON admin_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Functions and Triggers

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update wedding form completion percentage
CREATE OR REPLACE FUNCTION calculate_form_completion(form_data JSONB)
RETURNS INTEGER AS $$
DECLARE
  required_fields TEXT[] := ARRAY[
    'bride_name', 'groom_name', 'wedding_date', 'venue_name',
    'ceremony_time', 'reception_time', 'contact_phone'
  ];
  completed_count INTEGER := 0;
  field TEXT;
BEGIN
  FOREACH field IN ARRAY required_fields
  LOOP
    IF form_data ? field AND 
       form_data ->> field IS NOT NULL AND 
       TRIM(form_data ->> field) != '' THEN
      completed_count := completed_count + 1;
    END IF;
  END LOOP;
  
  RETURN ROUND((completed_count::FLOAT / array_length(required_fields, 1)) * 100);
END;
$$ LANGUAGE plpgsql;

-- Function to update form metadata on change
CREATE OR REPLACE FUNCTION update_wedding_form_metadata()
RETURNS TRIGGER AS $$
BEGIN
  NEW.completion_percentage := calculate_form_completion(NEW.form_data);
  NEW.is_completed := (NEW.completion_percentage = 100);
  NEW.wedding_date := (NEW.form_data ->> 'wedding_date')::DATE;
  NEW.bride_name := NEW.form_data ->> 'bride_name';
  NEW.groom_name := NEW.form_data ->> 'groom_name';
  NEW.venue_name := NEW.form_data ->> 'venue_name';
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update form metadata
CREATE TRIGGER update_wedding_form_metadata_trigger
  BEFORE INSERT OR UPDATE ON wedding_forms
  FOR EACH ROW EXECUTE FUNCTION update_wedding_form_metadata();

-- Function to schedule email reminders
CREATE OR REPLACE FUNCTION schedule_email_reminders()
RETURNS TRIGGER AS $$
DECLARE
  wedding_date DATE;
BEGIN
  wedding_date := (NEW.form_data ->> 'wedding_date')::DATE;
  
  IF wedding_date IS NOT NULL AND NEW.completion_percentage < 100 THEN
    -- Schedule 4 weeks reminder
    INSERT INTO email_reminders (user_id, reminder_type, scheduled_for)
    VALUES (NEW.user_id, '4_weeks', wedding_date - INTERVAL '4 weeks')
    ON CONFLICT DO NOTHING;
    
    -- Schedule 2 weeks reminder
    INSERT INTO email_reminders (user_id, reminder_type, scheduled_for)
    VALUES (NEW.user_id, '2_weeks', wedding_date - INTERVAL '2 weeks')
    ON CONFLICT DO NOTHING;
    
    -- Schedule 1 week reminder
    INSERT INTO email_reminders (user_id, reminder_type, scheduled_for)
    VALUES (NEW.user_id, '1_week', wedding_date - INTERVAL '1 week')
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to schedule reminders
CREATE TRIGGER schedule_reminders_trigger
  AFTER INSERT OR UPDATE ON wedding_forms
  FOR EACH ROW EXECUTE FUNCTION schedule_email_reminders();

-- Views for easier data access

-- View for admin dashboard
CREATE VIEW admin_client_overview AS
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.created_at as client_since,
  wf.wedding_date,
  wf.bride_name,
  wf.groom_name,
  wf.venue_name,
  wf.completion_percentage,
  wf.is_completed,
  wf.updated_at as last_form_update,
  CASE 
    WHEN wf.wedding_date IS NOT NULL THEN 
      wf.wedding_date - CURRENT_DATE
    ELSE NULL
  END as days_until_wedding
FROM profiles p
LEFT JOIN wedding_forms wf ON p.id = wf.user_id
WHERE p.role = 'client'
ORDER BY wf.wedding_date ASC NULLS LAST;

-- View for pending email reminders
CREATE VIEW pending_email_reminders AS
SELECT 
  er.*,
  p.email,
  p.full_name,
  wf.bride_name,
  wf.groom_name,
  wf.wedding_date,
  wf.completion_percentage
FROM email_reminders er
JOIN profiles p ON er.user_id = p.id
LEFT JOIN wedding_forms wf ON er.user_id = wf.user_id
WHERE er.is_sent = FALSE 
  AND er.scheduled_for <= NOW()
ORDER BY er.scheduled_for ASC;

-- Initial admin user setup (run after first admin signs up)
-- INSERT INTO profiles (id, email, full_name, role) 
-- VALUES ('your-admin-user-id', 'admin@skyphotography.com', 'Admin User', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Initial admin settings
INSERT INTO admin_settings (setting_key, setting_value) VALUES
('email_reminders_enabled', 'true'),
('reminder_email_template_4_weeks', '{
  "subject": "Wedding Form Reminder - 4 Weeks to Go!",
  "template": "Hi {bride_name} & {groom_name}! Your wedding is just 4 weeks away. Please complete your wedding form to ensure we capture every special moment."
}'),
('reminder_email_template_2_weeks', '{
  "subject": "Wedding Form Reminder - 2 Weeks to Go!",
  "template": "Hi {bride_name} & {groom_name}! Your wedding is just 2 weeks away. Please complete your wedding form as soon as possible."
}'),
('reminder_email_template_1_week', '{
  "subject": "Wedding Form Reminder - Final Week!",
  "template": "Hi {bride_name} & {groom_name}! Your wedding is just 1 week away. Please complete your wedding form immediately to ensure perfect photography."
}')
ON CONFLICT (setting_key) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;