CREATE TABLE IF NOT EXISTS events (
    event_id UUID DEFAULT generateUUIDv4(),
    project_id String,
    timestamp DateTime64(3),
    message String,
    level LowCardinality(String),
    type Int8,
    
    -- Context information
    user_id String DEFAULT '',
    session_id String DEFAULT '',
    
    -- System information
    environment LowCardinality(String) DEFAULT '',
    service LowCardinality(String) DEFAULT '',
    host LowCardinality(String) DEFAULT '',
    
    -- Additional data
    context String DEFAULT '',
    payload String DEFAULT '',
    stack_trace String DEFAULT '',
    
    -- Indexing fields
    tags Array(String) DEFAULT [],
    
    -- Partitioning information
    event_date Date DEFAULT toDate(timestamp)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(event_date)
ORDER BY (project_id, timestamp, level, type)
SETTINGS index_granularity = 8192;
