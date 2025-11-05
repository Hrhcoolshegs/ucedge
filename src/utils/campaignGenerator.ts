export interface Campaign {
  id: string;
  name: string;
  type: "Email" | "SMS" | "WhatsApp" | "Push";
  targetAudience: "New Customers" | "Active Users" | "At-Risk" | "Churned - Win-Back" | "Reactivated - Nurture" | "Custom Segment" | "Loyal + High LTV" | "All Active";
  status: "Active" | "Scheduled" | "Completed" | "Paused";
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
  roi: number;
  launchDate: string;
  endDate?: string;
}

export const generateCampaigns = (count: number = 50): Campaign[] => {
  const campaigns: Campaign[] = [];
  
  const campaignNames = [
    "Q4 Investment Drive",
    "Win-Back Special Offer",
    "Savings Promo November",
    "New Fixed Deposit Launch",
    "At-Risk Retention",
    "Reactivated Welcome Back",
    "Black Friday Super Savings",
    "New Year Financial Goals",
    "Loan Product Awareness",
    "Premium Customer Appreciation",
    "We Miss You - Special 15% Bonus",
    "Come Back - Zero Fees for 3 Months",
    "Exclusive Comeback Offer",
    "Personal Invitation from CEO",
    "Mobile App Feature Launch",
    "Investment Webinar Invite",
    "Fixed Deposit Rate Increase",
    "Referral Rewards Program",
    "Birthday Special Offer",
    "Anniversary Celebration",
  ];

  const types: Campaign['type'][] = ["Email", "SMS", "WhatsApp", "Push"];
  const audiences: Campaign['targetAudience'][] = [
    "New Customers",
    "Active Users",
    "At-Risk",
    "Churned - Win-Back",
    "Reactivated - Nurture",
    "Custom Segment",
    "Loyal + High LTV",
    "All Active"
  ];
  const statuses: Campaign['status'][] = ["Active", "Scheduled", "Completed", "Paused"];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const audience = audiences[Math.floor(Math.random() * audiences.length)];
    const status = i < 5 ? "Active" : statuses[Math.floor(Math.random() * statuses.length)];
    
    // Adjust sent count based on audience
    let baseSent = 1000;
    if (audience === "All Active") baseSent = 3500;
    if (audience === "Churned - Win-Back") baseSent = 200;
    if (audience === "Reactivated - Nurture") baseSent = 50;
    if (audience === "At-Risk") baseSent = 500;
    
    const sent = baseSent + Math.floor(Math.random() * 500);
    
    // Open rates vary by type and audience
    let openRate = 0.55;
    if (type === "SMS") openRate = 0.98;
    if (type === "WhatsApp") openRate = 0.95;
    if (type === "Push") openRate = 0.45;
    if (audience === "Reactivated - Nurture") openRate = Math.min(openRate * 1.2, 0.99);
    if (audience === "Churned - Win-Back") openRate = Math.min(openRate * 1.1, 0.99);
    
    const opened = Math.floor(sent * openRate);
    
    // Click rates vary by type and audience
    let clickRate = 0.23;
    if (type === "WhatsApp") clickRate = 0.28;
    if (type === "SMS") clickRate = 0.15;
    if (type === "Push") clickRate = 0.12;
    if (audience === "Reactivated - Nurture") clickRate *= 3.5; // 83% click rate
    if (audience === "Churned - Win-Back") clickRate *= 1.8;
    
    const clicked = Math.floor(opened * Math.min(clickRate, 0.9));
    
    // Conversion rates vary significantly
    let conversionRate = 0.12;
    if (audience === "Reactivated - Nurture") conversionRate = 0.52;
    if (audience === "Churned - Win-Back") conversionRate = 0.18;
    if (audience === "At-Risk") conversionRate = 0.15;
    if (audience === "Loyal + High LTV") conversionRate = 0.22;
    
    const converted = Math.floor(sent * conversionRate);
    
    // Revenue based on audience and conversions
    let avgRevenuePerConversion = 500000;
    if (audience === "Loyal + High LTV") avgRevenuePerConversion = 900000;
    if (audience === "Reactivated - Nurture") avgRevenuePerConversion = 950000;
    if (audience === "Churned - Win-Back") avgRevenuePerConversion = 850000;
    
    const revenue = converted * avgRevenuePerConversion;
    
    // Cost per send varies by type
    let costPerSend = 5;
    if (type === "SMS") costPerSend = 3;
    if (type === "WhatsApp") costPerSend = 7;
    if (type === "Push") costPerSend = 1;
    
    const totalCost = sent * costPerSend;
    const roi = revenue / totalCost;
    
    // Random date in last 6 months
    const daysAgo = Math.floor(Math.random() * 180);
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() - daysAgo);
    
    campaigns.push({
      id: `CAMP-${String(i + 1).padStart(3, '0')}`,
      name: campaignNames[i % campaignNames.length] + (i >= campaignNames.length ? ` ${Math.floor(i / campaignNames.length) + 1}` : ''),
      type,
      targetAudience: audience,
      status,
      sent,
      opened,
      clicked,
      converted,
      revenue,
      roi,
      launchDate: launchDate.toISOString(),
      endDate: status === "Completed" ? new Date(launchDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() : undefined
    });
  }

  return campaigns.sort((a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime());
};