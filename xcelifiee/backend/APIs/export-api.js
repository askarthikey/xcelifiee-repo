// First install required package:
// npm install xlsx

const express = require('express');
const XLSX = require('xlsx');
const router = express.Router();

// Helper function to convert MongoDB data to Excel
const exportToExcel = (data, workSheetName, workSheetColumnNames) => {
    const workBook = XLSX.utils.book_new();
    const workSheetData = [
        workSheetColumnNames,
        ...data.map(item => workSheetColumnNames.map(column => item[column]))
    ];
    
    const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, workSheetName);
    
    // Generate buffer
    return XLSX.write(workBook, { type: 'buffer', bookType: 'xlsx' });
};

// Export Users
router.get('/export-users', async (req, res) => {
    try {
        const usersCollection = req.app.get('usersCollection');
        const users = await usersCollection.find({}).toArray();
        
        const columnNames = ['username', 'email', 'role', 'department']; // Add all relevant user fields
        const buffer = exportToExcel(users, 'Users', columnNames);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Users.xlsx');
        res.send(buffer);
    } catch (err) {
        res.status(500).send({ message: "Error exporting users", payload: err.message });
    }
});

// Export Publications
router.get('/export-publications', async (req, res) => {
    try {
        const publicationsCollection = req.app.get('publicationsCollection');
        const publications = await publicationsCollection.find({}).toArray();
        
        const columnNames = ['title', 'authors', 'journal', 'year', 'doi']; // Add all relevant publication fields
        const buffer = exportToExcel(publications, 'Publications', columnNames);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Publications.xlsx');
        res.send(buffer);
    } catch (err) {
        res.status(500).send({ message: "Error exporting publications", payload: err.message });
    }
});

// Export Patents
router.get('/export-patents', async (req, res) => {
    try {
        const patentsCollection = req.app.get('patentsCollection');
        const patents = await patentsCollection.find({}).toArray();
        
        const columnNames = ['title', 'inventors', 'patentNumber', 'filingDate', 'status']; // Add all relevant patent fields
        const buffer = exportToExcel(patents, 'Patents', columnNames);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Patents.xlsx');
        res.send(buffer);
    } catch (err) {
        res.status(500).send({ message: "Error exporting patents", payload: err.message });
    }
});

// Export Funding Proposals
router.get('/export-funding-proposals', async (req, res) => {
    try {
        const fundingProposalsCollection = req.app.get('fundingProposalsCollection');
        const proposals = await fundingProposalsCollection.find({}).toArray();
        
        const columnNames = ['title', 'investigators', 'fundingAgency', 'amount', 'status']; // Add all relevant proposal fields
        const buffer = exportToExcel(proposals, 'FundingProposals', columnNames);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=FundingProposals.xlsx');
        res.send(buffer);
    } catch (err) {
        res.status(500).send({ message: "Error exporting funding proposals", payload: err.message });
    }
});

// Export All Data (combines all collections into different sheets)
router.get('/export-all', async (req, res) => {
    try {
        const usersCollection = req.app.get('usersCollection');
        const publicationsCollection = req.app.get('publicationsCollection');
        const patentsCollection = req.app.get('patentsCollection');
        const fundingProposalsCollection = req.app.get('fundingProposalsCollection');

        const workBook = XLSX.utils.book_new();

        // Get all data
        const users = await usersCollection.find({}).toArray();
        const publications = await publicationsCollection.find({}).toArray();
        const patents = await patentsCollection.find({}).toArray();
        const proposals = await fundingProposalsCollection.find({}).toArray();

        // Define column names for each sheet
        const collections = [
            {
                data: users,
                name: 'Users',
                columns: ['username', 'email', 'role', 'department']
            },
            {
                data: publications,
                name: 'Publications',
                columns: ['title', 'authors', 'journal', 'year', 'doi']
            },
            {
                data: patents,
                name: 'Patents',
                columns: ['title', 'inventors', 'patentNumber', 'filingDate', 'status']
            },
            {
                data: proposals,
                name: 'FundingProposals',
                columns: ['title', 'investigators', 'fundingAgency', 'amount', 'status']
            }
        ];

        // Create sheets for each collection
        collections.forEach(collection => {
            const workSheetData = [
                collection.columns,
                ...collection.data.map(item => collection.columns.map(column => item[column]))
            ];
            const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
            XLSX.utils.book_append_sheet(workBook, workSheet, collection.name);
        });

        const buffer = XLSX.write(workBook, { type: 'buffer', bookType: 'xlsx' });
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=AllData.xlsx');
        res.send(buffer);
    } catch (err) {
        res.status(500).send({ message: "Error exporting all data", payload: err.message });
    }
});

module.exports = router;