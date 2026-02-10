# UC-Edge Platform User Guide

**Quick Start Guide for United Capital Customer Engagement Platform**

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Customer Segmentation](#customer-segmentation)
4. [Journey Builder](#journey-builder)
5. [Campaign Management](#campaign-management)
6. [Customer 360 View](#customer-360-view)
7. [Analytics & Insights](#analytics--insights)
8. [Compliance & Approvals](#compliance--approvals)

---

## Getting Started

### Login Credentials

Use these demo accounts to explore different permission levels:

- **Admin**: admin@ucplc.com / admin123
- **Marketing**: marketing@ucplc.com / marketing123
- **Campaign Manager**: campaigns@ucplc.com / campaigns123
- **Analyst**: analyst@ucplc.com / analyst123
- **Compliance**: compliance@ucplc.com / compliance123

### First Steps

1. Log in with your credentials
2. Navigate to **Dashboard** to see overall metrics
3. Explore **Customers** to view your customer base
4. Visit **Segments** to see predefined customer groups
5. Try the **Journey Builder** to create automated workflows

---

## Dashboard Overview

The Dashboard provides six key tabs:

### 1. Customers Tab
- View total customers (143,752)
- Track active customers (34,543)
- Monitor churn rate and new customers
- See customer lifecycle distribution

### 2. Marketing Tab
- Campaign performance metrics
- Conversion rates by channel
- ROI tracking
- Click-through and open rates

### 3. Transactions Tab
- Revenue metrics (₦2.4B)
- Average transaction values
- Transaction volume trends
- Product performance

### 4. Behavior Tab
- Customer engagement scores
- Journey completion rates
- Feature adoption metrics
- Usage patterns

### 5. Products Tab
- Product penetration rates
- Cross-sell opportunities
- Product performance by segment
- Revenue by product line

### 6. Risk Alerts Tab
- Churn predictions
- High-risk customers
- Dormant accounts
- Compliance alerts

---

## Customer Segmentation

### Creating a Segment

1. Navigate to **Segments** from the sidebar
2. Click **Create New Segment**
3. Name your segment (e.g., "High-Value Retail Customers")
4. Apply filters:
   - **Business Unit**: Select relevant units (Retail, Corporate, etc.)
   - **Lifecycle Stage**: Choose stages (Onboarding, Active, At Risk, etc.)
   - **Sentiment**: Select from 25 sentiment buckets
   - **Engagement Score**: Set range (0-100)
   - **Transaction Value**: Define minimum/maximum
   - **Risk Score**: Filter by churn risk
   - **Product Holdings**: Select product types
   - **Location**: Choose cities
   - **Last Active**: Set recency filters
5. Click **Save Segment**

### Segment Types

- **High-Value Active**: Top customers with high engagement
- **At-Risk Churners**: Customers showing churn signals
- **New Onboarding**: Recently acquired customers
- **Dormant Revival**: Inactive customers to re-engage
- **Cross-Sell Ready**: Customers likely to buy additional products

### Using Segments

Once created, segments can be:
- Used as campaign audiences
- Monitored in analytics
- Exported for external use
- Triggered in automated journeys

---

## Journey Builder

The Journey Builder is a visual workflow designer for creating automated customer engagement sequences.

### Understanding Node Types

#### 1. **Trigger Node** (Entry Point)
Starts a journey when a condition is met:
- **Event-Based**: Customer performs an action (signup, purchase, login)
- **Schedule-Based**: Time-triggered (daily, weekly, monthly)
- **Segment-Based**: Customer enters a segment
- **API-Triggered**: External system triggers journey

#### 2. **Action Node** (Communication)
Sends messages to customers:
- **Send Email**: Personalized email campaigns
- **Send SMS**: Text message notifications
- **Send Push**: Mobile push notifications
- **Send WhatsApp**: WhatsApp messages
- **Update Profile**: Modify customer data
- **Assign Score**: Update engagement/lead scores

#### 3. **Wait Node** (Delay)
Pauses journey execution:
- **Fixed Duration**: Wait X hours/days
- **Until Date**: Wait until specific date
- **Until Event**: Wait for customer action

#### 4. **Condition Node** (Decision)
Branches based on criteria:
- **Engagement Check**: Did customer open/click?
- **Profile Check**: Age, location, value tier
- **Behavior Check**: Has product, completed action
- **Time Check**: Day of week, business hours

#### 5. **Split Node** (A/B Testing)
Randomly splits audience:
- **50/50 Split**: Equal distribution
- **Custom Split**: 70/30, 80/20, etc.
- Used for testing different messages or offers

#### 6. **End Node** (Exit)
Terminates the journey:
- **Success**: Goal achieved
- **Failed**: Conditions not met
- **Opt-Out**: Customer unsubscribed

### Creating a Journey: Step-by-Step

#### Example: Welcome Series for New Customers

1. **Navigate to Journey Builder**
   - Click **Journey Builder** in the Growth Automation menu

2. **Create New Journey**
   - Click **Create New Journey**
   - Name: "New Customer Welcome Series"
   - Description: "3-email onboarding sequence"

3. **Add Trigger Node**
   - Drag **Trigger** node from palette to canvas
   - Click the node to configure
   - Set trigger type: "Segment Entry"
   - Select segment: "New Onboarding"
   - Save configuration

4. **Add First Email**
   - Drag **Action** node and connect to trigger
   - Configure:
     - Action Type: "Send Email"
     - Subject: "Welcome to United Capital!"
     - Template: Select or create template
     - Personalization: Use {{firstName}} for names

5. **Add Wait Period**
   - Drag **Wait** node and connect
   - Set duration: "2 days"

6. **Add Engagement Check**
   - Drag **Condition** node
   - Configure:
     - Condition: "Has opened previous email"
     - Yes path: Send product tour email
     - No path: Send reminder email

7. **Branch for Engaged Users**
   - Connect "Yes" path to new **Action** node
   - Configure: "Send Product Tour Email"
   - Add another wait: "3 days"
   - Add final email: "How can we help?"

8. **Branch for Non-Engaged**
   - Connect "No" path to **Action** node
   - Configure: "Send Re-engagement Email"
   - Add wait: "1 day"
   - Merge back to main flow

9. **Add End Node**
   - Drag **End** node to all terminal paths
   - Label: "Welcome Series Complete"

10. **Test and Launch**
    - Click **Validate** to check for errors
    - Review journey flow
    - Click **Launch Journey**
    - Monitor performance in analytics

### Journey Builder Tips

- **Use Descriptive Names**: Label each node clearly
- **Test Small First**: Start with a small segment
- **Monitor Performance**: Check analytics regularly
- **Set Exit Conditions**: Always provide opt-out paths
- **Respect Timing**: Don't over-message (max 1 message/day)
- **Personalize Content**: Use customer data fields
- **A/B Test**: Use split nodes to test variations
- **Update Iteratively**: Refine based on results

### Common Journey Templates

#### 1. Onboarding Journey
Trigger → Welcome Email → Wait → Product Tour → Wait → Success Check → End

#### 2. Re-engagement Journey
Trigger (Dormant) → Reminder Email → Wait → Incentive Offer → Condition → Reactivated or End

#### 3. Upsell Journey
Trigger (Product Purchase) → Wait → Cross-sell Email → Condition → Purchased or Reminder → End

#### 4. Churn Prevention
Trigger (Risk Score) → Retention Email → Wait → Condition → Discount Offer → End

---

## Campaign Management

### Creating a Campaign

1. **Navigate to Campaigns**
   - Click **Campaigns** in Growth Automation

2. **Launch Campaign Wizard**
   - Click **Create Campaign**
   - Select campaign type:
     - Broadcast (one-time)
     - Recurring (scheduled)
     - Triggered (automated)

3. **Step 1: Basic Information**
   - Campaign name
   - Business unit
   - Objective (awareness, conversion, retention)
   - Tags for organization

4. **Step 2: Audience Selection**
   - Choose segment(s)
   - View estimated reach
   - Apply additional filters if needed

5. **Step 3: Content Creation**
   - Select channel (Email, SMS, WhatsApp, Push)
   - Write subject line
   - Create message body
   - Add personalization tokens
   - Preview for different customer types

6. **Step 4: Schedule & Launch**
   - Choose send time
   - Set timezone
   - Enable A/B testing (optional)
   - Review and submit
   - Await approval if required

### Campaign Performance Tracking

Monitor these metrics:
- **Sent**: Total messages delivered
- **Opens**: Email/push open rate
- **Clicks**: Link click-through rate
- **Conversions**: Goal completions
- **Revenue**: Generated revenue
- **ROI**: Return on investment

---

## Customer 360 View

Access complete customer profiles with four key tabs:

### 1. Business Profiles
- Account information
- Product holdings
- Relationship value
- Contact details
- Lifecycle stage

### 2. Timeline
- Complete activity history
- Transaction records
- Campaign interactions
- Support tickets
- Journey participation

### 3. Risk & Compliance
- Churn risk score
- Engagement trends
- Dormancy alerts
- Compliance status
- Consent records

### 4. Group Timeline (Corporate)
- Group structure
- Related accounts
- Consolidated metrics
- Cross-entity activities

### Using Customer 360

1. Navigate to **Customers**
2. Click on any customer row
3. View comprehensive profile
4. Export data if needed
5. Take actions (add to segment, start journey, flag for review)

---

## Analytics & Insights

### Key Reports

#### 1. Segment Analytics
- Segment growth trends
- Engagement by segment
- Conversion rates
- Revenue contribution

#### 2. Campaign Analytics
- Performance by campaign
- Channel effectiveness
- Time-based trends
- Cohort analysis

#### 3. Journey Analytics
- Completion rates
- Drop-off points
- Path analysis
- Time to conversion

#### 4. Sentiment Analysis
- Customer sentiment distribution
- Sentiment trends over time
- Sentiment by segment
- Alert triggers

### AI-Powered Recommendations

The system provides:
- **Churn Predictions**: Customers at risk
- **Next-Best-Action**: Suggested engagement strategies
- **Product Recommendations**: Cross-sell opportunities
- **Optimal Send Times**: Best times to reach customers
- **Content Suggestions**: Message themes that resonate

### Accessing Insights

1. Navigate to **Recommendations**
2. Filter by insight type
3. Review AI-generated suggestions
4. Take action directly from insights
5. Track implementation results

---

## Compliance & Approvals

### Approval Queue

For organizations requiring oversight:

1. **Navigate to Approval Queue**
2. View pending campaigns
3. Review campaign details:
   - Audience size
   - Message content
   - Estimated reach
   - Compliance checks
4. Approve or reject with comments
5. Track approval history

### Consent Management

Ensure GDPR/NDPR compliance:

1. **Navigate to Consent Management**
2. View customer consent status
3. Filter by consent type:
   - Email marketing
   - SMS notifications
   - WhatsApp messaging
   - Data processing
4. Export consent records
5. Handle opt-out requests

### Audit Trail

Complete activity logging:

1. **Navigate to Audit Trail**
2. Filter by:
   - User
   - Action type
   - Date range
   - Resource
3. Export for compliance reports
4. Review security events

### Governance Logs

Track regulatory compliance:

1. **Navigate to Governance Logs**
2. View:
   - Policy adherence
   - Data retention compliance
   - Access control logs
   - Risk assessments
3. Generate compliance reports

---

## User Roles & Permissions

### Role Capabilities

| Feature | Admin | Marketing | Campaign Manager | Analyst | Compliance |
|---------|-------|-----------|------------------|---------|------------|
| View Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create Segments | ✓ | ✓ | ✓ | ✗ | ✗ |
| Create Campaigns | ✓ | ✓ | ✓ | ✗ | ✗ |
| Build Journeys | ✓ | ✓ | ✓ | ✗ | ✗ |
| View Analytics | ✓ | ✓ | ✓ | ✓ | ✓ |
| Export Data | ✓ | ✓ | ✓ | ✓ | ✓ |
| Approve Campaigns | ✓ | ✗ | ✗ | ✗ | ✓ |
| Manage Users | ✓ | ✗ | ✗ | ✗ | ✗ |
| Access Audit Logs | ✓ | ✗ | ✗ | ✗ | ✓ |
| Governance Settings | ✓ | ✗ | ✗ | ✗ | ✓ |

---

## Best Practices

### Segmentation
- Start with broad segments, then refine
- Use at least 3 filters for specificity
- Regularly review and update segment criteria
- Archive unused segments

### Journey Building
- Map journeys on paper first
- Keep journeys simple (5-7 nodes max)
- Always test with small audience first
- Monitor drop-off points and optimize
- Set clear success metrics

### Campaign Management
- Write clear, action-oriented subject lines
- Personalize content using customer data
- Test send times for optimal engagement
- Respect frequency caps (max 3 messages/week)
- Always include unsubscribe option

### Data Quality
- Regularly clean customer data
- Validate email addresses
- Update inactive contacts
- Remove duplicates
- Enrich profiles with new data

### Compliance
- Always check consent before messaging
- Document campaign objectives
- Keep audit trails
- Review governance reports monthly
- Train team on data protection

---

## Quick Reference

### Keyboard Shortcuts (Journey Builder)
- **Delete Node**: Select + Delete/Backspace
- **Duplicate Node**: Select + Ctrl/Cmd + D
- **Zoom In**: Ctrl/Cmd + Plus
- **Zoom Out**: Ctrl/Cmd + Minus
- **Fit View**: Ctrl/Cmd + 0
- **Select All**: Ctrl/Cmd + A

### Common Filters
- **Engagement Score > 70**: Highly engaged customers
- **Risk Score > 60**: Churn risk customers
- **Last Active > 90 days**: Dormant customers
- **Transaction Value > ₦1M**: High-value customers
- **Product Holdings = 0**: Upsell opportunities

### Status Indicators
- 🟢 **Active**: Live and running
- 🟡 **Draft**: Being created
- 🔴 **Paused**: Temporarily stopped
- ⚫ **Completed**: Finished
- 🔵 **Scheduled**: Queued to launch
- 🟠 **Pending Approval**: Awaiting review

---

## Support & Help

### Getting Help
- **In-App Help**: Click the "?" icon in any section
- **Technical Support**: support@ucplc.com
- **Feature Requests**: feedback@ucplc.com

### Additional Resources
- Platform documentation: Available in Settings > Help Center
- Video tutorials: Coming soon
- Community forum: Coming soon

---

## Version History

- **v2.0** (Current): Full platform with Journey Builder, AI insights, and governance
- **v1.0**: Initial release with basic campaign management

---

*Last Updated: February 2026*
