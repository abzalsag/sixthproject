--liquibase formatted sql

--changeset ali:001
CREATE TABLE _user (
                       id BIGSERIAL PRIMARY KEY,
                       firstname VARCHAR(255),
                       lastname VARCHAR(255),
                       username VARCHAR(255) UNIQUE NOT NULL,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       avatar_url VARCHAR(255),
                       bio VARCHAR(255),
                       interests VARCHAR(255),
                       city VARCHAR(255),
                       gender VARCHAR(50),
                       role VARCHAR(50),
                       is_private BOOLEAN DEFAULT FALSE,
                       show_online_status BOOLEAN DEFAULT TRUE,
                       push_notifications BOOLEAN DEFAULT TRUE,
                       email_notifications BOOLEAN DEFAULT TRUE,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--changeset ali:002
CREATE TABLE user_following (
                                user_id BIGINT NOT NULL,
                                following_id BIGINT NOT NULL,
                                PRIMARY KEY (user_id, following_id),
                                CONSTRAINT fk_user_follower FOREIGN KEY (user_id) REFERENCES _user(id),
                                CONSTRAINT fk_user_following FOREIGN KEY (following_id) REFERENCES _user(id)
);