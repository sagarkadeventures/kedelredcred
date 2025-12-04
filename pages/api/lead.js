// pages/api/lead.js - FIXED VERSION
// Only saves to MongoDB on successful results (1, 2), NOT on errors (3, 4)
import connectDB from '../../config/db';
import Lead from '../../models/Lead';
import SoldLead from '../../models/SoldLead';
import klaviyoService from '../../services/klaviyoService';
// import emailService from '../../services/emailService';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const formData = req.body;

    // Normalize fields
    const norm = normalizeLeadFields(formData);

    // 1. Prepare LeadsMarket API payload FIRST (before saving to DB)
    const leadsMarketPayload = {
      CampaignID: process.env.LEADSMARKET_CAMPAIGN_ID || "331246",
      CampaignKey: process.env.LEADSMARKET_CAMPAIGN_KEY || "b52b889f-0112-4fd0-a679-1bbc6fd5b361",
      LeadtypeId: 19,
      Responsetype: "JSON",
      
      // Personal
      FirstName: formData.fName,
      LastName: formData.lName,
      Email: formData.email,
      PhoneHome: norm.phone,
      
      // DOB - MM/DD/YYYY format
      DOB: `${String(formData.bMonth).padStart(2, '0')}/${String(formData.bDay).padStart(2, '0')}/${formData.bYear}`,
      
      // Address
      Address1: formData.address1,
      City: formData.city,
      State: norm.state,
      ZipCode: norm.zip,
      MonthsAtAddress: parseInt(formData.lengthAtAddress),
      ResidenceType: formData.rentOwn === 'own' ? 'Own' : 'Rent',
      
      // Financial
      RequestedAmount: parseInt(formData.amount),
      SSN: norm.ssn,
      MonthlyIncome: parseInt(formData.monthlyNetIncome),
      IncomeType: mapIncomeTypeAPI(formData.incomeSource),
      
      // Employment
      EmployerName: formData.employerName || "Self",
      MonthsEmployed: parseInt(formData.monthsEmployed) || 12,
      PayFrequency: formData.payFrequency || "Biweekly",
      PayDate1: convertToMMDDYYYY(formData.nextPayDate) || getNextFriday(),
      DirectDeposit: formData.directDeposit === "true" || formData.directDeposit === true ? "true" : "false",
      
      // Banking
      BankName: formData.bankName || "Bank",
      BankABA: norm.bankABA || "123456789",
      BankAccountNumber: norm.bankAccountNumber || "1234567890",
      BankAccountType: formData.bankAccountType || "Checking",
      DebitCard: formData.debitCard === "true" || formData.debitCard === true ? "true" : "false",
      MonthsAtBank: parseInt(formData.monthsAtBank) || 12,
      
      // Drivers License
      DriversLicense: norm.driversLicense || "DL123456",
      DriversLicenseState: norm.driversLicenseState || norm.state,
      
      // Additional
      BestTimeToCall: mapCallTimeAPI(formData.callTime),
      LoanPurpose: mapLoanPurposeAPI(formData.loan_reason),
      Credit: mapCreditRatingAPI(formData.credit_type),
      OwnHome: formData.rentOwn === 'own' ? "true" : "false",
      OwnCar: formData.ownCar === "true" || formData.ownCar === true ? "true" : "false",
      ActiveMilitary: formData.activeMilitary === "true" || formData.activeMilitary === true ? "true" : "false",
      AcceptedTerms: "true",
      
      // Tracking
      ClientIP: formData.ip_address || "0.0.0.0",
      ClientUserAgent: formData.user_agent || "Mozilla/5.0",
      ClientURL: process.env.NEXT_PUBLIC_APP_URL || "https://radcred.com/",
      
      // Pricing
      MinimumPrice: 1,
      MaxResponseTime: 120,

      // Test mode (if provided)
      ...(formData.testResult && { TestResult: formData.testResult })
    };

    console.log('📤 Submitting to LeadsMarket...');
    console.log('Payload:', JSON.stringify(leadsMarketPayload, null, 2));
    
    // 2. Submit to LeadsMarket API FIRST
    const response = await axios.post(
      'https://api.leadsmarket.com/post/data.aspx',
      leadsMarketPayload,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 120000
      }
    );

    const apiResponse = response.data;
    console.log('✅ LeadsMarket Response:', apiResponse);

    // 3. Parse errors if they exist
    let parsedErrors = [];
    if (apiResponse.Errors) {
      if (Array.isArray(apiResponse.Errors)) {
        parsedErrors = apiResponse.Errors.map(err => ({
          field: err.Field || '',
          value: err.Value || '',
          description: err.Description || ''
        }));
      } else if (apiResponse.Errors.Error) {
        const errors = Array.isArray(apiResponse.Errors.Error) 
          ? apiResponse.Errors.Error 
          : [apiResponse.Errors.Error];
        parsedErrors = errors.map(err => ({
          field: err.Field || '',
          value: err.Value || '',
          description: err.Description || ''
        }));
      }
    }

    // 4. Parse messages if they exist
    let parsedMessages = [];
    if (apiResponse.Messages) {
      if (Array.isArray(apiResponse.Messages)) {
        parsedMessages = apiResponse.Messages;
      } else if (apiResponse.Messages.Message) {
        parsedMessages = Array.isArray(apiResponse.Messages.Message) 
          ? apiResponse.Messages.Message 
          : [apiResponse.Messages.Message];
      }
    }

    // 5. Determine the result
    const result = String(apiResponse.Result).toLowerCase();
    
    // ============================================
    // Result "4" or "Errors" = Validation errors
    // DO NOT save to MongoDB - return errors to fix
    // ============================================
    if (result === '4' || result === 'errors' || parsedErrors.length > 0) {
      console.log('❌ Validation errors - NOT saving to MongoDB');
      return res.status(400).json({
        status: 'validation_error',
        errors: parsedErrors,
        messages: parsedMessages,
        message: 'Please correct the highlighted fields'
      });
    }
    
    // ============================================
    // Result "Duplicate" (3) = Already processed
    // DO NOT save to MongoDB
    // ============================================
    if (result === 'duplicate' || result === '3') {
      console.log('⚠️ Duplicate lead - NOT saving to MongoDB');
      return res.status(200).json({
        status: 'duplicate',
        messages: parsedMessages,
        message: 'This application has already been submitted'
      });
    }

    // ============================================
    // Result "1" or "Accepted" = Success - SAVE TO DB
    // Result "2" or "Rejected" = Valid but no match - SAVE TO DB
    // ============================================
    
    // 6. NOW save lead to database (only for valid results)
    const lead = new Lead({
      firstName: formData.fName,
      lastName: formData.lName,
      email: formData.email,
      phone: norm.phone,
      dobMonth: formData.bMonth,
      dobDay: formData.bDay,
      dobYear: formData.bYear,
      address1: formData.address1,
      city: formData.city,
      state: norm.state,
      zipCode: norm.zip,
      monthsAtAddress: formData.lengthAtAddress,
      residenceType: formData.rentOwn === 'own' ? 'Own' : 'Rent',
      requestedAmount: formData.amount,
      ssn: norm.ssn,
      monthlyIncome: formData.monthlyNetIncome,
      incomeType: mapIncomeType(formData.incomeSource),
      employerName: formData.employerName,
      monthsEmployed: formData.monthsEmployed,
      payFrequency: formData.payFrequency,
      nextPayDate: formData.nextPayDate,
      directDeposit: formData.directDeposit,
      bankName: formData.bankName,
      bankABA: norm.bankABA,
      bankAccountNumber: norm.bankAccountNumber,
      bankAccountType: formData.bankAccountType,
      debitCard: formData.debitCard,
      monthsAtBank: formData.monthsAtBank,
      driversLicense: norm.driversLicense,
      driversLicenseState: norm.driversLicenseState,
      bestTimeToCall: formData.callTime,
      loanPurpose: mapLoanPurpose(formData.loan_reason),
      creditRating: mapCreditRating(formData.credit_type),
      ownHome: formData.rentOwn === 'own',
      ownCar: formData.ownCar === "true" || formData.ownCar === true,
      activeMilitary: formData.activeMilitary === "true" || formData.activeMilitary === true,
      clientIP: formData.ip_address,
      clientUserAgent: formData.user_agent,
      trackingId: formData.atrk,
      note: formData.note
    });

    await lead.save();
    console.log('✅ Lead saved to MongoDB');

    // 7. Save LeadsMarket response
    const soldLead = new SoldLead({
      leadId: lead._id,
      result: String(apiResponse.Result),
      campaignId: apiResponse.CampaignID,
      leadsMarketLeadId: apiResponse.LeadID,
      price: apiResponse.Price ? parseFloat(apiResponse.Price) : 0,
      redirectUrl: apiResponse.RedirectURL,
      lmErrors: parsedErrors,
      messages: parsedMessages,
      rawResponse: apiResponse
    });

    await soldLead.save();
    console.log('✅ SoldLead saved to MongoDB');

    // 8. Return appropriate response

    // ============================================
    // Result = "1" or "Accepted" = Success
    // Sync to Klaviyo SOLD list (WgUpfq)
    // ============================================

      const klaviyoLeadData = {
        email: formData.email,
        phone: norm.phone,
        firstName: formData.fName,
        lastName: formData.lName,
        address1: formData.address1,
        city: formData.city,
        state: norm.state,
        zipCode: norm.zip,
        residenceType: formData.rentOwn === 'own' ? 'Own' : 'Rent',
        monthsAtAddress: formData.lengthAtAddress,
        requestedAmount: formData.amount,
        monthlyIncome: formData.monthlyNetIncome,
        incomeType: mapIncomeType(formData.incomeSource),
        employerName: formData.employerName,
        monthsEmployed: formData.monthsEmployed,
        payFrequency: formData.payFrequency,
        bankName: formData.bankName,
        bankAccountType: formData.bankAccountType,
        monthsAtBank: formData.monthsAtBank,
        loanPurpose: mapLoanPurpose(formData.loan_reason),
        creditRating: mapCreditRating(formData.credit_type),
        bestTimeToCall: formData.callTime,
        dobMonth: formData.bMonth,
        dobDay: formData.bDay,
        dobYear: formData.bYear,
        trackingId: formData.atrk,
        clientIP: formData.ip_address,
        createdAt: new Date().toISOString()
      };
    
    // Result = "1" or "Accepted" = Success
    if (result === '1' || result === 'accepted') {
      // Sync to Klaviyo SOLD list
      try {
        const klaviyoResult = await klaviyoService.syncLeadToKlaviyo(klaviyoLeadData, 'sold');
        console.log('✅ Synced to Klaviyo SOLD list:', klaviyoResult);
      } catch (klaviyoError) {
        console.error('❌ Klaviyo sync error (sold):', klaviyoError.message);
      }

      // Send SOLD email to user
      // try {
      //   const emailData = {
      //     firstName: formData.fName,
      //     lastName: formData.lName,
      //     email: formData.email
      //   };

      //   await emailService.sendSoldLeadEmails(emailData);
      //   console.log('✅ Sold lead email sent');
      // } catch (emailError) {
      //   console.error('❌ Email send error:', emailError.message);
      // }

      return res.status(200).json({
        status: 'sold',
        redirect_url: apiResponse.RedirectURL,
        price: apiResponse.Price,
        leadId: apiResponse.LeadID,
        message: 'Lead accepted successfully'
      });
    }
    
    // Result = "2" or "Rejected" = Rejected (but still saved)
    if (result === '2' || result === 'rejected') {
       try {
        const klaviyoResult = await klaviyoService.syncLeadToKlaviyo(klaviyoLeadData, 'rejected');
        console.log('✅ Synced to Klaviyo REJECTED list:', klaviyoResult);
      } catch (klaviyoError) {
        console.error('❌ Klaviyo sync error (rejected):', klaviyoError.message);
        // Don't block the response if Klaviyo sync fails
      }

      // Send REJECTED email with offer URL
      // try {
      //   const emailData = {
      //     firstName: formData.fName,
      //     lastName: formData.lName,
      //     email: formData.email
      //   };

      //   const offerUrl = 'https://afflat3d3.com/trk/lnk/786BE43A-66BF-4957-B2D1-CEF4DF250208/?o=15451&c=918273&a=516670&k=340953338760B4DF749BD4BFBB0C1B83&l=17035&s1=DefaultMay';

      //   await emailService.sendRejectedLeadEmail(emailData, offerUrl);
      //   console.log('✅ Rejected lead email sent');
      // } catch (emailError) {
      //   console.error('❌ Email send error:', emailError.message);
      // } 

      return res.status(200).json({
        status: 'rejected',
        messages: parsedMessages,
        message: 'Unable to match with a lender at this time'
      });
    }

    // Unknown result - still return something
    return res.status(200).json({
      status: 'unknown',
      message: 'Unexpected response from LeadsMarket',
      result: apiResponse.Result
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    
    // Handle axios errors
    if (error.response) {
      return res.status(500).json({
        status: 'error',
        message: 'LeadsMarket API error',
        details: error.response.data
      });
    }
    
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
}

// ===================================
// Helper Functions
// ===================================

function normalizeLeadFields(f) {
  return {
    phone: String(f.phone || "").replace(/\D/g, "").slice(-10),
    ssn: String(f.ssn || "").replace(/\D/g, "").slice(-9),
    zip: String(f.zip || "").replace(/\D/g, "").slice(0, 5),
    state: String(f.state || "").trim().toUpperCase().slice(0, 2),
    bankABA: String(f.bankABA || "").replace(/\D/g, "").slice(0, 9),
    bankAccountNumber: String(f.bankAccountNumber || "").replace(/\D/g, ""),
    driversLicense: String(f.driversLicense || "").trim(),
    driversLicenseState: String(f.driversLicenseState || "").trim().toUpperCase().slice(0, 2),
  };
}

function convertToMMDDYYYY(dateString) {
  if (!dateString) return "";
  if (dateString.includes("/")) return dateString;
  const [year, month, day] = dateString.split("-");
  return `${month}/${day}/${year}`;
}

function getNextFriday() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
  const nextFriday = new Date(today);
  nextFriday.setDate(today.getDate() + daysUntilFriday);
  return `${String(nextFriday.getMonth() + 1).padStart(2, '0')}/${String(nextFriday.getDate()).padStart(2, '0')}/${nextFriday.getFullYear()}`;
}

