require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { verifyTransaction } = require('./utils/solana');
const { supabase } = require('./utils/supabase');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());

// Ticket Price & Config
const TICKET_PRICE_USDC = process.env.TICKET_PRICE_USDC || 2;
const RAFFLE_END_DATE = process.env.RAFFLE_END_DATE;
const MAX_TICKETS = parseInt(process.env.MAX_TICKETS) || 10000;

// Health Check
app.get('/', (req, res) => {
    res.send('Hollow Raffle Backend is running securely.');
});

// --- API Endpoints ---

// 1. Get Raffle Info (End Date & Ticket Count)
app.get('/api/raffle-info', async (req, res) => {
    try {
        const { count, error } = await supabase
            .from('tickets')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Supabase Error:', error);
            throw error;
        }

        res.json({
            ticketPrice: TICKET_PRICE_USDC,
            endDate: RAFFLE_END_DATE,
            totalTickets: count || 0,
            maxTickets: MAX_TICKETS,
            remainingTickets: Math.max(0, MAX_TICKETS - (count || 0))
        });
    } catch (err) {
        console.error('Error fetching raffle info:', err);
        // Fallback to 0 if DB error, so frontend doesn't crash
        res.status(200).json({
            ticketPrice: TICKET_PRICE_USDC,
            endDate: RAFFLE_END_DATE,
            totalTickets: 0,
            maxTickets: MAX_TICKETS
        });
    }
});

// 2. Get All Tickets (or User Tickets)
app.get('/api/tickets', async (req, res) => {
    const { wallet } = req.query;

    try {
        let query = supabase.from('tickets').select('*');
        if (wallet) {
            query = query.eq('buyer_address', wallet);
        }

        const { data, error } = await query;
        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error('Error fetching tickets:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch tickets' });
    }
});

// 3. Buy Ticket (Verify Transaction & Store)
app.post('/api/buy-ticket', async (req, res) => {
    const { buyerAddress, txSignature, quantity = 1 } = req.body;

    if (!buyerAddress || !txSignature) {
        return res.status(400).json({ success: false, message: 'Missing details' });
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1 || qty > 100) {
        return res.status(400).json({ success: false, message: 'Invalid quantity (1-100).' });
    }

    try {
        // A. Check Total Supply First
        const { count } = await supabase
            .from('tickets')
            .select('*', { count: 'exact', head: true });

        if ((count + qty) > MAX_TICKETS) {
            return res.status(400).json({ success: false, message: `Not enough tickets remaining. Only ${MAX_TICKETS - count} left.` });
        }

        // B. Check if signature already used
        const { data: existing } = await supabase
            .from('tickets')
            .select('id')
            .eq('tx_signature', txSignature)
            .single();

        if (existing) {
            return res.status(400).json({ success: false, message: 'Transaction already used' });
        }

        // C. Verify on-chain (Total Amount = Quantity * 2 USDC)
        const isValid = await verifyTransaction(txSignature, qty);

        if (!isValid.success) {
            return res.status(400).json({ success: false, message: isValid.message || 'Verification failed.' });
        }

        // D. Save to Supabase with Random IDs (Loop for each ticket)
        const generatedIds = [];

        for (let i = 0; i < qty; i++) {
            let insertedTicket = null;
            let attempts = 0;

            while (!insertedTicket && attempts < 5) {
                attempts++;
                const randomId = Math.floor(Math.random() * MAX_TICKETS) + 1;

                try {
                    const { data, error } = await supabase
                        .from('tickets')
                        .insert([
                            {
                                id: randomId,
                                buyer_address: buyerAddress,
                                tx_signature: txSignature
                            }
                        ])
                        .select('id')
                        .single();

                    if (!error) {
                        insertedTicket = data;
                        generatedIds.push(data.id);
                    } else if (error.code !== '23505') {
                        // If not unique violation, stop everything
                        console.error('Critical DB Error:', error);
                        // We continue to try others, or break? 
                        // If we break, user might panic. Best to try all.
                    }
                } catch (err) {
                    console.error('Insert loop error:', err);
                }
            }
        }

        console.log(`🎟️ New Purchase: ${buyerAddress} bought ${qty} tickets.`);

        if (generatedIds.length === 0) {
            return res.status(500).json({ success: false, message: 'Failed to generate tickets. Please contact support.' });
        }

        res.json({
            success: true,
            message: `${generatedIds.length} tickets purchased successfully!`,
            ticketIds: generatedIds
        });

    } catch (error) {
        console.error('Purchase Error:', error);
        res.status(500).json({ success: false, message: 'Server error processing purchase' });
    }
});

// 4. Draw Winner (Admin Only)
app.post('/api/draw-winner', async (req, res) => {
    const { adminKey } = req.body;

    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    try {
        // Fetch all tickets to pick a random one
        const { data: tickets, error } = await supabase
            .from('tickets')
            .select('*');

        if (error) throw error;

        if (!tickets || tickets.length === 0) {
            return res.json({ success: false, message: 'No tickets sold yet.' });
        }

        const randomIndex = Math.floor(Math.random() * tickets.length);
        const winner = tickets[randomIndex];

        res.json({
            success: true,
            winner: {
                address: winner.buyer_address,
                ticketId: winner.id,
                tx: winner.tx_signature
            }
        });

    } catch (err) {
        console.error('Draw Error:', err);
        res.status(500).json({ success: false, message: 'Failed to draw winner' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🔥 Hollow Raffle Backend running on port ${PORT}`);
    console.log(`📡 Supabase Connected: ${process.env.SUPABASE_URL}`);
});
