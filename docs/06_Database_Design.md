# 06 Anisekai Database Design

## Purpose

Define the core database architecture.

## Core Tables

-   Users
-   Roles
-   Permissions
-   User Profiles
-   Anime
-   Episodes
-   Anime Leaks
-   News
-   TCG Games
-   Cards
-   Decks
-   Trends
-   Tags
-   Categories
-   Media
-   AI Jobs
-   AI Logs
-   RSS Sources
-   API Sources
-   Notifications
-   Bookmarks
-   Watchlists

## Design Rules

-   Use UUID or equivalent unique IDs.
-   Foreign keys for relationships.
-   Soft delete where appropriate.
-   Audit fields (created_at, updated_at).
-   Modular schema allowing future tables such as Virtual Pet,
    Marketplace and Forum without redesign.
