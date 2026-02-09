/*
  # Seed Governance Data

  ## Overview
  Seeds initial data for risk_signals and approvals tables to demonstrate
  the unified governance layer across United Capital Group business units.

  ## Data Seeded

  ### Risk Signals (12 records)
  Mix of CHURN, CREDIT, DEAL, and COMPLIANCE risk signals across:
  - Microfinance Bank (MICROFIN)
  - Asset Management (ASSETMGT)
  - Investment Banking (INVBANK)
  - Wealth Management (WEALTH)

  Risk bands: LOW (0-30), MEDIUM (31-60), HIGH (61-100)

  ### Approval Requests (8 records)
  Mix of request types with various statuses:
  - PENDING: Awaiting decision
  - APPROVED: Approved by authorized user
  - REJECTED: Rejected with reason

  Request types:
  - PII_EXPORT: Export of personally identifiable information
  - BULK_EXPORT: Bulk customer data export
  - LOAN_DISBURSE: Loan disbursement approval
  - DEAL_STAGE_ADVANCE: Move deal to execution/closed
  - CAMPAIGN_LAUNCH: Launch marketing campaign
  - JOURNEY_PUBLISH: Publish customer journey

  ## Notes
  - All timestamps are recent (within last 7 days)
  - Risk signals show realistic cross-business scenarios
  - Approval requests demonstrate the governance workflow
  - Data integrates with existing customers, business units, and users
*/

-- Insert risk signals (12 records across all business units)
INSERT INTO risk_signals (customer_id, business_unit_id, signal_type, score, band, rationale, created_at) VALUES
-- Microfinance Bank risk signals
('f6cd731b-cbef-4db3-87e4-04b2b42459f6', '7c0d8797-e3c5-4b45-a13a-f9d1e1750803', 'CREDIT', 75, 'HIGH', 'Missed 2 consecutive loan repayments. Payment pattern deteriorating over last 3 months.', now() - interval '2 days'),
('1ee4d6c8-f396-4568-b553-4cf8488e1379', '7c0d8797-e3c5-4b45-a13a-f9d1e1750803', 'CHURN', 45, 'MEDIUM', 'No transactions in 45 days. Previously active customer with declining engagement.', now() - interval '1 day'),
('8d2a0901-8715-4af0-ab00-63c23d0b5369', '7c0d8797-e3c5-4b45-a13a-f9d1e1750803', 'CREDIT', 28, 'LOW', 'Slight delay in last payment but overall healthy repayment history.', now() - interval '5 days'),

-- Asset Management risk signals
('2828c008-a9f6-4514-a122-05f1342122ec', 'ccbe43d0-87ca-4870-8feb-dd1717b836f9', 'CHURN', 82, 'HIGH', 'Large redemption of 60% holdings. Multiple support calls about switching providers.', now() - interval '1 day'),
('0a2fb31c-f502-4f80-bf8b-cf437cd5eeb2', 'ccbe43d0-87ca-4870-8feb-dd1717b836f9', 'COMPLIANCE', 55, 'MEDIUM', 'KYC documentation expired. Requires immediate renewal for continued trading.', now() - interval '3 days'),
('7aa8818c-2e46-4a12-a78a-301f54ea9e54', 'ccbe43d0-87ca-4870-8feb-dd1717b836f9', 'CHURN', 22, 'LOW', 'Slightly reduced contribution amounts but overall engagement remains strong.', now() - interval '6 days'),

-- Investment Banking risk signals
('e4bc5574-afd0-4be2-aa8f-ba49e9f1c95d', '4f370da0-bd62-4982-9d9d-47ad966ac865', 'DEAL', 68, 'HIGH', 'Deal stalled in due diligence for 90 days. Client expressing concerns about timeline.', now() - interval '2 days'),
('a2fde7ce-d4b1-4403-a966-1b9bb6c176c9', '4f370da0-bd62-4982-9d9d-47ad966ac865', 'COMPLIANCE', 88, 'HIGH', 'Regulatory flag on beneficial ownership disclosure. Requires immediate attention.', now() - interval '1 day'),
('f9b7ea5c-3055-4e8f-9ffd-7d83daff7ac3', '4f370da0-bd62-4982-9d9d-47ad966ac865', 'DEAL', 35, 'MEDIUM', 'Deal probability declining. Competitor activity detected.', now() - interval '4 days'),

-- Wealth Management risk signals
('65964bfa-ed8a-474e-902b-b71dff064ef0', 'c248b393-a3c9-4631-875c-b0036f8d9ce5', 'CHURN', 72, 'HIGH', 'Client mentioned dissatisfaction with portfolio performance in last review call.', now() - interval '3 days'),
('9b05f0f2-7737-4d22-9c58-6dd018f29fcd', 'c248b393-a3c9-4631-875c-b0036f8d9ce5', 'COMPLIANCE', 42, 'MEDIUM', 'Annual risk profile assessment overdue by 30 days.', now() - interval '5 days'),
('5a2a68f3-241c-41eb-bd84-b66ce6dd838d', 'c248b393-a3c9-4631-875c-b0036f8d9ce5', 'CHURN', 18, 'LOW', 'Slightly reduced engagement but portfolio performance on track.', now() - interval '7 days');

