const express = require('express')
const router = express.Router()
const { pool } = require('../db/database')
const { sendContactEmail } = require('../utils/mailer')

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: 'All fields are required' })
    }

    // Save to database
    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [name.trim(), email.trim().toLowerCase(), subject.trim(), message.trim()]
    )

    // Send success response IMMEDIATELY — don't wait for email
    res.status(201).json({
      success: true,
      message: "Thank you! Your message has been received. I'll get back to you soon.",
      id: result.rows[0].id
    })

    // Send email IN BACKGROUND after response is sent
    sendContactEmail({ name, email, subject, message })
      .then(() => console.log(`✅ Email sent for contact from ${email}`))
      .catch(err => console.error('⚠️ Email failed:', err.message))

  } catch (err) {
    console.error('Contact error:', err)
    res.status(500).json({ success: false, error: 'Failed to send message.' })
  }
})

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM contact_messages ORDER BY created_at DESC`
    )
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch messages' })
  }
})

module.exports = router