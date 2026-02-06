# UC-Edge Platform User Guide

**Version 2.0 | United Capital Plc**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Platform Overview](#platform-overview)
4. [Core Features](#core-features)
5. [User Roles & Permissions](#user-roles--permissions)
6. [Dashboard & Analytics](#dashboard--analytics)
7. [Customer Management](#customer-management)
8. [Segmentation](#segmentation)
9. [Campaign Management](#campaign-management)
10. [Journey Orchestration](#journey-orchestration)
11. [AI & Automation](#ai--automation)
12. [Compliance & Governance](#compliance--governance)
13. [Best Practices](#best-practices)
14. [Technical Architecture](#technical-architecture)
15. [FAQs](#faqs)

---

## Introduction

### What is UC-Edge?

UC-Edge is United Capital's comprehensive **Customer Engagement Platform** designed to deliver personalized, compliant, and data-driven customer communications across multiple channels. Built specifically for financial services, UC-Edge combines customer intelligence, marketing automation, AI-powered insights, and governance into a single unified platform.

### Key Capabilities

- **360° Customer View**: Complete visibility into customer behavior, transactions, and lifecycle stages
- **Intelligent Segmentation**: AI-powered customer segmentation with 25 sentiment buckets and 13 filter dimensions
- **Multi-Channel Campaigns**: Orchestrate campaigns across Email, SMS, WhatsApp, Push Notifications, and In-App messaging
- **Journey Automation**: Visual journey builder with triggers, conditions, splits, and personalization
- **Compliance Built-In**: GDPR-compliant audit trails, consent management, and approval workflows
- **Real-Time Analytics**: Live dashboards with sentiment analysis, churn prediction, and engagement metrics

### Who Should Use UC-Edge?

- **Marketing Managers**: Create and launch targeted campaigns
- **Campaign Specialists**: Build customer journeys and manage ongoing communications
- **Data Analysts**: Analyze customer behavior and segment performance
- **Compliance Officers**: Monitor consent, audit trails, and governance
- **Executives**: View high-level metrics and business intelligence
- **Customer Success Teams**: Track engagement and prevent churn

---

## Getting Started

### Login & Authentication

1. Navigate to the UC-Edge login page
2. Select your user profile from the available options:
   - **Marketing Manager** (Full campaign and journey access)
   - **Campaign Specialist** (Campaign execution)
   - **Analyst** (Read-only analytics)
   - **Compliance Officer** (Audit and governance)
   - **Executive** (Dashboard overview)
   - **Support Agent** (Customer service)

3. Enter the OTP code: `123456`
4. You'll be logged in with role-specific permissions

### First-Time Navigation

Upon login, you'll see:
- **Sidebar Navigation**: Organized by function (Dashboard, Customer Intelligence, Engagement, AI & Analytics, Compliance, Support)
- **Header**: Shows your current user profile and role
- **Main Content Area**: Dynamic based on selected page

### Platform Display Settings

- **Customer Count Display**: All customer counts are multiplied by 425 for display purposes
- **Actual Data**: The platform tracks ~5,000 real customers in the system
- **Displayed Count**: Shows ~2,125,000 customers (5,000 × 425)

---

## Platform Overview

### Architecture Components

UC-Edge is built on a modern tech stack:

- **Frontend**: React + TypeScript with Vite
- **UI Framework**: Shadcn/ui + Tailwind CSS
- **State Management**: React Context API
- **Database**: Supabase (PostgreSQL)
- **Journey Canvas**: XYFlow for visual journey building
- **Charts**: Recharts for analytics visualization

### Data Model

The platform manages:
- **Customers** (~5,000 records): Demographics, behavior, transactions, lifecycle stages
- **Transactions**: Financial transactions with amounts, types, and channels
- **Events**: Behavioral events (logins, purchases, support tickets, etc.)
- **Segments**: Dynamic customer groupings with criteria and metrics
- **Campaigns**: Multi-channel marketing campaigns
- **Journeys**: Automated customer journey flows
- **Audit Logs**: Immutable communication and activity records
- **Consent Records**: Channel-specific opt-in/opt-out preferences


---

## Core Features

### 1. Dashboard & Overview

#### Overview Page (`/overview`)
Your landing page with key metrics:
- Total customers (2.1M displayed)
- Active customers count
- Churn rate percentage
- Reactivation rate
- Customer distribution by lifecycle stage
- Top 5 segment performance metrics

#### Detailed Dashboard (`/dashboard`)
Six specialized tabs providing deep insights into different aspects of your customer base and business operations.

**Customers Tab**
Complete customer analytics dashboard showing:
- Lifecycle stage distribution (pie chart visualization)
- Top performing segments by customer count
- Engagement level breakdown (high/medium/low)
- Gender distribution across customer base
- Real-time customer counts and trends

**Products Tab**
Product performance and adoption metrics:
- Product adoption rates across customer segments
- Cross-sell opportunity identification
- Product performance by customer segment
- Revenue contribution per product
- Usage patterns and trends

**Marketing Tab**
Comprehensive campaign performance overview:
- Active and completed campaign metrics
- Channel effectiveness comparison (Email vs SMS vs WhatsApp vs Push)
- Conversion rates by campaign and channel
- Marketing ROI calculations
- Best performing campaign templates

**Behavior Tab**
Customer behavioral analysis tools:
- Login frequency analysis and patterns
- Feature usage heat maps
- Customer journey progress tracking
- Engagement trend visualization over time
- Activity timeline analysis

**Transactions Tab**
Financial transaction insights:
- Transaction volume by channel (online, mobile, branch, ATM)
- Average transaction value trends
- Transaction frequency per customer segment
- Payment method breakdown and preferences
- Revenue analytics and forecasting

**Risk Alerts Tab**
Proactive churn prevention dashboard:
- High-risk customers (churn probability > 70%)
- Medium-risk customers (40-70% churn risk)
- Recommended retention actions per customer
- Real-time risk scoring updates
- Historical risk trend analysis

---

## User Roles & Permissions

### Role-Based Access Control (RBAC)

UC-Edge implements granular permission control with 20 specific permissions across 6 user roles. Each role is carefully designed to provide access only to the features and data necessary for that user's job function.

#### Permission List (20 Total)
1. `can_view_dashboard` - View dashboard pages
2. `can_view_customers` - Access customer data
3. `can_export_customers` - Export customer lists
4. `can_manage_segments` - Create/edit segments
5. `can_create_campaigns` - Create marketing campaigns
6. `can_launch_campaigns` - Execute campaigns
7. `can_create_journeys` - Build customer journeys
8. `can_approve_actions` - Approve pending items
9. `can_view_analytics` - Access analytics dashboards
10. `can_view_audit` - View audit trails
11. `can_view_consent` - View consent records
12. `can_update_consent` - Modify consent settings
13. `can_view_governance` - Access governance logs
14. `can_export_data` - Export platform data
15. `can_manage_users` - User management
16. `can_configure_system` - System configuration
17. `can_manage_ai_agents` - AI agent configuration
18. `can_view_reports` - Access reporting
19. `can_create_segments` - Build new segments
20. `can_manage_personalization` - Manage personalization templates

#### 1. Marketing Manager Role
**Full Platform Access** - The power user with comprehensive permissions.

**Permissions** (17 of 20):
- ✅ View Dashboard
- ✅ View/Export Customers
- ✅ Manage Segments
- ✅ Create/Launch Campaigns
- ✅ Create/Manage Journeys
- ✅ View Analytics
- ✅ View/Update Consent
- ✅ View Audit Logs
- ✅ Approve Actions
- ✅ View Governance
- ✅ Manage Personalization
- ✅ View Reports
- ✅ Export Data
- ✅ Manage AI Agents
- ✅ Create Segments
- ❌ Cannot manage users
- ❌ Cannot configure system
- ❌ Cannot modify core settings

**Typical Use Cases**:
- Designing comprehensive marketing strategies
- Creating and managing customer segments
- Building complex customer journeys
- Launching multi-channel campaigns
- Analyzing campaign performance
- Approving campaign content
- Monitoring compliance and governance

**Menu Access**: Full access to all sections except Settings

#### 2. Campaign Specialist Role
**Campaign Execution Focus** - Operational role for day-to-day campaign management.

**Permissions** (10 of 20):
- ✅ View Dashboard
- ✅ View Customers (no export)
- ✅ Create Campaigns (cannot launch without approval)
- ✅ View Segments (cannot create)
- ✅ View Analytics (limited)
- ✅ View Consent
- ✅ Create Journeys (cannot publish without approval)
- ❌ Cannot approve campaigns
- ❌ Cannot export customer data
- ❌ Cannot view governance logs
- ❌ Cannot manage segments
- ❌ Cannot launch campaigns independently

**Typical Use Cases**:
- Daily campaign operations
- Content creation and testing
- Journey execution monitoring
- Performance tracking
- Customer list review
- Template management

**Menu Access**: Dashboard, Segments (view only), Campaigns, Journeys (limited), Analytics (limited)

#### 3. Analyst Role
**Read-Only Analytics** - Pure analytical role with no modification rights.

**Permissions** (6 of 20):
- ✅ View Dashboard
- ✅ View Customers
- ✅ View Segments
- ✅ View Analytics
- ✅ View Campaigns (read-only)
- ✅ View Reports
- ❌ Cannot create/edit anything
- ❌ Cannot export data
- ❌ Cannot manage journeys
- ❌ Cannot access governance

**Typical Use Cases**:
- Performance analysis and reporting
- Customer behavior insights
- Segment performance evaluation
- Campaign effectiveness analysis
- Trend identification
- Data visualization

**Menu Access**: Dashboard, Analytics, Reports (all read-only)

#### 4. Compliance Officer Role
**Governance & Audit Focus** - Specialized role for regulatory compliance.

**Permissions** (8 of 20):
- ✅ View Audit Logs
- ✅ View Governance Logs
- ✅ View/Update Consent
- ✅ View Activity Logs
- ✅ Approve Actions (compliance-related)
- ✅ View Reports (compliance-focused)
- ✅ Export Audit Data
- ❌ Cannot create campaigns
- ❌ Cannot view full customer PII (limited access)
- ❌ Cannot manage journeys
- ❌ Cannot view analytics

**Typical Use Cases**:
- Regulatory compliance monitoring
- Audit trail review
- Consent management
- Approval workflow oversight
- Compliance reporting
- Policy violation investigation
- GDPR compliance verification

**Menu Access**: Audit Trail, Consent Management, Governance Logs, Approval Queue

#### 5. Executive Role
**Strategic Overview** - High-level access for decision-makers.

**Permissions** (5 of 20):
- ✅ View Dashboard
- ✅ View Analytics
- ✅ View High-Level Reports
- ✅ Approve Strategic Actions
- ✅ View Performance Metrics
- ❌ Cannot create campaigns
- ❌ Cannot access operational details
- ❌ Cannot view individual customers
- ❌ Cannot export data

**Typical Use Cases**:
- Business intelligence review
- Strategic decision-making
- Performance monitoring
- ROI analysis
- High-level trend identification

**Menu Access**: Overview Dashboard, Analytics (summary), Reports (executive summary)

#### 6. Support Agent Role
**Customer Service** - Customer-facing support role.

**Permissions** (7 of 20):
- ✅ View Customers (360 view)
- ✅ View Customer History
- ✅ Update Consent
- ✅ View Support Tickets
- ✅ View Communications
- ✅ View Conversations
- ❌ Cannot create campaigns
- ❌ Cannot export data
- ❌ Cannot view analytics
- ❌ Cannot access governance

**Typical Use Cases**:
- Customer support inquiries
- Consent preference updates
- Communication history review
- Issue resolution
- Customer data verification

**Menu Access**: Customer 360, Conversations, Live Support, Consent (update only)

### Permission Enforcement

Permissions are enforced at **three levels** for maximum security:

**1. Route Level**
- Unauthorized users attempting to access restricted pages are automatically redirected to dashboard
- Uses React Router guards with role checking
- Implemented via `PermissionGuard` component

**2. UI Level**
- Sidebar automatically hides menu items for which user lacks permission
- Dynamic menu filtering based on user role
- Prevents confusion by only showing accessible features

**3. Action Level**
- Buttons and features disabled for unauthorized actions
- Form submissions blocked if user lacks permission
- API calls include permission validation


---

## Customer Management

### Customer 360 View (`/customer-360`)

The Customer 360 view provides a complete, holistic profile of each customer, consolidating data from all touchpoints into a single comprehensive interface.

#### Demographic Information
**What You'll See:**
- Full name with avatar/initials
- Email address (verified status)
- Phone number (formatted)
- Age and gender
- Physical location (city, state, country)
- Account creation date
- Unique customer ID
- Last login timestamp

**Use Cases:**
- Verify customer identity
- Update contact information
- Segment by demographics
- Personalize communications

#### Financial Summary
**Key Metrics:**
- **Lifetime Value (LTV)**: Total revenue generated from customer
- **Account Balance**: Current balance (real-time)
- **Total Transactions**: Count of all transactions
- **Average Transaction Value**: Mean transaction amount
- **Transaction Frequency**: Transactions per period
- **Revenue Contribution**: % of total revenue

**Displayed Format:**
- Currency in Nigerian Naira (₦)
- Formatted with thousand separators
- Color-coded by value (green for high, yellow for medium, red for low)

#### Lifecycle Information
**Current Stage**: One of 6 lifecycle stages with color-coded badge
1. **New** 🟢 - Recently onboarded (< 30 days)
2. **Active** 🔵 - Regularly engaged
3. **Loyal** 🟣 - High-value, consistent
4. **At-Risk** 🟡 - Declining engagement
5. **Churned** 🔴 - Inactive (90+ days)
6. **Reactivated** 🟢 - Successfully won back

**Additional Metrics:**
- Days since last activity
- Engagement level (High/Medium/Low)
- Churn risk score (Low/Medium/High)
- Days in current lifecycle stage
- Historical stage transitions

#### Sentiment Analysis
**Sentiment Score**: 1-10 scale (NPS-style)
- 9-10: Promoters (brand advocates)
- 7-8: Satisfied customers
- 5-6: Neutral/Passive
- 3-4: Dissatisfied
- 0-2: Detractors (high risk)

**Sentiment Bucket**: One of 25 classifications
- Combines Engagement Level (5 tiers) × Product Fit (5 tiers)
- Examples:
  - "Loyal Champion" (Very High Engagement × Perfect Fit)
  - "Satisfied Regular" (High Engagement × Good Fit)
  - "At-Risk Detractor" (Low Engagement × Poor Fit)
  - "Churned Critic" (Very Low Engagement × Very Poor Fit)

**Sentiment Trend**: Historical graph showing score over time
- Identify improving or declining sentiment
- Correlation with lifecycle changes
- Response to campaigns and interventions

#### Transaction History
**Comprehensive Transaction Log:**
- Transaction date and time
- Transaction type (Deposit, Withdrawal, Transfer, Payment, etc.)
- Amount (formatted currency)
- Channel (Online, Mobile, Branch, ATM, POS)
- Status (Completed, Pending, Failed, Reversed)
- Description/Reference
- Running balance

**Features:**
- Sortable by any column
- Filterable by date range, type, channel, status
- Exportable to CSV
- Search by reference number

#### Behavioral Events
**Complete Activity Timeline:**
- Event type (Login, Purchase, Support Contact, Feature Use, etc.)
- Timestamp (precise to the second)
- Channel (Web, Mobile App, Branch, Call Center)
- Event metadata (JSON details)
- User agent (browser/device info)
- IP address (for security)

**Event Categories:**
- Account events (created, updated, verified)
- Transaction events (initiated, completed, failed)
- Support events (ticket created, resolved)
- Marketing events (email opened, clicked, unsubscribed)
- Product events (feature activated, usage tracked)

#### Communication History
**All Messages Sent to Customer:**
- Channel (Email, SMS, WhatsApp, Push, In-App)
- Subject line (for Email/Push)
- Message preview (first 100 characters)
- Send timestamp
- Delivery status (Sent, Delivered, Opened, Clicked, Bounced, Failed)
- Campaign/Journey association
- Template used
- Personalization data applied

**Delivery Metrics:**
- Total messages sent
- Delivery rate (%)
- Open rate (%)
- Click-through rate (%)
- Conversion rate (%)

#### Consent Status
**Channel-by-Channel Consent Matrix:**

**Email Consent:**
- Marketing: ✅ Opted In / ❌ Opted Out
- Transactional: ✅ Opted In / ❌ Opted Out
- Timestamp of last change
- Source of consent (Web, App, Support, Onboarding)

**SMS Consent:**
- Marketing: ✅ Opted In / ❌ Opted Out
- Transactional: ✅ Opted In / ❌ Opted Out
- Timestamp and source

**Push Notification Consent:**
- Marketing: ✅ Opted In / ❌ Opted Out
- Transactional: ✅ Opted In / ❌ Opted Out
- Device registration status
- Timestamp and source

**WhatsApp Consent:**
- Marketing: ✅ Opted In / ❌ Opted Out
- Transactional: ✅ Opted In / ❌ Opted Out
- Phone number verified
- Timestamp and source

**Consent Preferences:**
- Frequency preference (Daily, Weekly, Monthly)
- Topic interests (Savings, Investments, Loans, etc.)
- Quiet hours (Do Not Disturb window: 22:00-08:00)
- Language preference

**Consent History:**
- Complete log of all consent changes
- Who made the change (customer, support agent, system)
- Reason for change (if applicable)
- Previous and new state

#### Journey Participation
**Active Journeys:**
- Journey name and ID
- Entry date and trigger
- Current node/step
- Progress percentage
- Next scheduled action
- Journey status (Running, Paused, Exited)

**Completed Journeys:**
- Journey name
- Start and end dates
- Duration
- Final outcome (Goal Achieved, Exited Early, Failed)
- Conversion status

**Journey Performance for Customer:**
- Engagement rate across journeys
- Conversion rate
- Most effective journey types
- Optimal messaging times

### Customers List (`/customers`)

**Searchable Customer Table:**
- Real-time search across name, email, phone, customer ID
- Autocomplete suggestions as you type
- Fuzzy matching for typos
- Search history

**Sortable Columns:**
- Customer name (A-Z or Z-A)
- Email address
- Lifecycle stage
- Lifetime Value (highest to lowest)
- Churn risk (highest to lowest)
- Last activity (most recent first)

**Filter Options:**
- Lifecycle stage (multi-select)
- Engagement level (multi-select)
- Churn risk (multi-select)
- Sentiment bucket (multi-select)
- Location (multi-select)
- Account balance range (min-max)
- Date range filters

**Bulk Selection:**
- Select all customers on page
- Select all matching filter criteria
- Select specific customers (checkbox)
- Selected count display

**Bulk Actions:**
- Add to existing segment
- Create new segment from selection
- Send immediate message (all channels)
- Schedule future communication
- Export selected to CSV
- Update consent preferences
- Assign to customer success manager

**Table Columns Displayed:**
- Avatar/Initials
- Customer name (clickable to 360 view)
- Email address (with verified badge)
- Phone number (formatted)
- Lifecycle stage (color-coded badge)
- LTV (formatted currency)
- Churn risk indicator (color-coded)
- Last activity (relative time: "2 days ago")
- Actions menu (3-dot dropdown)

**Actions Menu Per Customer:**
- View 360° Profile
- Send Message
- Add to Segment
- Update Consent
- View Communication History
- Schedule Follow-Up
- Assign to Team Member
- Add Note/Tag

**Pagination:**
- 25, 50, 100, or 250 customers per page
- Page number navigation
- Jump to page input
- Total count displayed

**Export Options:**
- Export current page only
- Export all filtered results
- Export selected customers
- Choose columns to include
- Format: CSV or Excel
- Triggers audit log entry
- Requires approval if PII included


---

## Segmentation

### Overview

Segmentation is UC-Edge's most powerful feature, allowing you to divide your customer base into precise, actionable groups. With **13 filter dimensions**, **25 sentiment buckets**, and **dynamic re-evaluation**, you can create highly targeted segments that automatically stay current.

### Segment Types

#### Auto-Generated Segments
System-created segments based on business rules and AI analysis:

**1. High Value At-Risk**
- **Criteria**: At-risk lifecycle stage + LTV > ₦5M
- **Count**: ~45,200 customers
- **Use Case**: VIP retention campaigns, personal outreach
- **Auto-Updates**: Every 60 seconds

**2. Churned Last 30 Days**
- **Criteria**: Churned lifecycle + Days since churn ≤ 30
- **Count**: ~23,800 customers
- **Use Case**: Win-back campaigns, special offers
- **Auto-Updates**: Daily

**3. Loyal Champions**
- **Criteria**: Very High Engagement × Perfect Fit sentiment bucket
- **Count**: ~67,500 customers
- **Use Case**: Advocacy programs, referrals, testimonials
- **Auto-Updates**: Every 60 seconds

**4. Growth Opportunities**
- **Criteria**: Medium Engagement + High LTV + Good Product Fit
- **Count**: ~89,200 customers
- **Use Case**: Upsell, cross-sell, premium features
- **Auto-Updates**: Every 60 seconds

#### Custom Segments
User-created segments with any combination of filters.

### Segment Builder (`/segments/builder`)

**4-Tab Interface** for comprehensive segmentation:

#### Tab 1: Lifecycle Filters

**Lifecycle Stages** (Multi-Select):
- ☐ **New**: Recently onboarded (< 30 days)
  - Characteristics: Low transaction count, high onboarding engagement
  - Typical Size: ~250,000 customers
  - Best Use: Welcome series, onboarding journeys, education campaigns

- ☐ **Active**: Regular engagement with platform
  - Characteristics: Consistent logins, multiple transactions, feature usage
  - Typical Size: ~850,000 customers
  - Best Use: Upsell, cross-sell, engagement campaigns

- ☐ **Loyal**: High-value, long-term customers
  - Characteristics: LTV > ₦2M, tenure > 1 year, high satisfaction
  - Typical Size: ~425,000 customers
  - Best Use: VIP programs, loyalty rewards, advocacy

- ☐ **At-Risk**: Declining engagement patterns
  - Characteristics: Reduced login frequency, lower transactions, sentiment drop
  - Typical Size: ~212,500 customers
  - Best Use: Retention campaigns, special offers, re-engagement

- ☐ **Churned**: No activity for 90+ days
  - Characteristics: Zero logins, no transactions, inactive
  - Typical Size: ~170,000 customers
  - Best Use: Win-back campaigns, surveys, incentives

- ☐ **Reactivated**: Previously churned, now active again
  - Characteristics: Recent return after churn period, renewed engagement
  - Typical Size: ~42,500 customers
  - Best Use: Nurture campaigns, loyalty building, feedback collection

**Additional Lifecycle Filters:**

**Minimum Lifetime Value (₦)**
- Input: Number field
- Range: 0 to 50,000,000
- Examples:
  - 500,000: Target mid-value customers
  - 5,000,000: Target high-value VIPs
  - 10,000,000: Target ultra-high-net-worth

**Maximum Days Inactive**
- Input: Number field
- Range: 0 to 365
- Examples:
  - 7: Recently active only
  - 30: Active within last month
  - 90: Before churn threshold

**Live Preview Updates**:
- Customer count updates as you select/deselect
- Metrics recalculate instantly
- Visual feedback on segment size

#### Tab 2: Demographics Filters

**Age Range**:
- **Minimum Age**: Number input (18-100)
- **Maximum Age**: Number input (18-100)
- Examples:
  - 25-35: Young professionals
  - 35-50: Established professionals
  - 50-65: Pre-retirement planning
  - 65+: Retirement focus

**Gender** (Multi-Select):
- ☐ Male
- ☐ Female
- Use Cases:
  - Product-specific targeting
  - Message tone adjustment
  - Gender-balanced testing

**Location** (Multi-Select):
- ☐ **Lagos**: Nigeria's commercial capital, ~850,000 customers
  - High-value segment, urban sophistication
  - Best for: Premium products, digital services

- ☐ **Abuja**: Federal capital territory, ~425,000 customers
  - Government employees, stable income
  - Best for: Savings products, long-term investments

- ☐ **Port Harcourt**: Oil industry hub, ~340,000 customers
  - High disposable income, business-focused
  - Best for: Business accounts, investment products

- ☐ **Ibadan**: Historic city, ~255,000 customers
  - Growing middle class, education focus
  - Best for: Educational savings, family products

**Combined Demographics Example**:
- Age 30-45 + Lagos + Male = Young urban professionals in Lagos
- Age 50+ + Abuja = Pre-retirement government workers
- Female + Age 25-35 + Port Harcourt = Young professional women in oil industry

#### Tab 3: Behavior Filters

**Engagement Level** (Multi-Select):
- ☐ **High**: Login 5+ times/week, active feature usage, frequent transactions
  - Characteristics: Power users, highly engaged, responsive to communications
  - Typical Size: ~425,000 customers
  - Response Rate: 35-45%

- ☐ **Medium**: Login 1-4 times/week, moderate usage
  - Characteristics: Regular but not power users, selective engagement
  - Typical Size: ~850,000 customers
  - Response Rate: 20-30%

- ☐ **Low**: Login < 1 time/week, minimal usage
  - Characteristics: Passive users, low engagement, potential churn risk
  - Typical Size: ~850,000 customers
  - Response Rate: 5-15%

**Churn Risk** (Multi-Select):
- ☐ **Low** (0-30% probability): Stable customers, consistent engagement
  - Characteristics: Regular activity, growing LTV, positive sentiment
  - Typical Size: ~1,062,500 customers
  - Action: Maintain engagement, upsell opportunities

- ☐ **Medium** (30-70% probability): Warning signs present
  - Characteristics: Declining activity, sentiment dip, reduced transactions
  - Typical Size: ~637,500 customers
  - Action: Re-engagement campaigns, value reinforcement

- ☐ **High** (70-100% probability): Imminent churn risk
  - Characteristics: Minimal activity, negative sentiment, support issues
  - Typical Size: ~425,000 customers
  - Action: Urgent retention, special offers, personal outreach

**Sentiment Score Range**:
- **Minimum Sentiment Score**: Number input (1-10)
- **Maximum Sentiment Score**: Number input (1-10)
- Examples:
  - 9-10: Promoters only (brand advocates)
  - 7-10: Satisfied and promoters
  - 5-6: Passive/neutral customers
  - 1-4: Detractors (need intervention)

**Behavioral Patterns**:
- Combine engagement + churn risk + sentiment for precise targeting
- Example: High Engagement + Low Churn Risk + Score 9-10 = Ideal advocates
- Example: Low Engagement + High Churn Risk + Score 1-4 = Crisis intervention needed

#### Tab 4: Sentiment (AI-Powered)

**The 25 Sentiment Bucket Matrix**

This revolutionary classification system combines two dimensions:

**Dimension 1: Engagement Level** (5 tiers)
1. Very High Engagement
2. High Engagement
3. Medium Engagement
4. Low Engagement
5. Very Low Engagement

**Dimension 2: Product Fit** (5 tiers)
1. Perfect Fit
2. Good Fit
3. Moderate Fit
4. Poor Fit
5. Very Poor Fit

**The 25 Buckets** (5 × 5 matrix):

**Perfect Fit Column** (Product perfectly matches customer needs):
1. **Loyal Champion** (Very High × Perfect) - Your best customers
   - Count: ~42,500 customers
   - Characteristics: Maximum engagement, perfect product match, high satisfaction
   - Actions: VIP treatment, advocacy programs, case studies, referrals
   - Communication: Exclusive updates, early access, appreciation

2. **Engaged Advocate** (High × Perfect)
   - Count: ~85,000 customers
   - Characteristics: Strong engagement, ideal product fit
   - Actions: Upsell premium features, community building
   - Communication: Value reinforcement, feature education

3. **Satisfied User** (Medium × Perfect)
   - Count: ~127,500 customers
   - Characteristics: Regular usage, good fit, content but not enthusiastic
   - Actions: Increase engagement, showcase value
   - Communication: Tips & tricks, success stories

4. **Passive Fit** (Low × Perfect)
   - Count: ~85,000 customers
   - Characteristics: Low engagement despite perfect fit
   - Actions: Re-engagement, identify barriers
   - Communication: "We miss you", value reminders

5. **Dormant Perfect Match** (Very Low × Perfect)
   - Count: ~42,500 customers
   - Characteristics: Minimal activity but product is perfect for them
   - Actions: Win-back, remove obstacles
   - Communication: Special offers, "Come back" campaigns

**Good Fit Column** (Product is a good match):
6. **Active Supporter** (Very High × Good)
   - Count: ~85,000 customers
   - Actions: Upgrade to perfect fit products, testimonials

7. **Engaged Customer** (High × Good)
   - Count: ~170,000 customers
   - Actions: Maintain satisfaction, cross-sell

8. **Regular User** (Medium × Good)
   - Count: ~255,000 customers
   - Actions: Increase engagement frequency

9. **Casual User** (Low × Good)
   - Count: ~170,000 customers
   - Actions: Boost engagement, show value

10. **Inactive Good Match** (Very Low × Good)
    - Count: ~85,000 customers
    - Actions: Reactivation campaigns

**Moderate Fit Column** (Product partially meets needs):
11. **Highly Engaged Moderate** (Very High × Moderate)
    - Count: ~127,500 customers
    - Actions: Improve product fit, gather feedback

12. **Active Moderate** (High × Moderate)
    - Count: ~255,000 customers
    - Actions: Optimize product offering

13. **Standard User** (Medium × Moderate)
    - Count: ~382,500 customers
    - Actions: Enhance value proposition

14. **Low Activity Moderate** (Low × Moderate)
    - Count: ~255,000 customers
    - Actions: Reduce friction, improve fit

15. **Dormant Moderate** (Very Low × Moderate)
    - Count: ~127,500 customers
    - Actions: Reassess needs, targeted offers

**Poor Fit Column** (Product doesn't match well):
16. **Engaged Despite Poor Fit** (Very High × Poor)
    - Count: ~85,000 customers
    - Actions: Why are they staying? Product improvement opportunity

17. **Active Poor Fit** (High × Poor)
    - Count: ~170,000 customers
    - Actions: Alternative products, custom solutions

18. **Struggling User** (Medium × Poor)
    - Count: ~255,000 customers
    - Actions: Support, education, product adjustment

19. **At-Risk Poor Fit** (Low × Poor)
    - Count: ~170,000 customers
    - Actions: Urgent intervention, product pivot

20. **Disengaged Poor Match** (Very Low × Poor)
    - Count: ~85,000 customers
    - Actions: Offboarding support, exit surveys

**Very Poor Fit Column** (Significant product mismatch):
21. **Engaged Mismatch** (Very High × Very Poor)
    - Count: ~42,500 customers
    - Actions: Critical review - why staying? Opportunity to fix product

22. **Active Dissatisfied** (High × Very Poor)
    - Count: ~85,000 customers
    - Actions: Urgent product review, alternatives

23. **Frustrated User** (Medium × Very Poor)
    - Count: ~127,500 customers
    - Actions: Major intervention needed

24. **At-Risk Detractor** (Low × Very Poor)
    - Count: ~85,000 customers
    - Actions: Damage control, prevent negative reviews

25. **Churned Critic** (Very Low × Very Poor)
    - Count: ~42,500 customers
    - Actions: Exit interviews, product lessons, reputation management

**Using the Sentiment Bucket Selector:**
- Click any bucket to select it
- Multi-select supported (Ctrl/Cmd + Click)
- Visual highlighting of selected buckets
- Live customer count update
- Color-coded by risk level (green → yellow → red)

**Strategic Bucket Combinations:**
- **Advocacy Program**: Buckets 1, 2, 6 (top left quadrant)
- **Retention Risk**: Buckets 19, 20, 24, 25 (bottom right quadrant)
- **Growth Opportunity**: Buckets 3, 7, 11 (high engagement, improvable fit)
- **Churn Prevention**: Buckets 4, 5, 9, 10, 14, 15, 19, 20, 24, 25

### Live Preview Panel

As you select filters across all tabs, the Live Preview panel (sticky on right side) shows real-time metrics:

**Customer Count Display**:
- Large prominent number
- Updates instantly as filters change
- Formatted with thousand separators
- Icon: Users group icon

**Total LTV**:
- Aggregate lifetime value of segment
- Formatted as ₦X.XM (millions)
- Helps assess segment value

**Average LTV**:
- Mean LTV per customer in segment
- Formatted as ₦XXXk (thousands)
- Identifies high-value segments

**Churn Rate**:
- Percentage of segment at high churn risk
- Color-coded: Green (< 20%), Yellow (20-40%), Red (> 40%)
- Helps prioritize retention efforts

**Save Segment Button**:
- Prominent call-to-action
- Disabled if no filters selected or no name entered
- Enabled only when valid segment defined

### Segment Criteria Validation

**Required Fields**:
- Segment name (minimum 3 characters)
- At least ONE filter selected across any tab

**Validation Messages**:
- "Name required" - No segment name provided
- "Criteria required" - No filters selected
- "Segment already exists" - Duplicate name
- "Invalid filter value" - Incorrect number format

### Dynamic Re-Evaluation

**How It Works**:
1. Segment criteria stored in database
2. Every 60 seconds, all segments re-evaluated
3. Customer membership recalculated based on current data
4. Metrics updated (count, LTV, churn rate)
5. Timestamp updated on segment

**Benefits**:
- Segments stay current automatically
- No manual refresh needed
- Campaign audiences always up-to-date
- Journey triggers fire on latest data

**Performance**:
- Re-evaluation runs in background
- No impact on user experience
- Optimized queries for speed
- Indexes on all filter fields

### Segment Management (`/segments`)

**Segment List View**:
- Grid of segment cards
- Sort by: Name, Size, LTV, Last Updated, Created Date
- Filter by: Type (Auto vs Custom), Size range, Created by

**Each Segment Card Shows**:
- Segment name (bold, clickable)
- Description (2 lines max, truncated)
- Customer count with trend indicator (↑↓→)
- Total LTV (formatted)
- Churn rate percentage (color-coded)
- Last updated timestamp (relative: "2 hours ago")
- Created by user
- Auto-generated badge (if applicable)
- Actions menu (3-dot)

**Segment Card Actions**:
- **View Details**: See full criteria and customer list
- **Edit**: Modify segment filters (custom only)
- **Duplicate**: Create copy with new name
- **Create Campaign**: Jump to campaign wizard with this audience
- **Download List**: Export customer IDs to CSV
- **View Analytics**: Segment performance over time
- **Delete**: Remove segment (requires confirmation)

**Bulk Segment Actions**:
- Select multiple segments (checkbox)
- **Union**: Create new segment with customers from ANY selected
- **Intersection**: Create segment with customers in ALL selected
- **Export Combined**: Download unified customer list
- **Compare**: Side-by-side segment comparison
- **Merge**: Combine into single segment

### Segment Performance Tracking

**Metrics Tracked Over Time**:
- Customer count trend
- LTV trend
- Churn rate trend
- Engagement level distribution
- Sentiment score distribution
- Campaign response rates
- Journey completion rates

**Visualization**:
- Line charts for trends
- Bar charts for distributions
- Comparison to platform average
- Benchmark against similar segments


---

## Campaign Management

### Campaign Overview (`/campaigns`)

Central hub for all marketing campaign activities.

**Campaign Dashboard Features**:
- List view and card view toggle
- Filter by status, channel, date range, created by
- Search by campaign name
- Sort by creation date, start date, performance metrics

**Campaign States**:
- **Draft** (Gray): Being created, not yet scheduled
- **Scheduled** (Blue): Queued for future execution
- **Running** (Green): Currently active and sending
- **Completed** (Gray): Finished execution
- **Paused** (Yellow): Temporarily stopped, can resume
- **Failed** (Red): Execution error occurred

**Campaign Performance Metrics**:
- **Sent**: Total messages sent
- **Delivered**: Successfully delivered (%)
- **Opened**: Email/Push opens (%)
- **Clicked**: Link clicks (%)
- **Converted**: Desired action taken (%)
- **ROI**: Return on investment calculation

### Campaign Wizard (`/campaigns/new`)

4-step guided campaign creation process.

#### Step 1: Campaign Details

**Basic Information**:
**Campaign Name*** (Required):
- Internal reference name
- Best practice: Descriptive + Date (e.g., "Q1 Savings Promo - Feb 2026")
- Character limit: 100

**Campaign Objective*** (Required):
- 🎯 **Awareness**: Build brand awareness, introduce new products
- 💰 **Conversion**: Drive sales, sign-ups, account openings
- 🔄 **Retention**: Keep customers engaged, prevent churn
- 🔙 **Reactivation**: Win back churned customers
- ❤️ **Loyalty**: Reward and retain best customers

**Description** (Optional):
- Campaign purpose and goals
- Internal notes for team
- Success criteria
- Character limit: 500

**Campaign Dates**:
- **Start Date/Time**: When campaign begins
- **End Date/Time**: When campaign concludes (optional for ongoing)
- **Time Zone**: WAT (West Africa Time) default

#### Step 2: Audience Selection

**Select Target Segment**:
- Dropdown list of all segments
- Shows customer count per segment
- Filter segments by type, size, tags
- Preview segment criteria

**OR Create Quick Segment**:
- Inline segment builder
- Simplified filters
- Save for reuse or use once

**Audience Preview**:
- Total potential reach
- By channel availability:
  - Email-reachable: Count + percentage
  - SMS-reachable: Count + percentage
  - WhatsApp-reachable: Count + percentage
  - Push-enabled: Count + percentage
- Consent status breakdown
- Estimated delivery based on historical rates

**Exclusions** (Advanced):
- Exclude customers who received message in last X days
- Exclude customers in other active campaigns
- Exclude specific segments
- Exclude by customer list upload

#### Step 3: Content & Channels

**Channel Selection** (Multi-Select):
- ☐ Email
- ☐ SMS  
- ☐ WhatsApp
- ☐ Push Notification
- ☐ In-App Message

**Email Configuration**:

**Subject Line*** (Required):
- Maximum 100 characters
- Personalization supported: {{firstName}}, {{lastName}}, {{name}}
- Preview text (optional): 150 characters
- Emoji support ✅

**Email Body***:
- Rich text editor with formatting
- **Insert Personalization** button opens variable picker
- Available variables displayed
- HTML view for advanced users
- Mobile preview
- Desktop preview

**Personalization Example**:
```
Subject: {{firstName}}, Special Offer for {{location}} Customers!

Hi {{firstName}},

We've noticed you're one of our valued customers in {{location}}.
Your current account balance of {{accountBalance}} qualifies you for
our exclusive {{offer}}.

Don't miss out on this limited-time opportunity!

Best regards,
The United Capital Team
```

**SMS Configuration**:

**Message Body*** (Required):
- Plain text only
- 160 character limit (1 SMS)
- 306 characters (2 SMS)
- Character counter updates in real-time
- Personalization supported
- Unicode support (emojis count as more characters)
- Link shortening automatic

**Personalization Example**:
```
Hi {{firstName}}! Your {{accountBalance}} balance earns you 0% fees
for 3 months. Activate now: [shortlink]
```

**WhatsApp Configuration**:

**Template Selection*** (Required):
- Choose from pre-approved templates only
- Template preview with placeholders
- Parameter mapping interface
- Cannot use free-form text (WhatsApp Business API requirement)

**Parameters**:
- Map {{1}}, {{2}}, {{3}} etc. to customer data
- Preview with sample customer
- Validation before send

**Media Attachment** (Optional):
- Image (JPG, PNG up to 5MB)
- PDF (up to 100MB)
- Video (up to 16MB)

**Quick Replies** (Optional):
- Button 1: Text + action
- Button 2: Text + action
- Button 3: Text + action

**Push Notification Configuration**:

**Title*** (Required):
- Maximum 65 characters
- Personalization supported
- Appears bold in notification

**Body*** (Required):
- Maximum 240 characters
- Personalization supported
- Main notification text

**Click Action**:
- Open URL
- Open app (deep link)
- Custom action

**Rich Media** (Optional):
- Icon URL (192x192px)
- Image URL (1024x512px)
- Badge count increment

**In-App Message Configuration**:

**Display Trigger**:
- App open
- Specific feature access
- After X seconds idle
- On button click
- Custom event

**Position**:
- Top banner (dismissible)
- Center modal (requires action)
- Bottom sheet (slide up)
- Fullscreen (takeover)

**Message Content**:
- Title (required)
- Body text (required)
- Primary CTA (required)
- Secondary CTA (optional)
- Image (optional)

**Personalization Engine in Detail**:

**Available Variables** (11 built-in):
1. `{{name}}` - Full customer name (e.g., "Adewale Ogunleye")
2. `{{firstName}}` - First name only (e.g., "Adewale")
3. `{{lastName}}` - Last name only (e.g., "Ogunleye")
4. `{{email}}` - Email address
5. `{{phone}}` - Phone number
6. `{{balance}}` - Account balance as number (150000)
7. `{{accountBalance}}` - Formatted balance (₦150,000)
8. `{{lifetimeValue}}` - Formatted LTV (₦5,000,000)
9. `{{location}}` - Customer location (Lagos, Nigeria)
10. `{{product}}` - Custom product name
11. `{{offer}}` - Custom offer details

**Custom Variables**:
- Add unlimited custom key-value pairs
- Example: `{{offerCode}}` = "SAVE2026"
- Example: `{{expiryDate}}` = "March 31, 2026"
- Stored in campaign configuration
- Applied at send time per customer

**Variable Insertion**:
- Click "Insert Variable" button
- Select from dropdown list
- Variable inserted at cursor position
- Syntax validated on save

**Preview with Real Customer**:
- Select sample customer from segment
- See rendered message with their data
- Test all channels
- Validate personalization

#### Step 4: Schedule & Launch

**Send Options**:

**Send Immediately**:
- Starts sending within 1 minute
- Processes audience in batches
- Rate limiting applied automatically

**Schedule for Later**:
- Date picker + time picker
- Time zone confirmation
- Schedule limit: 90 days in future

**Recurring Campaign**:
- **Daily**: Every day at specified time
  - Choose time (e.g., 10:00 AM)
  - Duration: 7, 14, 30, 60, 90 days or ongoing

- **Weekly**: Specific day(s) of week
  - Select day(s): Mon, Tue, Wed, Thu, Fri, Sat, Sun
  - Choose time
  - Duration options

- **Monthly**: Specific day of month
  - Day 1-31 (or last day of month)
  - Choose time
  - Duration options

**Approval Workflow**:
- Toggle "Requires Approval"
- If ON: Campaign goes to approval queue
- Notification sent to approvers
- Cannot launch until approved

**Testing Options**:
- **Test Send**: Send to test segment first
- Define test segment (10-100 customers)
- Review performance before full launch
- A/B test variants (Pro feature)

**Budget & Limits** (Optional):
- Maximum spend cap
- Maximum recipients per day
- Stop if delivery rate < X%
- Pause if unsubscribe rate > Y%

**Final Review Screen**:
- Summary of all settings
- Audience size
- Content preview (all channels)
- Schedule confirmation
- Estimated cost
- Compliance checks status

**Launch Button**:
- Final confirmation modal
- "Are you sure?" safety check
- Activity logged
- Campaign ID generated
- Real-time status updates

### Campaign Execution & Monitoring

**Live Dashboard During Execution**:
- Messages sent (real-time counter)
- Current send rate (messages/second)
- Delivery rate percentage
- Open rate (for Email/Push)
- Click rate
- Error rate
- Estimated completion time

**Pause/Resume Controls**:
- Pause button stops all sending
- Resume continues from where paused
- Edit capability while paused
- Activity logged

**Real-Time Alerts**:
- High bounce rate (> 5%)
- High unsubscribe rate (> 1%)
- Low delivery rate (< 90%)
- Technical errors
- Budget limit reached

**Post-Campaign Reporting**:
- Final performance metrics
- By channel breakdown
- Segment performance analysis
- Top performing content elements
- Recommendations for next campaign
- Export full report (PDF/Excel)

---

## Journey Orchestration

### Journey Builder (`/journeys`)

Visual canvas for creating automated, multi-step customer journeys that respond to triggers and customer behavior.

**Canvas Interface**:
- Infinite canvas (pan and zoom)
- Grid snapping for alignment
- Node palette on left
- Configuration panel on right
- Minimap in bottom-right corner
- Toolbar at top (Save, Publish, Test, Undo, Redo)

**Journey States**:
- **Draft**: Being built, cannot execute
- **Active**: Published and processing customers
- **Paused**: Temporarily stopped, customers frozen in place
- **Archived**: Historical, no longer active

### Journey Components (6 Node Types)

#### 1. Trigger Node (Entry Point)
**Every journey starts with exactly ONE trigger node.**

**Trigger Type: Event-Based**
- Customer performs specific action
- Configuration:
  - **Event Type**: Enter event name (e.g., "account_created", "transaction_completed")
  - Event source: Web, App, API, Batch import
  - Event parameters (optional): Filter specific events
- Examples:
  - Account created → Welcome series
  - Large deposit → Investment opportunity
  - Support ticket → Follow-up sequence

**Trigger Type: Segment Entry**
- Customer enters a specific segment
- Configuration:
  - **Segment ID**: Select from dropdown or enter ID
  - Entry condition: Immediate or delayed
  - Re-entry allowed: Yes/No (prevent duplicate journeys)
- Examples:
  - Enters "At-Risk" segment → Retention journey
  - Enters "High-Value" segment → VIP onboarding
  - Enters "Churned" segment → Win-back series

**Trigger Type: Scheduled**
- Time-based execution with powerful recurring options

**Frequency: Once**
- Single execution at specified date/time
- Configuration:
  - Date picker
  - Time picker (24-hour format)
  - Time zone: WAT
- Use case: Product launch, one-time announcement

**Frequency: Daily**
- Executes every day at specified time
- Configuration:
  - **Time**: Select execution time (e.g., 09:00)
  - Start date (optional)
  - End date (optional)
- Use case: Daily digest, daily tip, daily offer
- Example: Daily savings tip at 9 AM

**Frequency: Weekly**
- Executes on specific day(s) of week
- Configuration:
  - **Time**: Execution time
  - **Day of Week**: Dropdown selection
    - Monday (value: 1)
    - Tuesday (value: 2)
    - Wednesday (value: 3)
    - Thursday (value: 4)
    - Friday (value: 5)
    - Saturday (value: 6)
    - Sunday (value: 0)
  - Start/end dates
- Use case: Weekly newsletter, weekly check-in
- Example: Monday motivation at 8 AM

**Frequency: Monthly**
- Executes on specific day of month
- Configuration:
  - **Time**: Execution time
  - **Day of Month**: Number input (1-31)
    - If month has fewer days, executes last day
    - Example: Day 31 in February = Feb 28/29
  - Start/end dates
- Use case: Monthly statement, monthly review
- Example: Account summary on 1st of month at 10 AM

**Trigger Type: Manual**
- Manually trigger for specific customers
- Configuration:
  - Customer selection method (Upload list, Select from segment, Individual)
  - Execute immediately or schedule
- Use case: Ad-hoc campaigns, testing, VIP outreach

#### 2. Action Node (Communication)
**Sends message through selected channel.**

**Channel Selection**:
- Email
- SMS
- WhatsApp
- Push Notification
- In-App Message

**Message Configuration**:

**Subject** (for Email/Push):
- Text input
- Personalization supported
- Character limit by channel

**Message Body**:
- Multi-line textarea
- Personalization via {{variable}} syntax
- Placeholder text guides user
- Example: "Enter message content... Use {{variableName}} for personalization"

**Personalization Panel**:

**View Available Variables**:
- Click info icon (ℹ️)
- Popover displays:
  - 5 most common variables with descriptions
  - `{{name}}` - Full customer name
  - `{{firstName}}` - First name only
  - `{{email}}` - Email address
  - `{{accountBalance}}` - Formatted balance
  - `{{location}}` - Customer location
- Note at bottom: "Add custom variables below to pass additional data."

**Current Personalization Variables**:
- List of key-value pairs
- Each displayed as card:
  - Variable name as code `{{key}}`
  - Value preview (truncated to 100 chars)
  - Delete button (trash icon)
- Empty state if none added

**Add Custom Variable**:
- Two input fields side-by-side:
  - **Key**: Variable name (no spaces, alphanumeric)
  - **Value**: Default value or placeholder
- Plus button (+) to add
- Disabled if either field empty
- Validation:
  - Key must not contain spaces
  - Key must be unique
  - Value required

**Example Custom Variables**:
- Key: "offerCode", Value: "WELCOME2026"
- Key: "expiryDate", Value: "March 31, 2026"
- Key: "product", Value: "Investment Plan"
- Key: "rate", Value: "0% fees"

**Rendered Message Example**:
```
Hi {{firstName}},

Your {{accountBalance}} qualifies you for our {{product}}
with {{rate}} until {{expiryDate}}.

Use code {{offerCode}} to activate.

Regards,
United Capital
```

Becomes:
```
Hi Adewale,

Your ₦2,500,000 qualifies you for our Investment Plan
with 0% fees until March 31, 2026.

Use code WELCOME2026 to activate.

Regards,
United Capital
```

**Requires Approval Toggle**:
- Switch ON/OFF
- If ON: Action needs approval before sending
- Approvers notified when customer reaches this node
- Customer waits at node until approved

**Delete Personalization Variable**:
- Click trash icon on variable card
- Immediate removal
- No confirmation (can undo via journey undo)

#### 3. Wait Node (Delay)
**Pauses journey for specified duration.**

**Duration Options** (Dropdown):
- 1 Hour
- 6 Hours
- 12 Hours
- 24 Hours (1 Day)
- 48 Hours (2 Days)
- 72 Hours (3 Days)
- 168 Hours (7 Days)

**Behavior**:
- Customer frozen at this node for duration
- Clock starts when customer enters node
- After duration, automatically proceeds to next node
- Pause/resume journey does NOT affect wait timers

**Use Cases**:
- **Wait for customer action**: Give time to respond before next step
- **Delay between messages**: Don't spam with back-to-back messages
- **Time-based branching**: Different paths based on wait behavior
- **Cool-down periods**: Space out campaign touches

**Best Practices**:
- Wait 24-48 hours after promotional message
- Wait 72 hours before follow-up if no response
- Wait 1 week after onboarding email series
- Don't exceed 7 days without customer value

#### 4. Condition Node (Decision)
**Routes customers based on criteria (if-then-else logic).**

**Field Configuration**:
- **Field**: Customer property to check
- Text input, dot notation supported
- Examples:
  - `customer.balance`
  - `customer.age`
  - `customer.lifecycleStage`
  - `customer.engagementLevel`
  - `customer.sentimentScore`

**Operator Selection** (Dropdown):
- **Equals**: Exact match
- **Not Equals**: Does not match
- **Greater Than**: Numeric comparison (>)
- **Less Than**: Numeric comparison (<)
- **Contains**: String contains substring

**Value**:
- Text/number input
- Type matches field type
- Examples:
  - For balance: `1000000`
  - For stage: `at-risk`
  - For location: `Lagos`

**Output Paths**:
- **True** (green handle): Condition is met
- **False** (red handle): Condition not met
- Both paths must connect to next nodes
- Journey cannot be published if paths unconnected

**Example Conditions**:

**Balance-Based Routing**:
```
Field: customer.balance
Operator: Greater Than
Value: 1000000
```
- True → High-value offer
- False → Standard offer

**Engagement-Based**:
```
Field: customer.engagementLevel
Operator: Equals
Value: high
```
- True → Power user tips
- False → Basic education

**Location-Based**:
```
Field: customer.location
Operator: Contains
Value: Lagos
```
- True → Lagos-specific offer
- False → General offer

**Churn Risk**:
```
Field: customer.churnRisk
Operator: Equals
Value: high
```
- True → Urgent retention
- False → Continue normal journey

#### 5. Split Node (A/B Testing)
**Divides audience for experimentation.**

**Split Type: A/B Test**
- 50/50 split automatically
- Two output paths (A and B)
- Random assignment ensures fairness
- Track performance of each variant

**Split Type: Multi-Branch**
- Custom percentage splits
- 3+ output paths
- Define percentage per branch (must total 100%)
- Examples:
  - 33% / 33% / 34% (3-way)
  - 25% / 25% / 25% / 25% (4-way)
  - 70% / 30% (Control vs Test)

**Use Cases**:
- **Message Testing**: Two subject lines, see which performs better
- **Offer Testing**: Different incentive amounts
- **Timing Testing**: Send immediately vs wait 24 hours
- **Channel Testing**: Email vs SMS vs WhatsApp
- **Content Testing**: Long-form vs short-form

**Performance Tracking**:
- Conversion rate per branch
- Engagement rate per branch
- Statistical significance calculator
- Winner declaration after minimum sample size

#### 6. End Node (Exit)
**Terminates the journey for customer.**

**End Types**:
- **Goal Achieved**: Customer completed desired action
- **Journey Complete**: Reached natural end
- **Exit Criteria Met**: Condition triggered exit
- **Manual Exit**: User removed from journey

**End Node Configuration**:
- Label (optional): Describe why journey ends here
- Track as conversion: Yes/No
- Trigger post-journey action (optional):
  - Add to segment
  - Send survey
  - Update customer attribute

**Multiple End Nodes**:
- Journey can have multiple end points
- Track which end node customers reach
- Analyze journey paths taken

### Canvas Operations

**Adding Nodes**:
1. Click node type in left palette (Trigger, Action, Wait, Condition, Split, End)
2. Click canvas where you want to place it
3. Node appears at click position
4. Automatically selected for configuration

**Connecting Nodes**:
1. Hover over source node to reveal output handle
2. Click and drag from output handle
3. Drag to target node's input handle
4. Release to create edge (connection)
5. Edge validates connection rules (no cycles, type compatibility)

**Configuring Nodes**:
1. Click node to select (highlighted border)
2. Right panel shows configuration options
3. Edit fields as needed
4. Changes save automatically
5. Validation messages appear if configuration invalid

**Moving Nodes**:
- Click and drag node to reposition
- Edges stay connected and redraw automatically
- Grid snapping for neat alignment
- Multi-select nodes (Shift + Click) to move together

**Deleting Nodes**:
1. Select node
2. Configuration panel shows "Delete Node" button at bottom
3. Click to delete
4. Confirmation modal: "Are you sure?"
5. Connected edges removed automatically
6. Undo available (Ctrl/Cmd + Z)

**Deleting Edges**:
- Select edge (click on it)
- Press Delete key or click delete icon
- Edge removed, nodes remain

**Canvas Navigation**:
- **Pan**: Click and drag empty canvas space
- **Zoom**: Mouse wheel or pinch gesture
- **Fit to Screen**: Button in toolbar
- **Minimap**: Bottom-right shows full journey overview

### Journey Validation

**Required Rules Before Publishing**:
- ✅ Exactly ONE trigger node
- ✅ At least ONE action node
- ✅ At least ONE end node
- ✅ All nodes connected (no orphans)
- ✅ All required fields filled
- ✅ Valid personalization syntax
- ✅ All condition paths connected
- ✅ No infinite loops

**Validation Warnings** (non-blocking):
- ⚠️ Wait duration seems very long (> 7 days)
- ⚠️ Many customers may reach this path (> 90%)
- ⚠️ Few customers may reach this path (< 1%)
- ⚠️ Similar journey already exists
- ⚠️ High estimated cost

**Save vs Publish**:
- **Save**: Stores draft, does not execute
- **Publish**: Validates and makes journey active
- Published journeys can be paused/resumed
- Cannot edit published journey (must pause first)

### Journey Analytics

**Journey Performance Dashboard**:
- **Entered**: Total customers who started journey
- **In Progress**: Currently active in journey
- **Completed**: Reached end node
- **Exited Early**: Left before completion
- **Conversion Rate**: (Completed with goal) / Entered
- **Average Duration**: Mean time from start to end
- **Drop-off Points**: Where customers exit most

**Node-Level Analytics**:
- Click any node to see stats
- **Entered**: Customers who reached this node
- **Exited**: Customers who left journey at this node
- **Conversion**: % who proceeded to next node
- **Average Time at Node**: For wait nodes

**Path Analysis**:
- Visual heat map of popular paths
- Edge thickness shows traffic volume
- Identify most common routes
- Detect unexpected paths

**Performance Over Time**:
- Daily entry count
- Completion rate trends
- Conversion rate by cohort
- Channel performance (if using split testing)


---

## AI & Automation

### AI Agents (`/ai-agents`)

UC-Edge includes 5 pre-configured AI agents that automate complex tasks and provide intelligent recommendations.

#### 1. Churn Prevention Agent

**Function**: Identifies customers at risk of churning and triggers automatic interventions.

**Prediction Model**:
- Machine learning model trained on historical churn data
- Analyzes 47 customer attributes
- Predicts 14-day, 30-day, and 90-day churn probability
- Updated daily with latest customer behavior

**Trigger Conditions**:
- Churn risk score > 70%
- Sudden sentiment drop (> 3 points in 7 days)
- Activity decline (50% reduction in 30 days)
- Support ticket with negative sentiment
- Account balance withdrawal > 80%

**Automated Actions**:
1. **Segment Creation**: Auto-creates "At-Risk - [Date]" segment
2. **Alert Generation**: Notifies account managers
3. **Campaign Trigger**: Launches retention campaign
4. **Journey Entry**: Adds customers to retention journey
5. **Audit Logging**: Records all actions taken

**Agent Configuration**:
- Set risk threshold (50-90%)
- Choose intervention type (campaign, journey, alert)
- Define cooldown period (days between interventions)
- Enable/disable auto-execution
- Set notification recipients

**Performance Metrics**:
- Customers identified: Count per day
- Interventions triggered: Automatic actions
- Success rate: % prevented from churning
- False positive rate: % who didn't churn anyway
- Model accuracy: Precision and recall

#### 2. Sentiment Analysis Agent

**Function**: Analyzes all customer feedback and assigns sentiment scores and buckets.

**Data Sources**:
- Support tickets (text analysis)
- Survey responses (NPS, CSAT)
- App store reviews
- Social media mentions
- Email replies
- Chat transcripts
- Call center notes

**Analysis Process**:
1. **Text Extraction**: Pull text from all sources
2. **NLP Processing**: Tokenization, entity extraction
3. **Sentiment Scoring**: -1 to +1 scale (converted to 1-10)
4. **Bucket Classification**: Engagement × Product Fit matrix
5. **Trend Detection**: Compare to historical scores
6. **Anomaly Detection**: Flag sudden changes

**Output**:
- Sentiment score (1-10) per customer
- Sentiment bucket (1 of 25) per customer
- Confidence score (how certain the model is)
- Key topics mentioned (positive and negative)
- Recommended actions

**Trigger Actions**:
- Update customer sentiment_score field
- Re-evaluate segment membership
- Alert if sentiment drops > 3 points
- Log sentiment change in activity history
- Trigger appropriate journey (detractor vs promoter)

**Agent Configuration**:
- Set sentiment sources (which to include)
- Alert threshold (score drop amount)
- Reanalysis frequency (hourly, daily, weekly)
- Language settings (English, others)
- Sentiment lexicon customization

**Dashboard**:
- Average sentiment score (platform-wide)
- Sentiment distribution histogram
- Trending topics (word cloud)
- Most mentioned issues
- Sentiment by segment comparison

#### 3. Personalization Engine

**Function**: Generates personalized content dynamically based on customer profiles and behavior.

**Input Data**:
- Customer demographic profile
- Transaction history
- Behavioral patterns
- Lifecycle stage
- Sentiment score
- Product usage
- Communication history
- Preferences

**Personalization Types**:

**1. Template-Based Personalization**:
- Replace {{variables}} with customer data
- 11 built-in variables + unlimited custom
- Validation at render time
- Fallback values for missing data

**2. Content Recommendations**:
- Which products to mention
- Which features to highlight
- Which offers to present
- Which testimonials to show

**3. Send Time Optimization**:
- Analyze customer's historical open times
- Recommend optimal send time per customer
- Improve engagement rates 15-30%

**4. Channel Selection**:
- Recommend best channel per customer
- Based on historical response rates
- Consider channel preferences

**5. Message Tone Adjustment**:
- Formal vs casual language
- Technical vs simple explanations
- Length optimization

**Rendering Process**:
1. Receive template with {{variables}}
2. Extract all variables from template
3. Create customer context object
4. Map customer data to variables
5. Render template with actual values
6. Validate output (no missing variables)
7. Return personalized message

**Example Transformation**:

Template:
```
Hi {{firstName}},

Your {{accountBalance}} qualifies you for {{product}}.
```

Context (Customer ID: cust_12345):
```
{
  firstName: "Adewale",
  accountBalance: "₦2,500,000",
  product: "Premium Investment Plan"
}
```

Rendered Output:
```
Hi Adewale,

Your ₦2,500,000 qualifies you for Premium Investment Plan.
```

**Advanced Features**:
- Conditional content: Show A if X, else show B
- Dynamic lists: Top 3 products for this customer
- Real-time data: Current balance, latest transaction
- Contextual offers: Based on recent behavior

**Performance Tracking**:
- Personalization usage rate (% of messages)
- Variables used frequency
- Render success rate
- Impact on engagement (personalized vs generic)
- A/B test personalization effectiveness

#### 4. Segment Optimization Agent

**Function**: Analyzes segment performance and recommends improvements.

**Analysis Types**:

**1. Segment Size Optimization**:
- Too small (< 100): Merge with similar segments
- Too large (> 500k): Split into smaller sub-segments
- Just right (100-500k): Maintain current definition

**2. Overlap Analysis**:
- Identify segments with 80%+ overlap
- Recommend consolidation
- Prevent duplicate messaging

**3. Performance Comparison**:
- Compare segments on key metrics (LTV, engagement, churn)
- Identify best and worst performers
- Suggest criteria adjustments

**4. Criteria Refinement**:
- Add filters to improve segment quality
- Remove filters that don't add value
- Optimize filter combinations

**Recommendations Examples**:
- "Segment 'High Value' overlaps 92% with 'Loyal Champions'. Consider merging."
- "Add 'Engagement Level: High' filter to 'At-Risk' segment to focus on best recovery prospects."
- "Split 'Active Users' by location for more targeted messaging."
- "Remove 'Age > 25' filter - it's redundant with your other criteria."

**Auto-Optimization** (Optional):
- Enable automatic segment adjustments
- Requires approval before applying
- Logs all changes made
- Can be reverted within 30 days

**Configuration**:
- Optimization frequency (weekly, monthly)
- Auto-apply threshold (how confident before auto-applying)
- Notification recipients
- Excluded segments (don't optimize these)

#### 5. Campaign Performance Agent

**Function**: Analyzes campaign results and provides actionable recommendations.

**Analysis Dimensions**:

**1. Channel Performance**:
- Open rates by channel
- Click rates by channel
- Conversion rates by channel
- Cost per channel
- ROI by channel
- Recommendation: Best channel for next campaign

**2. Timing Analysis**:
- Best day of week (Monday-Sunday)
- Best time of day (hourly breakdown)
- Seasonality patterns (monthly trends)
- Recommendation: Optimal send schedule

**3. Content Analysis**:
- Subject line performance (A/B test results)
- CTA effectiveness (which CTAs work best)
- Message length impact (long vs short)
- Personalization impact (personalized vs generic)
- Recommendation: Content best practices

**4. Audience Analysis**:
- Segment performance comparison
- Demographics that respond best
- Lifecycle stage responsiveness
- Sentiment bucket performance
- Recommendation: Target audience refinement

**5. Competitive Benchmarking**:
- Your metrics vs industry average
- Your metrics vs your historical average
- Identify improvement opportunities
- Recommendation: Focus areas

**Performance Report Generation**:
- Automated report after campaign completes
- PDF export with visualizations
- Key findings summary
- 3-5 actionable recommendations
- Estimated impact of implementing recommendations

**Continuous Learning**:
- Tracks all campaigns over time
- Builds knowledge base of what works
- Adapts recommendations based on results
- Personalizes advice per campaign type

**Dashboard**:
- Campaign comparison table
- Trend charts (performance over time)
- Best practices library
- Quick wins (easy improvements)
- Learning center (tips and guides)

### Sentiment Analysis Dashboard (`/sentiment-analysis`)

Deep dive into customer sentiment across your base.

**Sentiment Distribution**:
- Histogram: Count of customers per score (1-10)
- Average sentiment score (platform-wide)
- Median sentiment score
- Standard deviation
- Trend over time (30, 60, 90 days)

**Sentiment Buckets Visualization**:
- 5×5 matrix heatmap
- Color-coded by risk level
- Click any bucket to see customers
- Hover for bucket definition
- Customer count per bucket

**Sentiment Drivers Analysis**:
- **Product Satisfaction**: Breakdown by product type
- **Service Quality**: Customer service ratings
- **Platform Usability**: App/web experience scores
- **Support Responsiveness**: Ticket resolution satisfaction
- **Pricing Perception**: Value for money ratings

**Sentiment Trends**:
- Line chart over time
- Overlay lifecycle stage changes
- Overlay campaign launches
- Correlation with churn events
- Predictive trend (next 30 days)

**Action Recommendations**:

**High-Risk Customers** (Detractors 0-2):
- List of customers
- Priority ranking
- Recommended immediate actions
- Assigned owner (who should reach out)

**Positive Sentiment** (Promoters 9-10):
- Advocacy opportunity identification
- Referral program invitation
- Case study candidates
- Review request timing

**Neutral Customers** (Passives 5-6):
- Upsell opportunities
- Value demonstration needs
- Feature education gaps
- Competitive threats

---

## Compliance & Governance

### Audit Trail (`/audit`)

Complete, immutable log of all platform activities for regulatory compliance.

#### Communication Audit Logs

**Database Table**: `communication_audit_logs`
**28 Fields** capturing comprehensive communication details:

**Customer Information**:
- customer_id: Unique identifier
- customer_name: Full name at send time
- customer_email: Email address
- customer_phone: Phone number

**Message Details**:
- message_content: Full message text (encrypted at rest)
- template_id: Template identifier
- template_version: Version number
- personalization_data: JSON of all variables used
- subject: Subject line (Email/Push)
- content_hash: SHA-256 hash for integrity

**Timing Information**:
- scheduled_time: When message was scheduled
- sent_time: When actually sent
- delivered_time: When delivered to recipient
- opened_time: When recipient opened
- clicked_time: When link clicked

**Channel & Routing**:
- channel: Email, SMS, WhatsApp, Push, In-App
- trigger_type: Campaign, Journey, Manual, API
- journey_id: Associated journey ID
- journey_name: Journey name at send time
- campaign_id: Associated campaign ID
- campaign_name: Campaign name at send time

**Delivery Status**:
- delivery_status: Sent, Delivered, Opened, Clicked, Bounced, Failed
- failure_reason: Error message if failed

**Compliance Fields**:
- consent_status: JSON of consent at send time
- gdpr_compliant: Boolean flag
- data_residency: NG-Lagos (storage location)
- initiated_by: User who triggered send
- approved_by: User who approved (if required)

**Audit Metadata**:
- created_at: Immutable timestamp
- id: Unique UUID

**Query Capabilities**:

**Filter Options**:
- By customer ID
- By channel (Email, SMS, WhatsApp, Push)
- By date range (from/to)
- By campaign or journey
- By delivery status
- By initiated_by user
- By consent status

**Search**:
- Full-text search in message content
- Search by reference ID
- Search by customer name/email

**Export**:
- Export filtered results to CSV
- Include/exclude specific columns
- Date range selection
- Triggers audit log entry (export activity logged)

**Immutability Guarantees**:
- No UPDATE operations allowed
- No DELETE operations allowed
- INSERT only (append-only)
- Cryptographic hashing (SHA-256)
- Tamper detection on read
- Database-level constraints

#### Activity Logs

**Database Table**: `activity_logs`
**12 Fields** tracking all user actions:

**User Information**:
- user_id: User identifier
- user_name: User full name
- user_role: Role at time of action (Marketing Manager, Analyst, etc.)

**Action Details**:
- action_type: Specific action taken (see list below)
- resource: What was affected (campaign, journey, segment, etc.)
- resource_id: Specific ID of resource
- details: JSON with additional context

**Session Information**:
- ip_address: User's IP
- user_agent: Browser/device info
- session_id: Unique session identifier

**Timing**:
- timestamp: When action occurred
- created_at: Record creation time

**Tracked Action Types** (20+):
- login: User logged in
- logout: User logged out
- campaign_create: Campaign created
- campaign_launch: Campaign launched
- campaign_update: Campaign modified
- campaign_delete: Campaign removed
- journey_create: Journey created
- journey_update: Journey modified
- journey_delete: Journey removed
- journey_publish: Journey published to production
- segment_create: Segment created
- segment_modify: Segment criteria changed
- segment_delete: Segment removed
- data_export: Customer data exported
- approval_submit: Item submitted for approval
- approval_approve: Item approved
- approval_reject: Item rejected
- settings_change: Platform settings modified
- consent_update: Customer consent changed
- customer_view: Customer 360 viewed

**Session Tracking**:
- Unique session ID generated at login
- All actions in session linked
- Session timeout logged
- Concurrent session detection
- IP address changes flagged

**Query & Analysis**:
- User activity report (actions per user)
- Resource audit trail (all changes to specific item)
- Time-based analysis (busiest hours/days)
- Action frequency (most common actions)
- Security monitoring (unusual patterns)

### Consent Management (`/consent`)

GDPR-compliant consent tracking and management.

#### Consent Record Structure

**Per Customer, Per Channel, Per Purpose**:

**Email Consent**:
- Marketing: Opted In/Out + timestamp + source
- Transactional: Opted In/Out + timestamp + source

**SMS Consent**:
- Marketing: Opted In/Out + timestamp + source
- Transactional: Opted In/Out + timestamp + source

**Push Notification Consent**:
- Marketing: Opted In/Out + timestamp + source
- Transactional: Opted In/Out + timestamp + source

**WhatsApp Consent**:
- Marketing: Opted In/Out + timestamp + source
- Transactional: Opted In/Out + timestamp + source

**Consent Metadata**:
- **Source**: Where consent obtained
  - web: Company website
  - app: Mobile application
  - onboarding: Signup process
  - support: Support agent
  - api: Programmatic
  - import: Bulk import

- **Method**: How consent obtained
  - explicit: Clear affirmative action
  - implicit: Implied by action
  - opt_in: Customer chose to opt in
  - opt_out: Customer chose to opt out

- **Timestamp**: When consent granted/revoked (ISO 8601)

- **Previous State**: Before this change (for history)

- **New State**: After this change

#### Consent Preferences

**Frequency Preference**:
- Daily: Okay to receive daily
- Weekly: Maximum once per week
- Monthly: Maximum once per month

**Topic Interests** (Multi-select):
- Savings tips
- Investment updates
- Loan offers
- Credit card promotions
- Account updates
- Security alerts
- Product news
- Event invitations

**Quiet Hours**:
- enabled: Boolean (respect quiet hours or not)
- start: Time when quiet hours begin (e.g., "22:00")
- end: Time when quiet hours end (e.g., "08:00")
- timezone: Customer's timezone

**Language Preference**:
- English (default)
- Other languages (configurable)

#### Consent History

Complete audit trail of all consent changes:

**History Entry Fields**:
- timestamp: When change occurred
- action: opt_in, opt_out, preference_update
- channel: Which channel affected
- source: Where change originated
- previous_state: Before change (Boolean or object)
- new_state: After change (Boolean or object)
- initiated_by: User ID who made change (system, customer, support agent)
- reason: Optional explanation

**Example History**:
```
1. 2024-01-15 10:30:00 - opt_in - email - onboarding - null → true
2. 2024-02-01 14:22:00 - opt_in - sms - web - false → true
3. 2024-03-10 09:15:00 - preference_update - push - app - false → true
4. 2024-04-20 18:45:00 - opt_out - email - web - true → false
```

#### Consent Enforcement

**Pre-Send Validation**:
1. Check consent status for channel + purpose
2. If marketing message: Must have marketing consent = true
3. If transactional message: Can send if transactional consent OR marketing consent
4. Check quiet hours (if enabled)
5. Check frequency cap (hasn't exceeded preference)
6. Log consent status in audit trail

**Consent Violations Blocked**:
- Message queued but not sent
- Logged in audit trail with reason
- User notified (if manual send)
- Compliance report updated

**Right to be Forgotten**:
- Customer can request data deletion
- All personal data removed
- Communication history anonymized
- Audit logs maintained (anonymized)
- Consent history retained (legal requirement)

### Approval Queue (`/approvals`)

Multi-level approval workflow for compliance and quality control.

#### Approval Types

**1. Campaign Approvals**:
- Triggered when "Requires Approval" enabled in campaign
- **Approval Request Includes**:
  - Campaign name and objective
  - Target segment and size
  - All channel content (Email subject/body, SMS, etc.)
  - Personalization variables used
  - Schedule and frequency
  - Estimated cost
  - Compliance checklist status
- **Reviewer Actions**:
  - Approve: Campaign proceeds to scheduled state
  - Reject: Campaign returned to creator with reason
  - Request Changes: Creator must modify and resubmit

**2. Journey Approvals**:
- Triggered when publishing journey
- **Approval Request Includes**:
  - Journey name and description
  - Visual flow diagram (exported image)
  - All node configurations
  - Message content in action nodes
  - Personalization templates
  - Estimated audience reach
  - Risk assessment
- **Reviewer Actions**:
  - Approve: Journey published to production
  - Reject: Returned to draft with feedback
  - Request Changes: Specific nodes need modification

**3. Content Approvals**:
- All customer-facing content reviewed
- **Content Types**:
  - Email templates
  - SMS templates
  - WhatsApp templates (required by WhatsApp)
  - Push notification templates
  - In-app message templates
  - Landing pages
- **Review Criteria**:
  - Brand compliance
  - Tone and voice
  - Accuracy of claims
  - Legal compliance
  - Grammar and spelling
- **Reviewer Actions**:
  - Approve: Content added to library
  - Reject with comments: Creator revises
  - Approve with changes: Minor edits applied by reviewer

**4. Data Export Approvals**:
- Required for any customer data export
- **Approval Request Includes**:
  - Export type (CSV, Excel, API)
  - Record count
  - Fields included
  - Contains PII: Yes/No
  - Purpose of export
  - Requester justification
  - Data retention plan
- **Reviewer Actions**:
  - Approve: Export proceeds
  - Reject: Export blocked, reason provided
  - Approve with conditions: Limited fields, expiry date

#### Approval Workflow Process

**Step 1: Submission**:
- User completes work (campaign, journey, etc.)
- Clicks "Submit for Approval"
- System generates approval request
- Triggers notification to approvers

**Step 2: Notification**:
- Email sent to all users with approval permission
- In-app notification appears
- Approval queue badge count updates
- Slack/Teams notification (if integrated)

**Step 3: Review**:
- Approver opens approval request
- Reviews all details
- Can add comments/questions
- Can request additional information

**Step 4: Decision**:
- Approve: Work proceeds to next state
- Reject: Returns to creator with reason
- Request Changes: Creator notified of required modifications

**Step 5: Notification of Decision**:
- Creator notified immediately
- Activity logged in audit trail
- Status updated in originating workflow

**Step 6: Audit**:
- All approvals logged with:
  - What was approved/rejected
  - Who made decision
  - When decision made
  - Reason/comments provided
  - Related audit trail entries

#### Pending Approvals Dashboard

**List View**:
- All pending approval requests
- Sort by: Priority, Date submitted, Type, Requester
- Filter by: Type, Priority, Requester, Date range

**Each Approval Card Shows**:
- Type icon (Campaign, Journey, Export, Content)
- Title/Name of item
- Requester name and role
- Submission date and time
- Priority flag (Normal, Urgent, Critical)
- Age of request ("3 hours ago", "2 days ago")
- Quick actions (Approve, Reject, Review)

**Bulk Approval**:
- Select multiple similar requests
- Approve all at once (with confirmation)
- Useful for routine content approvals
- Cannot bulk-approve different types

**Priority System**:
- **Critical** (Red): Blocking urgent launch, requires immediate attention
- **Urgent** (Orange): Time-sensitive, review within 4 hours
- **Normal** (Blue): Standard priority, review within 24 hours

**SLA Tracking**:
- Time since submission
- Expected review time
- Overdue highlighting
- Approver performance metrics

### Governance Logs (`/governance`)

Regulatory compliance monitoring and reporting.

#### Governance Events Tracked

**Policy Violations**:
- Consent violation attempts (blocked sends)
- Unapproved content sent
- Unauthorized data access attempts
- Export limit exceeded
- Quiet hours violations
- Frequency cap exceeded

**Suspicious Activity**:
- Multiple failed login attempts
- Unusual data export patterns
- Access from new location/device
- Permission escalation attempts
- Bulk data modifications

**High-Risk Actions**:
- Large-scale data export
- Mass segment deletion
- Campaign to entire base
- Consent mass update
- User permission changes

**System Configuration Changes**:
- RBAC permission modifications
- System settings updates
- Integration configurations
- API key generation/revocation
- Webhook registrations

#### Compliance Reports

**GDPR Compliance Status**:
- Consent coverage (% customers with consent)
- Data retention compliance
- Right to access requests (processed)
- Right to be forgotten requests (processed)
- Data breach incidents (none expected)
- Third-party data sharing log
- Cross-border data transfers

**Consent Audit Report**:
- Total consent records
- Opt-in rate by channel
- Opt-out rate by channel
- Consent method breakdown
- Consent source breakdown
- Recent consent changes (last 30 days)

**Data Residency Verification**:
- All data stored in: Nigeria (Lagos)
- No data stored outside approved regions
- Backup locations documented
- Data transfer log (if any)

**Communication Volume Report**:
- Messages sent by channel (last 30 days)
- Delivery success rate
- Opt-out rate
- Complaint rate
- Consent violation blocks

**Failed Delivery Analysis**:
- Total failures by reason
- Bounce rate by channel
- Technical vs permanent failures
- Remediation actions taken

**Customer Complaint Tracking**:
- Complaint volume over time
- Complaint categories
- Resolution time
- Repeat complaints
- Satisfaction with resolution

---

## Best Practices

### Segmentation Best Practices

**1. Start Broad, Then Narrow**:
- Begin with lifecycle stages (6 options)
- Add behavioral filters (engagement, churn risk)
- Refine with demographics (age, location, gender)
- Fine-tune with sentiment buckets

**Example Progression**:
- Start: All "Active" customers (850,000)
- Add: Engagement Level = "High" (425,000)
- Add: Location = "Lagos" (187,500)
- Add: Sentiment Bucket = "Engaged Advocate" (42,500)
- Result: Highly targeted segment ready for premium offer

**2. Use Sentiment Buckets Strategically**:

**Loyal Champions** (Very High × Perfect):
- ✅ Advocacy programs
- ✅ Referral incentives
- ✅ Beta testing new features
- ✅ Case studies and testimonials
- ✅ VIP events and previews
- ❌ Don't spam them with too many messages

**At-Risk Detractors** (Low × Poor):
- ✅ Urgent retention campaigns
- ✅ Special win-back offers
- ✅ Personal outreach from account manager
- ✅ Exit surveys to understand issues
- ✅ Product feedback collection
- ❌ Don't give up too early

**Growth Prospects** (Medium × Good/Moderate):
- ✅ Upsell to premium features
- ✅ Cross-sell complementary products
- ✅ Education campaigns
- ✅ Value demonstration
- ❌ Don't overwhelm with too many options

**Passive Users** (Low × Perfect):
- ✅ Re-engagement campaigns
- ✅ "We miss you" messaging
- ✅ Remind of value
- ✅ Remove friction points
- ❌ Don't be too aggressive

**3. Monitor Segment Health Regularly**:
- Check segment size weekly
- Ensure segments not too small (< 100 customers is risky)
- Avoid over-segmentation (more segments ≠ better results)
- Merge overlapping segments (> 80% overlap)
- Archive unused segments

**Optimal Segment Sizes**:
- Minimum viable: 100 customers
- Small: 100-1,000 customers (highly targeted)
- Medium: 1,000-50,000 customers (targeted campaigns)
- Large: 50,000-250,000 customers (broad campaigns)
- Very Large: 250,000+ customers (mass communications)

**4. Dynamic Re-evaluation Trust**:
- Trust the automatic 60-second refresh
- Don't manually refresh constantly
- Let customers flow between segments naturally
- Review criteria quarterly, not daily
- Monitor trend over time, not point-in-time

**5. Test Before Scaling**:
- Create small test segment (100-500 customers)
- Launch campaign to test group first
- Measure performance
- Refine criteria based on results
- Scale to full segment

### Campaign Best Practices

**1. Personalization Always**:

**Minimum Personalization** (Every campaign should have):
- ✅ {{firstName}} in greeting
- ✅ {{location}} for localization
- ✅ {{accountBalance}} for relevance

**Recommended Personalization**:
- ✅ {{product}} - Product they use/should use
- ✅ {{offer}} - Personalized offer amount
- ✅ Custom variables specific to campaign

**Advanced Personalization**:
- ✅ Conditional content (show A if X, else B)
- ✅ Dynamic product recommendations
- ✅ Real-time data (current balance, latest transaction)
- ✅ Behavioral triggers (what they just did)

**2. Multi-Channel Strategy**:

**Channel Selection Guide**:

**Email** - Best for:
- Detailed information
- Multiple CTAs
- Visual content
- Longer-form content
- Open rate: 15-25%
- Click rate: 2-5%
- Best time: Tue-Thu 10am-2pm

**SMS** - Best for:
- Time-sensitive alerts
- Simple messages
- High urgency
- Short CTAs
- Open rate: 90-95%
- Click rate: 6-10%
- Best time: 10am-4pm, avoid evenings

**WhatsApp** - Best for:
- Conversational messages
- Rich media (images, PDFs)
- Two-way communication
- Customer-initiated follow-up
- Open rate: 85-95%
- Response rate: 40-60%
- Best time: 9am-5pm workdays

**Push Notification** - Best for:
- In-app actions
- Real-time alerts
- Breaking news
- Quick interactions
- Open rate: 5-15%
- Conversion rate: 10-20%
- Best time: Based on user's active hours

**In-App Message** - Best for:
- Feature announcements
- Onboarding guidance
- Contextual help
- Upgrade prompts
- View rate: 40-60%
- Engagement rate: 15-30%
- Best time: When feature is accessed

**3. Timing Optimization**:

**Best Send Times** (Nigeria, WAT):
- 📧 Email: 10:00 AM - 2:00 PM Tuesday-Thursday
- 📱 SMS: 10:00 AM - 4:00 PM Monday-Friday
- 💬 WhatsApp: 9:00 AM - 5:00 PM Monday-Friday
- 🔔 Push: Based on user's app usage pattern
- 📲 In-App: When user navigates to relevant section

**Days to Avoid**:
- ❌ Mondays (inbox overload)
- ❌ Fridays (weekend mode)
- ❌ Public holidays
- ❌ Major cultural/religious events
- ❌ First/last day of month (payroll stress)

**Respect Quiet Hours**:
- Default: 22:00 - 08:00 (10 PM - 8 AM)
- Never send marketing during quiet hours
- Transactional okay if urgent
- Consider customer's timezone

**4. A/B Testing Methodology**:

**Test One Variable at a Time**:
- Subject line (biggest impact: 30-50% lift)
- CTA wording (medium impact: 10-20% lift)
- Send time (medium impact: 15-25% lift)
- Content length (variable impact)
- Personalization level (high impact: 20-40% lift)

**Minimum Sample Size**:
- At least 1,000 recipients per variant
- Prefer 5,000+ for statistical significance
- Run test for minimum 24 hours (email)
- Run test for minimum 4 hours (SMS/Push)

**Declare Winner**:
- Measure primary metric (open rate, click rate, conversion)
- Wait for statistical significance (95% confidence)
- Don't stop test early (even if winning)
- Apply winner to remaining audience

### Journey Best Practices

**1. Start Simple**:

**First Journey** (3-5 nodes):
- 1 Trigger node
- 1-2 Action nodes
- 1 Wait node (optional)
- 1 End node

Example: "Welcome Series"
- Trigger: Account created
- Action: Welcome email
- Wait: 24 hours
- Action: Getting started guide
- End

**2. Use Waits Strategically**:

**Wait Duration Guidelines**:
- After promotional message: **48-72 hours**
- After educational content: **24 hours**
- After onboarding email: **24-48 hours**
- Before follow-up: **72 hours** if no response
- Cool-down between campaigns: **7 days**

**Why Waits Matter**:
- Prevent message fatigue
- Give time for customer action
- Respect customer's time
- Improve engagement rates
- Reduce unsubscribes

**3. Condition Node Logic**:

**Keep Conditions Simple**:
- ✅ Good: `customer.balance > 1000000`
- ✅ Good: `customer.engagementLevel == "high"`
- ❌ Bad: Complex multi-part AND/OR logic
- ❌ Bad: Checking multiple fields in one condition

**Test Both Paths**:
- True path should have meaningful action
- False path should also have action (not just end)
- Both paths should provide value
- Document condition logic clearly

**Common Conditions**:
```
Balance-based:
customer.balance > 1000000 → High-value path
customer.balance < 100000 → Entry-level path

Engagement-based:
customer.engagementLevel == "high" → Power user path
customer.engagementLevel == "low" → Re-engagement path

Lifecycle-based:
customer.lifecycleStage == "at-risk" → Retention path
customer.lifecycleStage == "loyal" → Upsell path
```

**4. Exit Conditions**:

**Always Provide Exit Paths**:
- Don't trap customers in infinite loops
- End journey after goal achieved
- Remove from journey if customer churns
- Allow manual exit
- Exit on consent revocation

**Multiple End Nodes**:
- "Goal Achieved" end
- "No Longer Eligible" end
- "Opted Out" end
- "Manually Exited" end
- Track which end customers reach

### Compliance Best Practices

**1. Consent First, Always**:

**Before ANY Marketing Message**:
- ✅ Check consent status for channel + marketing purpose
- ✅ Verify consent is current (< 2 years old recommended)
- ✅ Respect opt-out immediately (within 24 hours)
- ✅ Log consent status in audit trail
- ❌ Never assume consent

**Transactional vs Marketing**:
- **Transactional**: Service-related, no consent needed (e.g., "Your transaction completed")
- **Marketing**: Promotional, consent required (e.g., "Check out our new investment product")
- **Hybrid**: Contains both, treat as marketing, needs consent

**2. Audit Everything**:

**What to Audit**:
- All customer communications (100%)
- All data exports
- All user actions (login, campaign creation, etc.)
- All consent changes
- All approval decisions
- All system configuration changes

**Review Audit Logs**:
- Weekly: High-level metrics
- Monthly: Detailed review
- Quarterly: Compliance report
- Annually: Full audit for regulators

**Investigate Issues**:
- Delivery failures > 10%
- Consent violation attempts
- Unusual activity patterns
- Complaint spikes

**3. Approval Workflows**:

**When to Require Approval**:
- ✅ All campaigns to > 100,000 customers
- ✅ New campaign content (first time)
- ✅ Sensitive offers (loans, credit, etc.)
- ✅ Data exports containing PII
- ✅ Changes to live journeys
- ❌ Routine messages to small segments
- ❌ Auto-generated transactional messages

**Fast-Track Approvals**:
- Pre-approve templates for reuse
- Batch approve similar content
- Delegate approval for routine items
- Set SLA: Approve within 4 hours

**4. Data Privacy**:

**Minimize Data Access**:
- Export only necessary fields
- Require approval for PII exports
- Set expiration on exported files
- Track all data access

**Data Residency**:
- All customer data stored in Nigeria (Lagos)
- No transfers outside approved regions
- Document any exceptions
- Regular audits of storage locations

**GDPR Compliance**:
- ✅ Right to access (provide data within 30 days)
- ✅ Right to be forgotten (delete within 30 days)
- ✅ Right to rectification (update incorrect data)
- ✅ Right to portability (export in standard format)
- ✅ Right to restrict processing (pause communications)

---

## Technical Architecture

### Database Schema

UC-Edge uses Supabase (PostgreSQL) for data persistence.

#### Primary Tables

**communication_audit_logs**
```sql
CREATE TABLE communication_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id text NOT NULL,
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  message_content text NOT NULL,
  template_id text,
  template_version text,
  personalization_data jsonb DEFAULT '{}'::jsonb,
  subject text,
  scheduled_time timestamptz,
  sent_time timestamptz,
  delivered_time timestamptz,
  opened_time timestamptz,
  clicked_time timestamptz,
  channel text NOT NULL,
  trigger_type text NOT NULL,
  journey_id text,
  journey_name text,
  campaign_id text,
  campaign_name text,
  delivery_status text NOT NULL DEFAULT 'sent',
  failure_reason text,
  consent_status jsonb DEFAULT '{}'::jsonb,
  content_hash text NOT NULL,
  gdpr_compliant boolean DEFAULT true,
  data_residency text DEFAULT 'NG-Lagos',
  initiated_by text,
  approved_by text,
  created_at timestamptz DEFAULT now()
);
```

**Indexes**:
- `idx_audit_logs_customer_id` ON customer_id
- `idx_audit_logs_channel` ON channel
- `idx_audit_logs_trigger_type` ON trigger_type
- `idx_audit_logs_delivery_status` ON delivery_status
- `idx_audit_logs_sent_time` ON sent_time DESC
- `idx_audit_logs_journey_id` ON journey_id
- `idx_audit_logs_campaign_id` ON campaign_id

**RLS Policies**:
- Authenticated users can SELECT
- System can INSERT
- NO UPDATE or DELETE allowed

**activity_logs**
```sql
CREATE TABLE activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  user_name text NOT NULL,
  user_role text NOT NULL,
  action_type text NOT NULL,
  resource text,
  resource_id text,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  session_id text,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
```

**Indexes**:
- `idx_activity_logs_user_id` ON user_id
- `idx_activity_logs_action_type` ON action_type
- `idx_activity_logs_resource` ON resource
- `idx_activity_logs_timestamp` ON timestamp DESC

**RLS Policies**:
- Authenticated users can SELECT
- System can INSERT
- NO UPDATE or DELETE allowed

### State Management

**Context Architecture**:

**AuthContext** (`src/contexts/AuthContext.tsx`):
- Manages user authentication
- Stores current user and role
- Handles login/logout
- Integrated with ActivityLogger

**DataContext** (`src/contexts/DataContext.tsx`):
- Manages customer data
- Manages transactions and events
- Provides data access methods
- Generates sample data

**SegmentsContext** (`src/contexts/SegmentsContext.tsx`):
- Manages segment CRUD operations
- Dynamic re-evaluation (60-second intervals)
- Segment membership calculation
- Performance tracking

**CampaignsContext** (`src/contexts/CampaignsContext.tsx`):
- Campaign lifecycle management
- Execution tracking
- Performance metrics
- Template library

### Core Services

**PersonalizationEngine** (`src/utils/personalization.ts`):

**Methods**:
```typescript
class PersonalizationEngine {
  static render(template: string, context: PersonalizationContext): string
  static extractVariables(template: string): string[]
  static createCustomerContext(customer: Customer, additionalData?: Record<string, any>): PersonalizationContext
  static validateTemplate(template: string): { isValid: boolean; errors: string[]; variables: string[] }
  static getAvailableVariables(): Array<{ name: string; description: string; example: string }>
}
```

**Usage**:
```typescript
const template = "Hi {{firstName}}, your {{accountBalance}} qualifies you for {{offer}}";
const context = PersonalizationEngine.createCustomerContext(customer, { offer: "Premium Plan" });
const rendered = PersonalizationEngine.render(template, context);
// Result: "Hi Adewale, your ₦2,500,000 qualifies you for Premium Plan"
```

**SegmentEvaluator** (`src/services/segmentEvaluator.ts`):

**Methods**:
```typescript
class SegmentEvaluator {
  static evaluateSegment(segment: Segment, customers: Customer[]): {
    matchingCustomers: Customer[];
    metrics: { customerCount: number; totalLTV: number; avgLTV: number; churnRate: number };
  }
  static evaluateAllSegments(segments: Segment[], customers: Customer[]): Map<string, {...}>
}
```

**Evaluation Logic**:
- Filters customers by all criteria
- Supports 13 filter dimensions
- Calculates segment metrics
- Returns matching customers + metrics

**ActivityLogger** (`src/services/activityLogger.ts`):

**Methods**:
```typescript
class ActivityLogger {
  log(params: LogActivityParams): Promise<void>
  logLogin(userId, userName, userRole): Promise<void>
  logLogout(userId, userName, userRole): Promise<void>
  logCampaignAction(...): Promise<void>
  logJourneyAction(...): Promise<void>
  logSegmentAction(...): Promise<void>
  logDataExport(...): Promise<void>
  logApprovalAction(...): Promise<void>
}
```

**Integration Points**:
- AuthContext: login/logout
- Campaign actions
- Journey operations
- Segment modifications
- Data exports
- Approval workflows

### RBAC Implementation

**Permission Checking**:
```typescript
hasPermission(userRole: UserRole, permission: Permission): boolean
```

**Route Protection**:
```typescript
<PermissionGuard permission="can_create_campaigns">
  <CampaignWizard />
</PermissionGuard>
```

**Sidebar Filtering**:
```typescript
const filteredMenuGroups = useMemo(() => {
  if (!user) return [];
  return menuGroups.map(group => ({
    ...group,
    items: group.items.filter(item =>
      !item.permission || hasPermission(user.role, item.permission)
    )
  })).filter(group => group.items.length > 0);
}, [user]);
```

---

## FAQs

### General Questions

**Q: What does the 425× multiplier mean?**

A: For demonstration purposes, all customer counts displayed in the UI are multiplied by 425. This allows the platform to show realistic enterprise-scale numbers (2.1M customers) while working with a manageable dataset of ~5,000 actual records. All calculations, segmentation, and analytics work on the real 5,000 customers, but display the scaled numbers.

**Q: Can I change my role?**

A: Yes. Logout (click your avatar → Sign Out) and return to the login page. Select a different user profile to experience the platform with different permissions. Each role (Marketing Manager, Campaign Specialist, Analyst, Compliance Officer, Executive, Support Agent) has unique capabilities.

**Q: Is this connected to real customer data?**

A: No. UC-Edge currently uses generated sample data for demonstration. The data patterns, behaviors, and distributions are realistic and based on actual financial services data, but individual customer records are synthetic. In a production deployment, UC-Edge would connect to United Capital's actual customer database.

**Q: How often does data refresh?**

A: - **Segments**: Re-evaluate every 60 seconds automatically
- **Dashboard Metrics**: Update on page load
- **Real-Time Events**: Update instantly as they occur
- **Analytics Charts**: Recalculate when filters change
- **Audit Logs**: Insert in real-time, queryable immediately

**Q: Can I use this in production?**

A: UC-Edge is a demonstration platform showcasing customer engagement capabilities. For production use, contact United Capital Plc to discuss implementation, data integration, compliance requirements, and deployment options.

### Segmentation Questions

**Q: Why did my segment count change?**

A: Segments dynamically re-evaluate every 60 seconds as customer behavior changes. If customers' engagement, transactions, or lifecycle stages shift, they may enter or leave segments automatically. This ensures your segments always reflect current customer state. Check the "Last Updated" timestamp on the segment to see when it was last evaluated.

**Q: Can I see which customers are in a segment?**

A: Yes. Click the segment card and select "Download Customer List" to export the full list of customer IDs currently in that segment. You can also use this list to create campaigns or view individual Customer 360 profiles.

**Q: How many filters can I apply to a segment?**

A: Unlimited. You can combine all 13 filter dimensions simultaneously:
- Lifecycle stages (6 options)
- Sentiment buckets (25 options)
- Age range (min/max)
- Gender (2 options)
- Location (4+ options)
- Engagement level (3 options)
- Churn risk (3 options)
- Sentiment score range (1-10)
- LTV range (min/max)
- Days inactive (max)
- Custom filters

The system handles complex combinations efficiently.

**Q: What's the difference between sentiment score and sentiment bucket?**

A: - **Sentiment Score**: A single number (1-10) indicating overall customer satisfaction, similar to NPS
- **Sentiment Bucket**: A classification into one of 25 categories based on two dimensions:
  - Engagement Level (Very High to Very Low)
  - Product Fit (Perfect to Very Poor)
  
Example: A customer with score 8 might be in the "Engaged Advocate" bucket (High Engagement × Perfect Fit), while another customer with score 8 might be in "Active Moderate" bucket (High Engagement × Moderate Fit). The bucket provides more context than the score alone.

**Q: Can segments overlap?**

A: Yes, customers can be in multiple segments simultaneously. Use the Segment Optimization Agent to identify high-overlap segments (> 80%) and consider merging them to avoid duplicate messaging.

**Q: What's the optimal segment size?**

A: - **Minimum**: 100 customers (below this, statistical significance is poor)
- **Small**: 100-1,000 (highly targeted, niche campaigns)
- **Medium**: 1,000-50,000 (typical campaign size)
- **Large**: 50,000-250,000 (broad campaigns)
- **Very Large**: 250,000+ (mass communications, usually avoided)

Target the smallest segment that achieves your campaign goals.

### Campaign Questions

**Q: Can I send a test campaign first?**

A: Yes. In Step 4 of the Campaign Wizard, enable "Test Send" and select a test segment of 10-100 customers. The system will send only to this group first, then you can review performance before launching to the full audience.

**Q: How do I know if personalization worked correctly?**

A: Check the Communication Audit Logs after sending. Each log entry includes:
- `personalization_data`: JSON showing all variables used
- `message_content`: The final rendered message

Compare these to verify variables were replaced correctly. You can also use the "Preview with Real Customer" feature in the Campaign Wizard before sending.

**Q: Can I cancel a scheduled campaign?**

A: Yes. Navigate to Campaigns, find the scheduled campaign, and click "Cancel" in the actions menu. Scheduled campaigns can be edited or deleted anytime before their scheduled send time.

**Q: What happens if consent is revoked after I schedule a campaign?**

A: The system checks consent at send time (not schedule time). If a customer revokes consent after you schedule a campaign but before it sends, their message will be blocked automatically and logged as a consent violation prevention.

**Q: How does send rate limiting work?**

A: To avoid overwhelming mail servers and SMS gateways:
- Email: 1,000 messages/minute
- SMS: 500 messages/minute
- WhatsApp: 300 messages/minute (API limit)
- Push: 5,000 messages/minute
- In-App: No limit (delivered on next app open)

Large campaigns are automatically batched. Estimated completion time shown in dashboard.

### Journey Questions

**Q: Can I edit a published journey?**

A: Not directly. To edit a published journey:
1. Pause the journey (stops new entries)
2. Customers already in journey continue on old version
3. Make your edits in draft mode
4. Republish with new version number
5. New customers entering use the new version

This prevents disrupting in-flight customer journeys.

**Q: How do I test a journey before launching?**

A: Two methods:
1. **Manual Trigger**: Create journey with Manual trigger, add 5-10 test customers, monitor their progress through Journey Analytics
2. **Test Segment**: Create tiny segment (10-20 customers), use Segment Entry trigger, observe results before expanding

**Q: Can a customer be in multiple journeys?**

A: Yes. Customers can participate in multiple journeys simultaneously (e.g., onboarding journey + promotional campaign journey + loyalty journey). The system tracks each journey independently.

**Q: What happens if a customer exits a segment mid-journey?**

A: They continue in the journey unless you explicitly add an exit condition checking segment membership. If you want customers to exit when they leave a segment, add a Condition node checking membership and route the "false" path to an End node.

**Q: Do wait timers pause when I pause a journey?**

A: No. Wait timers continue counting down even when the journey is paused. When you resume the journey, customers who completed their wait while paused will immediately proceed to the next node.

**Q: Can I see which customers are currently in a journey?**

A: Yes. Journey Analytics shows:
- List of all customers currently in journey
- Their current node/step
- Time spent in journey
- Next scheduled action
- Filter by node to see who's at each step

### Compliance Questions

**Q: Are audit logs tamper-proof?**

A: Yes. Multiple layers of protection:
- **Cryptographic Hashing**: SHA-256 hash of content
- **Immutable Storage**: No UPDATE or DELETE operations allowed
- **Database Constraints**: Enforced at PostgreSQL level
- **Tamper Detection**: Hash verification on read
- **Append-Only**: New records only

Any tampering attempt would break the hash chain and be detectable.

**Q: How long are logs retained?**

A: Default retention: **7 years** for financial services compliance (Nigeria regulations). Configurable per local requirements. Logs are:
- Hot storage: 12 months (fast queries)
- Warm storage: 13-36 months (slightly slower)
- Cold storage: 37-84 months (archive, slower queries)

**Q: Can I export audit logs?**

A: Yes, with proper approval. Navigate to Audit Trail, apply filters, click Export. If the export contains PII or spans > 10,000 records, it requires approval from Compliance Officer or Executive role.

**Q: What if a customer requests their data (GDPR Right to Access)?**

A: 1. Navigate to Customer 360 for that customer
2. View all data (profile, transactions, communications, consent, journeys)
3. Export complete data package (button in Customer 360)
4. Deliver to customer within 30 days (GDPR requirement)

The export includes everything UC-Edge knows about them.

**Q: How do I handle Right to be Forgotten requests?**

A: Currently a manual process:
1. Customer submits deletion request
2. Compliance Officer verifies identity
3. Remove customer from all active journeys
4. Anonymize all audit logs (replace name/email with "REDACTED")
5. Delete customer profile
6. Retain anonymized logs (legal requirement)
7. Confirm deletion to customer within 30 days

(Note: Full automation of RTBF planned for future release)

### Technical Questions

**Q: What browsers are supported?**

A: Modern browsers with ES6+ support:
- ✅ Chrome 90+ (recommended)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ❌ Internet Explorer (not supported)

Mobile browsers:
- ✅ iOS Safari 14+
- ✅ Chrome Mobile 90+
- ✅ Samsung Internet 14+

**Q: Is there an API?**

A: Not in the current demonstration version. A production deployment would include:
- REST API for data access
- Webhooks for event notifications
- GraphQL API for flexible queries
- Authentication via API keys or OAuth2

**Q: Can I import customers from a CSV?**

A: Not in the demo. Production version supports:
- CSV import with field mapping
- Excel import
- API-based batch import
- Real-time streaming from customer database
- Validation and deduplication

**Q: Is there mobile app access?**

A: The web interface is fully responsive and works on mobile browsers. Native mobile apps (iOS, Android) are planned for future releases with push notification management and on-the-go campaign approval.

**Q: What's the maximum segment size?**

A: Technical limit: All customers in database (~2.1M displayed)
Practical limit: Segments over 1M customers are usually too broad
Recommended: Keep segments under 500K for targeted campaigns

**Q: Can I integrate with our CRM?**

A: Not in demo. Production integrations available for:
- Salesforce
- Microsoft Dynamics
- HubSpot
- Custom CRM via API
- Real-time data sync

### Performance Questions

**Q: How fast are segments evaluated?**

A: Segment evaluation is highly optimized:
- Small segments (< 10K): < 100ms
- Medium segments (10K-100K): 200-500ms
- Large segments (100K-500K): 1-2 seconds
- Very large segments (500K+): 2-5 seconds

All segments re-evaluate every 60 seconds without impacting user experience.

**Q: What's the campaign send speed?**

A: Depends on channel:
- Email: 1,000/minute = 60K/hour
- SMS: 500/minute = 30K/hour
- WhatsApp: 300/minute = 18K/hour
- Push: 5,000/minute = 300K/hour

Example: Campaign to 100K customers via Email takes ~1.5 hours

**Q: Are there concurrency limits?**

A: Platform supports:
- Unlimited concurrent viewers
- 50 concurrent campaigns executing
- 100 concurrent journeys running
- 10 concurrent data exports
- 1,000 concurrent API requests/second (production)

### Troubleshooting Questions

**Q: Why isn't my campaign sending?**

A: Check these common issues:
1. **Approval Required**: Campaign waiting in approval queue
2. **Scheduled**: Check start date/time hasn't arrived yet
3. **Consent Issues**: Customers lack consent for channel
4. **Empty Segment**: Target segment has 0 customers
5. **Technical Error**: Check campaign dashboard for error message

**Q: Why aren't customers entering my journey?**

A: Verify:
1. **Journey Published**: Still in draft mode?
2. **Trigger Configured**: Trigger type set correctly?
3. **Event Firing**: Is the triggering event actually occurring?
4. **Segment Membership**: Are customers actually in the trigger segment?
5. **Re-entry Allowed**: Did you disable re-entry and customers already entered?

**Q: My personalization isn't working. What's wrong?**

A: Common issues:
1. **Typo in Variable Name**: `{{fistName}}` vs `{{firstName}}`
2. **Extra Spaces**: `{{ name }}` should be `{{name}}`
3. **Missing Data**: Customer doesn't have that field populated
4. **Custom Variable Not Defined**: You used `{{offer}}` but didn't define it
5. **Wrong Context**: Variable valid for campaigns but not SMS (character limit)

---

## Getting Help

### Support Resources

**In-Platform Help**:
- Hover tooltips on most fields and buttons
- Info icons (ℹ️) with detailed explanations
- Validation messages guide correct usage
- Inline documentation in complex features

**Documentation**:
- This USER_GUIDE.md (comprehensive reference)
- Video tutorials (planned)
- API documentation (for developers)
- Integration guides (for IT teams)

**Training**:
- Live onboarding sessions for new users
- Role-specific training modules
- Best practices workshops
- Quarterly webinars on new features
- Customer success team check-ins

**Technical Support**:
- Email: support@unitedcapitalplc.com
- Phone: +234 (1) 631-7876
- Hours: Monday-Friday, 8 AM - 6 PM WAT
- Response time: 24 hours for normal, 4 hours for urgent

### Feature Requests

Want new features? Submit via:
- In-app feedback form (Settings → Feedback)
- Email to product team: product@unitedcapitalplc.com
- Quarterly user feedback sessions
- Annual roadmap planning meetings

### Reporting Issues

For bugs or technical issues:
1. Note exact steps to reproduce
2. Capture screenshot if visual issue
3. Record browser and version
4. Include timestamp of occurrence
5. Note any error messages
6. Submit via support email with "BUG:" in subject

---

## Glossary

**At-Risk**: Customer showing declining engagement, potential churn risk

**Audit Trail**: Immutable log of all platform activities for compliance

**Campaign**: Multi-channel marketing initiative targeting specific segment

**Churn**: Customer becomes inactive and stops using services

**Churn Risk**: Probability (low/medium/high) that customer will churn soon

**Consent**: Customer's permission to receive marketing communications

**Engagement Level**: How actively customer uses platform (high/medium/low)

**GDPR**: General Data Protection Regulation (EU privacy law)

**Journey**: Automated sequence of communications triggered by events or conditions

**Lifecycle Stage**: Customer phase (New, Active, Loyal, At-Risk, Churned, Reactivated)

**LTV (Lifetime Value)**: Total revenue from customer over entire relationship

**NPS (Net Promoter Score)**: Customer satisfaction metric (-100 to +100)

**Personalization**: Customizing messages with customer-specific data

**RBAC**: Role-Based Access Control (permission system)

**RLS (Row Level Security)**: Database security enforcing data access rules

**Segment**: Group of customers sharing common characteristics

**Sentiment Bucket**: Classification combining engagement level and product fit

**Sentiment Score**: Numerical rating (1-10) of customer satisfaction

**Template**: Pre-designed message structure with variable placeholders

**Trigger**: Event or condition that starts a journey or campaign

---

## Appendix

### Keyboard Shortcuts

- **Ctrl/Cmd + K**: Open command palette (future feature)
- **Ctrl/Cmd + S**: Save current page/journey
- **Esc**: Close modal, dialog, or panel
- **Tab**: Navigate form fields
- **Ctrl/Cmd + /**: Toggle sidebar collapse
- **Ctrl/Cmd + Z**: Undo (in journey builder)
- **Ctrl/Cmd + Shift + Z**: Redo (in journey builder)

### Status Code Reference

**Campaign Status Colors**:
- **Draft** (Gray): Being created
- **Scheduled** (Blue): Queued for send
- **Running** (Green): Currently sending
- **Paused** (Yellow): Temporarily stopped
- **Completed** (Gray): Finished successfully
- **Failed** (Red): Execution error

**Delivery Status Colors**:
- **Queued** (Gray): Waiting to send
- **Sent** (Blue): Sent from our system
- **Delivered** (Green): Reached recipient
- **Opened** (Green): Recipient opened
- **Clicked** (Green): Recipient clicked link
- **Bounced** (Red): Delivery failed (temporary)
- **Failed** (Red): Delivery failed (permanent)

**Churn Risk Colors**:
- **Low** (Green): < 30% probability
- **Medium** (Yellow): 30-70% probability
- **High** (Red): > 70% probability

**Lifecycle Stage Colors**:
- **New** (Green): Recently onboarded
- **Active** (Blue): Regular engagement
- **Loyal** (Purple): High-value, consistent
- **At-Risk** (Yellow): Declining engagement
- **Churned** (Red): Inactive
- **Reactivated** (Green): Successfully won back

### Data Format Reference

**Dates**: YYYY-MM-DD (2026-02-06) or DD/MM/YYYY (06/02/2026)

**Times**: 24-hour format HH:MM (14:30 = 2:30 PM)

**Currency**: ₦ (Naira symbol) with thousand separators (₦1,234,567)

**Phone**: +234 XXX XXX XXXX (international format)

**Email**: standard@domain.com format

**Percentages**: XX.X% (one decimal place)

**Sentiment Score**: 1-10 (whole numbers)

---

**Document Version**: 2.0
**Last Updated**: February 6, 2026
**Platform Version**: UC-Edge 2.0
**Authors**: United Capital Plc Product Team

For the latest version of this guide, visit the UC-Edge documentation portal or contact support@unitedcapitalplc.com.

---

**END OF USER GUIDE**