-- Insert approval requests (8 records with mixed statuses)
INSERT INTO approvals (
  request_type, customer_id, business_unit_id, payload, 
  requested_by_user_id, status, decided_by_user_id, decision_reason, 
  created_at, decided_at
) VALUES
-- PENDING requests
(
  'PII_EXPORT',
  'f6cd731b-cbef-4db3-87e4-04b2b42459f6',
  '7c0d8797-e3c5-4b45-a13a-f9d1e1750803',
  '{"export_fields": ["email", "phone", "address", "bvn"], "justification": "Customer requested full data copy for personal records as per NDPR rights", "format": "PDF"}'::jsonb,
  '05195125-1035-41e3-9133-e81042f44cbc',
  'PENDING',
  NULL,
  NULL,
  now() - interval '2 hours',
  NULL
),
(
  'BULK_EXPORT',
  NULL,
  'ccbe43d0-87ca-4870-8feb-dd1717b836f9',
  '{"segment_name": "High Net Worth Q1 2026", "record_count": 245, "export_fields": ["name", "email", "aum", "risk_profile"], "purpose": "Quarterly portfolio review campaign"}'::jsonb,
  '59a541dc-63b3-4d61-bb76-08c8226f53c6',
  'PENDING',
  NULL,
  NULL,
  now() - interval '5 hours',
  NULL
),
(
  'LOAN_DISBURSE',
  '8d2a0901-8715-4af0-ab00-63c23d0b5369',
  '7c0d8797-e3c5-4b45-a13a-f9d1e1750803',
  '{"loan_id": "LN-MFB-2026-087", "amount": 2500000, "currency": "NGN", "purpose": "Business expansion loan", "credit_score": 750, "collateral_verified": true}'::jsonb,
  '80e2e512-8774-4496-8782-65fae22d1b59',
  'PENDING',
  NULL,
  NULL,
  now() - interval '1 day',
  NULL
),

-- APPROVED requests
(
  'CAMPAIGN_LAUNCH',
  NULL,
  '7c0d8797-e3c5-4b45-a13a-f9d1e1750803',
  '{"campaign_name": "Loan Repayment Reminder - March 2026", "campaign_id": "CMP-2026-003", "segment_size": 156, "channels": ["SMS", "WhatsApp"], "estimated_cost": 15600}'::jsonb,
  '05195125-1035-41e3-9133-e81042f44cbc',
  'APPROVED',
  '43683902-22e6-4b54-b847-119886bc8b27',
  'Campaign approved. Messaging is compliant and segment is well-targeted.',
  now() - interval '2 days',
  now() - interval '2 days' + interval '3 hours'
),
(
  'DEAL_STAGE_ADVANCE',
  'e4bc5574-afd0-4be2-aa8f-ba49e9f1c95d',
  '4f370da0-bd62-4982-9d9d-47ad966ac865',
  '{"deal_id": "DEAL-IB-2026-004", "current_stage": "NEGOTIATION", "target_stage": "EXECUTION", "deal_value": 45000000, "currency": "USD", "all_docs_complete": true}'::jsonb,
  '59a541dc-63b3-4d61-bb76-08c8226f53c6',
  'APPROVED',
  '43683902-22e6-4b54-b847-119886bc8b27',
  'All due diligence completed. Legal and compliance cleared. Approved to proceed to execution.',
  now() - interval '3 days',
  now() - interval '3 days' + interval '2 hours'
),
(
  'JOURNEY_PUBLISH',
  NULL,
  'c248b393-a3c9-4631-875c-b0036f8d9ce5',
  '{"journey_name": "Quarterly Portfolio Review Workflow", "journey_id": "JRN-2026-003", "estimated_recipients": 89, "automation_nodes": 7, "has_ai_personalization": true}'::jsonb,
  '80e2e512-8774-4496-8782-65fae22d1b59',
  'APPROVED',
  '43683902-22e6-4b54-b847-119886bc8b27',
  'Journey logic reviewed. Personalization rules are appropriate. Approved for production.',
  now() - interval '4 days',
  now() - interval '4 days' + interval '1 hour'
),

-- REJECTED requests
(
  'BULK_EXPORT',
  NULL,
  '7c0d8797-e3c5-4b45-a13a-f9d1e1750803',
  '{"segment_name": "All Active Loans", "record_count": 3456, "export_fields": ["name", "email", "phone", "loan_balance", "repayment_history"], "purpose": "Marketing analysis"}'::jsonb,
  '05195125-1035-41e3-9133-e81042f44cbc',
  'REJECTED',
  '43683902-22e6-4b54-b847-119886bc8b27',
  'Export scope too broad. Please narrow to specific segment and remove repayment_history field. Resubmit with clear business justification.',
  now() - interval '5 days',
  now() - interval '5 days' + interval '4 hours'
),
(
  'LOAN_DISBURSE',
  'f6cd731b-cbef-4db3-87e4-04b2b42459f6',
  '7c0d8797-e3c5-4b45-a13a-f9d1e1750803',
  '{"loan_id": "LN-MFB-2026-065", "amount": 1500000, "currency": "NGN", "purpose": "Working capital", "credit_score": 620, "collateral_verified": false}'::jsonb,
  '80e2e512-8774-4496-8782-65fae22d1b59',
  'REJECTED',
  '43683902-22e6-4b54-b847-119886bc8b27',
  'Credit risk assessment HIGH. Customer has 2 missed payments in last 60 days. Collateral verification incomplete. Cannot approve at this time.',
  now() - interval '6 days',
  now() - interval '6 days' + interval '5 hours'
);