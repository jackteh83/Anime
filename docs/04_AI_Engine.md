# 04_Anisekai_AI_Engine_Specification_v1.0

# AI Engine Overview

The AI Engine is the core automation system of Anisekai.

Its purpose is to automatically collect, process, optimize and prepare
Anime & TCG content for editorial review.

The AI Engine must be modular and provider-independent.

------------------------------------------------------------------------

# AI Workflow

Data Sources

↓

RSS / API / Website Collection

↓

AI Classification

↓

Duplicate Detection

↓

AI Summary

↓

AI Rewrite

↓

AI Translation

↓

SEO Optimization

↓

(Optional) AI Image Generation

↓

Pending Review Queue

↓

Manual Approval

↓

Publish

------------------------------------------------------------------------

# Data Sources

Support multiple sources:

-   RSS
-   Official APIs
-   Public APIs
-   Approved Websites
-   Social Platforms (where permitted)

Every source should be configurable from the CMS.

------------------------------------------------------------------------

# AI Providers

Do NOT hardcode any provider.

Support switching providers using API Keys only.

Examples:

-   OpenAI
-   Anthropic Claude
-   Google Gemini
-   xAI
-   OpenRouter
-   Local LLM (Optional)

Support:

-   Default Provider
-   Fallback Provider
-   Model Selection

Changing provider must never require code changes.

------------------------------------------------------------------------

# AI Writing

Support one-click generation of:

-   Titles
-   Summaries
-   Full Articles
-   Rewrites
-   SEO Titles
-   Meta Descriptions
-   Keywords
-   Tags
-   Multi-language Translation

Editors can regenerate outputs before publishing.

------------------------------------------------------------------------

# AI Image

Support AI-assisted generation of:

-   Featured Images
-   Hero Banners
-   Thumbnails
-   Promotional Images

Optional features:

-   Upscaling
-   Background Removal
-   Aspect Ratio Adjustment

Generated images are saved to Media Library and require manual approval.

------------------------------------------------------------------------

# Queue System

Every AI task enters a processing queue.

Statuses include:

-   Waiting
-   Running
-   Completed
-   Failed
-   Pending Review
-   Published

------------------------------------------------------------------------

# Duplicate Detection

Automatically detect:

-   Duplicate articles
-   Duplicate RSS items
-   Similar headlines

Prevent duplicate publication.

------------------------------------------------------------------------

# AI Review Policy

AI never publishes directly.

All generated content must be reviewed by an editor before publication.

------------------------------------------------------------------------

# Scheduler

Support scheduled automation:

-   RSS Refresh
-   API Refresh
-   AI Processing
-   Republishing
-   Cache Refresh

------------------------------------------------------------------------

# Logging

Record:

-   Provider used
-   Model used
-   Prompt version
-   Processing time
-   Token usage
-   Error logs

------------------------------------------------------------------------

# Future Expansion

The AI Engine must allow new providers, workflows, tools, and automation
modules to be added without redesigning the system architecture.
