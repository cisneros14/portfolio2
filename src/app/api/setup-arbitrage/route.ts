import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const queries = [
      `CREATE TABLE IF NOT EXISTS niches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        avg_ticket_value DECIMAL(10,2) COMMENT 'Valor estimado de un cliente para este nicho',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS target_locations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        city VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL,
        language_code VARCHAR(5) DEFAULT 'EN' COMMENT 'Idioma para contactarlos (EN, ES, DE)',
        currency_symbol VARCHAR(5) DEFAULT '$',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS search_batches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        niche_id INT,
        location_id INT,
        search_term_used VARCHAR(255) NOT NULL COMMENT 'El prompt exacto usado en Maps',
        total_results INT DEFAULT 0,
        performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (niche_id) REFERENCES niches(id),
        FOREIGN KEY (location_id) REFERENCES target_locations(id)
      )`,
      `CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        batch_id INT,
        business_name VARCHAR(255) NOT NULL,
        address TEXT,
        phone_number VARCHAR(50),
        google_maps_url VARCHAR(500),
        rating DECIMAL(2,1),
        review_count INT,
        has_website BOOLEAN DEFAULT FALSE,
        website_url VARCHAR(500),
        status ENUM(
            'NEW',
            'QUALIFIED',
            'PROTOTYPE_READY',
            'CONTACTED',
            'NEGOTIATING',
            'CLOSED_WON',
            'CLOSED_LOST',
            'BAD_DATA'
        ) DEFAULT 'NEW',
        internal_notes TEXT,
        next_follow_up_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (batch_id) REFERENCES search_batches(id),
        INDEX (status),
        INDEX (has_website)
      )`,
      `CREATE TABLE IF NOT EXISTS interactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        lead_id INT NOT NULL,
        interaction_type ENUM('WHATSAPP', 'EMAIL', 'CALL', 'VIDEO_SENT', 'MEETING'),
        content TEXT COMMENT 'Resumen de lo que se habló',
        interaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
      )`
    ];

    for (const query of queries) {
      await pool.query(query);
    }

    return NextResponse.json({ message: 'Tables created successfully' });
  } catch (error: any) {
    console.error('Error creating tables:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
