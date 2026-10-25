-- DevMeet database (PostgreSQL / Neon)

DROP TABLE IF EXISTS meetings;
DROP TABLE IF EXISTS teams;

CREATE TABLE teams (
    team_id   SERIAL PRIMARY KEY,
    team_name VARCHAR(50) NOT NULL
);

CREATE TABLE meetings (
    meeting_id  SERIAL PRIMARY KEY,
    team_id     INT NOT NULL REFERENCES teams(team_id),
    start_time  TIMESTAMP NOT NULL,
    end_time    TIMESTAMP NOT NULL,
    description TEXT NOT NULL,
    room        VARCHAR(50) NOT NULL,
    CHECK (end_time > start_time)
);

INSERT INTO teams (team_name) VALUES
    ('Team UI'),
    ('Team Mobile'),
    ('Team React'),
    ('Team Backend');

INSERT INTO meetings (team_id, start_time, end_time, description, room) VALUES
    (1, '2026-09-14 10:00', '2026-09-14 11:00', 'Design review of the new dashboard', 'Blue Room'),
    (1, '2026-11-03 09:30', '2026-11-03 10:15', 'Sprint planning', 'Blue Room'),
    (2, '2026-09-22 14:00', '2026-09-22 15:30', 'Release retrospective for app version 3.2', 'New York Room'),
    (2, '2026-10-12 11:00', '2026-10-12 11:30', 'Daily sync with QA', 'Green Room'),
    (2, '2026-11-18 13:00', '2026-11-18 15:00', 'Push notifications architecture', 'Large Board Room'),
    (3, '2026-10-05 10:00', '2026-10-05 12:00', 'Migration to React 19 workshop', 'Large Board Room'),
    (3, '2026-11-10 16:00', '2026-11-10 16:45', 'Code review session', 'Blue Room'),
    (3, '2026-12-01 09:00', '2026-12-01 10:30', 'Quarterly roadmap planning', 'New York Room'),
    (4, '2026-09-30 15:00', '2026-09-30 16:00', 'Database performance analysis', 'Green Room'),
    (4, '2026-11-25 10:00', '2026-11-25 13:00', 'API security audit', 'Large Board Room');
