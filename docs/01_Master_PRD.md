# Anisekai Website Master PRD v1.0

## 1. Project

**Project Name:** Anisekai

Anisekai is an AI-powered Anime & Trading Card Game (TCG) intelligence
platform.

------------------------------------------------------------------------

# 2. Mandatory Rule

This project is NOT a redesign from scratch.

The existing CasRadar project is the architectural reference.

Reuse whenever possible:

-   Dashboard layout
-   Card-based interface
-   CMS philosophy
-   Backend workflow
-   Homepage Builder
-   Media Library
-   User Management
-   AI workflow
-   SEO Manager
-   Scheduler

Replace only the business domain:

Casino → Anime + TCG

------------------------------------------------------------------------

# 3. Core Modules

-   Anime Leaks
-   Episodes
-   TCG
-   Trends
-   News
-   Member System
-   AI Engine
-   CMS
-   Virtual Pet (Phase 2)

All modules must be independent and extensible.

------------------------------------------------------------------------

# 4. Homepage

The supplied homepage design is the official reference.

No homepage widget/card may be removed.

Homepage = Dashboard.

Each card links to a dedicated section.

------------------------------------------------------------------------

# 5. Navigation

Home

Anime Leaks

Episodes

TCG

Trends

News

Search

Login / Profile

------------------------------------------------------------------------

# 6. AI Philosophy

AI assists content creation but never publishes directly.

Workflow:

Collect

↓

Classify

↓

Generate Summary

↓

Translate

↓

SEO

↓

Optional Image

↓

Pending Review

↓

Manual Approval

↓

Publish

------------------------------------------------------------------------

# 7. AI Provider

Never hardcode one provider.

Support configurable providers via API Key.

Changing provider must not require code changes.

------------------------------------------------------------------------

# 8. CMS

Backend should follow CasRadar architecture.

Functions include:

Dashboard

CMS

Homepage Builder

Media

SEO

Scheduler

Users

Analytics

Settings

AI Engine

------------------------------------------------------------------------

# 9. Member System

Reserve architecture for:

-   Level
-   EXP
-   Avatar
-   Favorites
-   Watchlist
-   Notifications
-   Profile

------------------------------------------------------------------------

# 10. Virtual Pet

Reserve complete integration interfaces.

Detailed design will be delivered in a separate specification.

------------------------------------------------------------------------

# 11. Development Goal

Build a scalable AI-first Anime & TCG platform while preserving the
mature CasRadar architecture and workflow.
