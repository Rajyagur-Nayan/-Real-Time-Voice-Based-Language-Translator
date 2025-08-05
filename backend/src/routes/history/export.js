// routes/export.js
const express = require('express');
const PDFDocument = require('pdfkit');
const pool = require('../../connections/DB.connect'); // PostgreSQL client
const router = express.Router();
const isLoggedIn = require('../../middelwear/login.js')
const fs = require('fs');
const path = require('path');

router.get('/', isLoggedIn, async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT source_language, target_language, source_text, translated_text, created_at 
             FROM translations 
             WHERE user_id = $1 
             ORDER BY created_at DESC`,
            [userId]
        );

        const user = await pool.query('SELECT * FROM "users" WHERE id = $1', [userId]);
        const translations = result.rows;

        if (translations.length === 0) {
            return res.status(404).json({ error: 'No translations found for this user.' });
        }

        // PDF setup
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const filename = `translations_${userId}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Load multilingual font
        doc.registerFont('default', path.join(__dirname, '../../assets/fonts/NotoSans-Regular.ttf'));
        doc.registerFont('hindi', path.join(__dirname, '../../assets/fonts/NotoSansDevanagari-Regular.ttf'));
        doc.registerFont('gujarati', path.join(__dirname, '../../assets/fonts/NotoSansGujarati-Regular.ttf'));
        doc.registerFont('tamil', path.join(__dirname, '../../assets/fonts/NotoSansTamil-Regular.ttf'));
        doc.registerFont('telugu', path.join(__dirname, '../../assets/fonts/NotoSansTelugu-Regular.ttf'));
        doc.registerFont('bengali', path.join(__dirname, '../../assets/fonts/NotoSansBengali-Regular.ttf'));
        doc.registerFont('urdu', path.join(__dirname, '../../assets/fonts/NotoNastaliqUrdu-Regular.ttf'));
        doc.registerFont('arabic', path.join(__dirname, '../../assets/fonts/NotoNaskhArabic-Regular.ttf'));
        doc.registerFont('chinese', path.join(__dirname, '../../assets/fonts/NotoSansSC-Regular.otf'));
        doc.registerFont('japanese', path.join(__dirname, '../../assets/fonts/NotoSansJP-Regular.otf'));
        doc.registerFont('korean', path.join(__dirname, '../../assets/fonts/NotoSansKR-Regular.otf'));

        const getFontByLanguage = (lang) => {
            switch (lang) {
                case 'hi': return 'hindi';
                case 'gu': return 'gujarati';
                case 'ta': return 'tamil';
                case 'te': return 'telugu';
                case 'bn': return 'bengali';
                case 'mr': return 'hindi'; // Devanagari
                case 'ur': return 'urdu';
                case 'ar': return 'arabic';
                case 'zh': return 'chinese';
                case 'ja': return 'japanese';
                case 'ko': return 'korean';
                default: return 'default';
            }
        };

        // Write content
        doc.fontSize(18).text(`Translation History for ${user.rows[0].name}`, { align: 'center' });
        doc.moveDown();

        translations.forEach((item, index) => {
            doc.font('default').fontSize(12).text(`#${index + 1}`, { underline: true });

            doc.font('default').text(`From (${item.source_language}) to (${item.target_language})`);
            // Original
            doc.font('default').text('Original: ', { continued: true });
            doc.font(getFontByLanguage(item.source_language)).text(item.source_text || 'N/A');

            // Translated
            doc.font('default').text('Translated: ', { continued: true });
            doc.font(getFontByLanguage(item.target_language)).text(item.translated_text || 'N/A');

            doc.font('default').text(`Date: ${new Date(item.created_at).toLocaleString()}`);
            doc.moveDown();
        });


        doc.pipe(res);
        doc.end();
    } catch (error) {
        console.error('PDF Export Error:', error.message);
        res.status(500).json({ error: 'Failed to generate PDF file.' });
    }
});

module.exports = router;