// API Mapping Functions
function mapIncomeTypeAPI(type) {
  const mapping = {
    'employment': 'Employment',
    'selfemployment': 'Employment',
    'benefits': 'Benefits',
    'unemployed': 'Benefits'
  };
  return mapping[type] || 'Employment';
}

function mapCallTimeAPI(time) {
  const mapping = {
    'anytime': 'Anytime',
    'morning': 'Morning',
    'afternoon': 'Afternoon',
    'evening': 'Evening'
  };
  return mapping[time] || 'Anytime';
}

function mapLoanPurposeAPI(purpose) {
  const mapping = {
    'debt_consolidation': 'Debtconsolidation',
    'credit_card': 'Creditcard',
    'home_improvement': 'Homeimprovement',
    'student_loan': 'Studentloanconsolidation',
    'major_purchase': 'Majorpurchase',
    'auto_repair': 'Car',
    'car': 'Car',
    'green_loan': 'Greenloan',
    'business': 'Business',
    'vacation': 'Vacation',
    'wedding': 'Wedding',
    'relocation': 'Relocation',
    'medical': 'Medical',
    'household': 'Household',
    'emergency': 'Other',
    'other': 'Other'
  };
  return mapping[purpose] || 'Other';
}

function mapCreditRatingAPI(rating) {
  const mapping = {
    'excellent': 'Excellent',
    'verygood': 'Verygood',
    'good': 'Good',
    'fair': 'Fair',
    'poor': 'Poor',
    'verypoor': 'Verypoor'
  };
  return mapping[rating] || 'Unsure';
}

// Database Mapping Functions
function mapIncomeType(type) {
  const mapping = {
    'employment': 'Employment',
    'selfemployment': 'Self-Employment',
    'benefits': 'Benefits',
    'unemployed': 'Unemployed'
  };
  return mapping[type] || 'Employment';
}

function mapLoanPurpose(purpose) {
  const mapping = {
    'debt_consolidation': 'Debt Consolidation',
    'home_improvement': 'Home Improvement',
    'auto_repair': 'Auto Repair',
    'medical': 'Medical',
    'emergency': 'Emergency',
    'vacation': 'Vacation',
    'business': 'Business',
    'other': 'Other'
  };
  return mapping[purpose] || 'Other';
}

function mapCreditRating(rating) {
  const mapping = {
    'excellent': 'Excellent',
    'good': 'Good',
    'fair': 'Fair',
    'poor': 'Poor',
    'verypoor': 'Very Poor'
  };
  return mapping[rating] || 'Unsure';
}