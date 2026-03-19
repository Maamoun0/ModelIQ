-- Categories
INSERT INTO categories (id, name, icon) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Coding', 'Code2'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Writing', 'PenTool'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Reasoning', 'Brain'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Image Generation', 'Image'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Conversation', 'MessageSquare'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Summarization', 'FileText');

-- Models
INSERT INTO models (id, name, provider, description, type, api_available, website_url, rating, context_window, overall_score, last_updated) VALUES
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'GPT-4o', 'OpenAI', 'OpenAI''s flagship multimodal model. Excels at reasoning, coding, and creative tasks.', 'text', true, 'https://openai.com', 4.7, 128000, 4.5, '2026-03-15'),
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'GPT-4.1', 'OpenAI', 'Optimized for coding, instruction following, and massive 1M token context.', 'text', true, 'https://openai.com', 4.8, 1000000, 4.7, '2026-03-15'),
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Claude 3.5 Sonnet', 'Anthropic', 'Nuanced writing and excellent safety alignment.', 'text', true, 'https://anthropic.com', 4.7, 200000, 4.5, '2026-03-15');

-- Model Categories
INSERT INTO model_categories (model_id, category_id) VALUES
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'), 
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'), 
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'),
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'), 
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'),
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'), 
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

-- Model Features
INSERT INTO model_features (model_id, type, content) VALUES
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'strength', 'Excellent multimodal understanding'),
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'strength', 'Fast response times'),
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'weakness', 'Higher cost'),
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'strength', '1M token context window'),
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'strength', 'Top-tier coding performance'),
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'strength', 'Exceptional writing quality'),
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'strength', 'Strong safety features');

-- Pricing
INSERT INTO pricing (model_id, input_price_per_1m_tokens, output_price_per_1m_tokens, pricing_type, notes) VALUES
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2.50, 10.00, 'paid', 'Volume discounts available'),
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 2.00, 8.00, 'paid', 'Optimized for agentic workflows'),
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 3.00, 15.00, 'paid', 'Extended thinking available');

-- Metrics
INSERT INTO metrics (model_id, reasoning, coding, speed, latency, creative_writing, context_utilization) VALUES
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 4.5, 4.5, 4.0, 4.0, 4.5, 4.5),
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 4.7, 5.0, 4.2, 4.0, 4.3, 5.0),
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 4.5, 4.6, 3.8, 3.5, 5.0, 4.5);
