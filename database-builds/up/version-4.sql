ALTER TABLE alarms ADD COLUMN active boolean DEFAULT TRUE;
ALTER TABLE alarms ADD CONSTRAINT unique_title UNIQUE (title);
