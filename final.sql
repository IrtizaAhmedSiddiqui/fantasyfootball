use project;
select * from players;
select * from managers;
select * from teams;
select * from matches;
select * from league_table;
select * from fantasy;
select * from users;
select * from fantasy_teams;
select * from fantasy_players;
select * from fantasy_matches;

select count(*) from fantasy_matches;
select count(*) from fantasy_teams;

delete from users where user_id = 11;
delete from fantasy_teams where user_id = 13;

DELIMITER $$

CREATE PROCEDURE generate_matches(IN total_teams INT)
BEGIN
    DECLARE gameweek INT DEFAULT 1;
    DECLARE round INT DEFAULT 1;
    DECLARE half INT;
    DECLARE i INT;
    DECLARE team1 INT;
    DECLARE team2 INT;
    DECLARE offset1 INT;
    DECLARE offset2 INT;

    -- Create a temporary table to store consecutive team IDs
    CREATE TEMPORARY TABLE temp_teams (team_id INT PRIMARY KEY);
    INSERT INTO temp_teams (team_id)
        SELECT user_id FROM fantasy_teams ORDER BY user_id;

    SET half = total_teams / 2; -- Number of matches per gameweek

    -- Loop for total gameweeks (total_teams - 1)
    WHILE round < total_teams DO
        SET i = 0; -- Reset the index for each gameweek

        -- Generate matches for the current gameweek
        WHILE i < half DO
            -- Calculate offsets for team1 and team2
            SET offset1 = ((round + i - 1) MOD total_teams);
            SET offset2 = ((total_teams - i + round - 2) MOD total_teams);

            -- Assign teams based on round-robin rotation
            SELECT team_id INTO team1 
            FROM temp_teams 
            LIMIT 1 OFFSET offset1;

            SELECT team_id INTO team2 
            FROM temp_teams 
            LIMIT 1 OFFSET offset2;

            -- Insert match into the database
            INSERT INTO fantasy_matches (team1_user_id, team2_user_id, gameweek)
            VALUES (team1, team2, round);

            -- Move to the next match
            SET i = i + 1;
        END WHILE;

        -- Move to the next gameweek
        SET round = round + 1;
    END WHILE;

    -- Clean up the temporary table
    DROP TEMPORARY TABLE temp_teams;
END$$

DELIMITER ;













DELIMITER $$

CREATE TRIGGER after_team_insert
AFTER INSERT ON fantasy_teams
FOR EACH ROW
BEGIN
    DECLARE team_count INT;

    -- Count the total number of teams
    SELECT COUNT(*) INTO team_count FROM fantasy_teams;

    -- Check if team count is valid and fantasy_matches is empty
    IF team_count >= 12 AND team_count MOD 2 = 0 AND 
       (SELECT COUNT(*) FROM fantasy_matches) = 0 THEN
        -- Call the procedure to generate matches
        CALL generate_matches(team_count);
    END IF;
END$$

DELIMITER ;






DROP PROCEDURE IF EXISTS generate_matches;
DROP TRIGGER IF EXISTS after_team_insert;
DROP TRIGGER IF EXISTS after_fantasy_matches_truncate;



create table user (
user_id varchar(20) primary key,
user_name varchar(20) not null
);
ALTER TABLE fantasy DROP FOREIGN KEY fantasy_ibfk_10;

ALTER TABLE players MODIFY COLUMN player_id INT AUTO_INCREMENT;

SHOW CREATE TABLE fantasy;

CREATE TABLE fantasy_teams (
  user_id INT PRIMARY KEY,
  team_name VARCHAR(20),
  team_points INT DEFAULT 0,
  team_wins INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE fantasy_players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  player_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (player_id) REFERENCES players(player_id)
);

CREATE TABLE fantasy_matches (
    match_id INT AUTO_INCREMENT PRIMARY KEY,
    team1_user_id INT NOT NULL,
    team2_user_id INT NOT NULL,
    winner_user_id INT DEFAULT NULL, -- Use -1 for draws instead of NULL
    match_date DATETIME NOT NULL DEFAULT NOW(),
    gameweek INT NOT NULL,
    FOREIGN KEY (team1_user_id) REFERENCES fantasy_teams(user_id),
    FOREIGN KEY (team2_user_id) REFERENCES fantasy_teams(user_id)
);




CREATE TABLE fantasy (
  user_id INT PRIMARY KEY,
  team_name VARCHAR(20),
  player_id1 INT NOT NULL,
  player_id2 INT NOT NULL,
  player_id3 INT NOT NULL,
  player_id4 INT NOT NULL,
  player_id5 INT NOT NULL,
  player_id6 INT NOT NULL,
  player_id7 INT NOT NULL,
  player_id8 INT NOT NULL,
  player_id9 INT NOT NULL,
  player_id10 INT NOT NULL,
  player_id11 INT NOT NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (player_id1) REFERENCES players(player_id),
  FOREIGN KEY (player_id2) REFERENCES players(player_id),
  FOREIGN KEY (player_id3) REFERENCES players(player_id),
  FOREIGN KEY (player_id4) REFERENCES players(player_id),
  FOREIGN KEY (player_id5) REFERENCES players(player_id),
  FOREIGN KEY (player_id6) REFERENCES players(player_id),
  FOREIGN KEY (player_id7) REFERENCES players(player_id),
  FOREIGN KEY (player_id8) REFERENCES players(player_id),
  FOREIGN KEY (player_id9) REFERENCES players(player_id),
  FOREIGN KEY (player_id10) REFERENCES players(player_id),
  FOREIGN KEY (player_id11) REFERENCES players(player_id)
);


CREATE TABLE teams (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(50),
    stadium_name VARCHAR(50),
    manager_id INT UNIQUE, -- Optional: Reference manager
    owner VARCHAR(50),
    league_id INT,
    budget DECIMAL(10, 2)
);

CREATE TABLE managers (
    manager_id INT AUTO_INCREMENT PRIMARY KEY,
    manager_name VARCHAR(50),
    manager_nationality VARCHAR(50),
    salary DECIMAL(10, 2)
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(50),
    password VARCHAR(50)
);

update players set team_id = 1 where player_id = 13;

update teams set team_name = 'Man City' where team_id = 4;

delete from fantasy where user_id = 3;

drop table user;
drop table fantasy;
drop table player_selection;
SELECT player_id FROM players WHERE player_id IN ('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11');
INSERT INTO user (user_id, user_name) VALUES ('1', 'Sample User');
