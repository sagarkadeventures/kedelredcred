module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/mongoose [external] (mongoose, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}),
"[project]/config/db.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lead_system';
let cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose;
if (!cached) {
    cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose = {
        conn: null,
        promise: null
    };
}
async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false
        };
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(MONGODB_URI, opts).then((mongoose)=>{
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
const __TURBOPACK__default__export__ = connectDB;
}),
"[externals]/axios [external] (axios, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("axios");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/services/klaviyoService.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// services/klaviyoService.js
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
class KlaviyoService {
    constructor(){
        this.privateKey = process.env.KLAVIYO_PRIVATE_KEY || 'pk_54e1768b846d819e1eaafee5d8c6ae169e';
        this.listIds = {
            sold: process.env.KLAVIYO_LIST_ID_SOLD || 'WgUpfq',
            rejected: process.env.KLAVIYO_LIST_ID_REJECTED || 'VNtnGd'
        };
        this.baseUrl = 'https://a.klaviyo.com/api';
        this.revision = '2025-10-15';
    }
    // Now automatically converts phone to E.164 format
    /**
   * Create or update a profile in Klaviyo
   * @param {Object} leadData - The lead data from your database
   * @returns {Promise<string>} - Profile ID
   */ async createOrUpdateProfile(leadData) {
        try {
            // Format phone number to E.164 format (required by Klaviyo)
            const formattedPhone = leadData.phone ? leadData.phone.startsWith('+') ? leadData.phone : `+1${leadData.phone.replace(/\D/g, '')}` : null;
            const profilePayload = {
                data: {
                    type: 'profile',
                    attributes: {
                        email: leadData.email,
                        phone_number: formattedPhone,
                        first_name: leadData.firstName,
                        last_name: leadData.lastName,
                        properties: {
                            Phone: leadData.phone,
                            CreditRating: leadData.creditRating || '',
                            // Address Information
                            Address: leadData.address1,
                            City: leadData.city,
                            State: leadData.state,
                            ZipCode: leadData.zipCode,
                            ResidenceType: leadData.residenceType,
                            MonthsAtAddress: leadData.monthsAtAddress,
                            // Financial Information
                            RequestedAmount: leadData.requestedAmount,
                            MonthlyIncome: leadData.monthlyIncome,
                            IncomeType: leadData.incomeType,
                            // Employment Information
                            EmployerName: leadData.employerName || '',
                            MonthsEmployed: leadData.monthsEmployed || 0,
                            PayFrequency: leadData.payFrequency || '',
                            // Banking Information
                            BankName: leadData.bankName || '',
                            BankAccountType: leadData.bankAccountType || '',
                            MonthsAtBank: leadData.monthsAtBank || 0,
                            // Additional Information
                            LoanPurpose: leadData.loanPurpose || '',
                            CreditRating: leadData.creditRating || '',
                            BestTimeToCall: leadData.bestTimeToCall || '',
                            // Date of Birth
                            DOB: `${leadData.dobMonth}/${leadData.dobDay}/${leadData.dobYear}`,
                            // Metadata
                            Source: 'LeadsMarket Form',
                            TrackingId: leadData.trackingId,
                            ClientIP: leadData.clientIP,
                            CreatedAt: leadData.createdAt || new Date().toISOString(),
                            UpdatedAt: leadData.updatedAt || new Date().toISOString()
                        }
                    }
                }
            };
            console.log('📤 Creating/Updating Klaviyo profile for:', leadData.email);
            const response = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].post(`${this.baseUrl}/profile-import/`, profilePayload, {
                headers: {
                    'Authorization': `Klaviyo-API-Key ${this.privateKey}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'revision': this.revision
                }
            });
            if (response.status === 200 || response.status === 201) {
                const profileId = response.data.data.id;
                console.log('✅ Profile created/updated successfully. Profile ID:', profileId);
                return profileId;
            } else {
                throw new Error(`Unexpected status code: ${response.status}`);
            }
        } catch (error) {
            console.error('❌ Error creating/updating Klaviyo profile:', error.response?.data || error.message);
            throw error;
        }
    }
    /**
   * Add a profile to a specific list
   * @param {string} profileId - The Klaviyo profile ID
   * @returns {Promise<boolean>}
   */ async addProfileToList(profileId, listId = null) {
        const targetListId = listId || this.listIds.sold; // Default to sold list
        try {
            const listPayload = {
                data: [
                    {
                        type: 'profile',
                        id: profileId
                    }
                ]
            };
            console.log('📤 Adding profile to list:', targetListId);
            const response = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].post(`${this.baseUrl}/lists/${targetListId}/relationships/profiles`, listPayload, {
                headers: {
                    'Authorization': `Klaviyo-API-Key ${this.privateKey}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'revision': this.revision
                }
            });
            if (response.status === 204) {
                console.log('✅ Profile added to list successfully');
                return true;
            } else {
                throw new Error(`Unexpected status code: ${response.status}`);
            }
        } catch (error) {
            console.error('❌ Error adding profile to list:', error.response?.data || error.message);
            throw error;
        }
    }
    /**
   * Sync lead to Klaviyo (create profile and add to list)
   * @param {Object} leadData - The lead data from your database
   * @returns {Promise<Object>} - Result object
   */ async syncLeadToKlaviyo(leadData, status = 'sold') {
        try {
            console.log('🚀 Starting Klaviyo sync for lead:', leadData.email);
            // Step 1: Create or update the profile
            const profileId = await this.createOrUpdateProfile(leadData);
            // Step 2: Add the profile to the list
            const listId = this.listIds[status] || this.listIds.sold;
            await this.addProfileToList(profileId, listId);
            console.log('✅ Lead successfully synced to Klaviyo');
            console.log(`✅ Lead synced to Klaviyo list: ${status} (${listId})`);
            return {
                success: true,
                profileId: profileId,
                message: 'Lead synced to Klaviyo successfully'
            };
        } catch (error) {
            console.error('❌ Klaviyo sync failed:', error.message);
            return {
                success: false,
                error: error.message,
                message: 'Failed to sync lead to Klaviyo'
            };
        }
    }
    /**
   * Bulk sync multiple leads to Klaviyo
   * @param {Array} leads - Array of lead data objects
   * @returns {Promise<Object>} - Summary of results
   */ async bulkSyncLeads(leads) {
        const results = {
            total: leads.length,
            successful: 0,
            failed: 0,
            errors: []
        };
        console.log(`🚀 Starting bulk sync of ${leads.length} leads...`);
        for (const lead of leads){
            try {
                await this.syncLeadToKlaviyo(lead);
                results.successful++;
            } catch (error) {
                results.failed++;
                results.errors.push({
                    email: lead.email,
                    error: error.message
                });
            }
            // Add a small delay to respect rate limits
            await new Promise((resolve)=>setTimeout(resolve, 100));
        }
        console.log(`✅ Bulk sync complete. Success: ${results.successful}, Failed: ${results.failed}`);
        return results;
    }
    /**
   * Track a custom event for a profile
   * @param {string} email - Profile email
   * @param {string} eventName - Event name
   * @param {Object} properties - Event properties
   * @returns {Promise<boolean>}
   */ async trackEvent(email, eventName, properties = {}) {
        try {
            const eventPayload = {
                data: {
                    type: 'event',
                    attributes: {
                        profile: {
                            email: email
                        },
                        metric: {
                            name: eventName
                        },
                        properties: properties,
                        time: new Date().toISOString()
                    }
                }
            };
            const response = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].post(`${this.baseUrl}/events/`, eventPayload, {
                headers: {
                    'Authorization': `Klaviyo-API-Key ${this.privateKey}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'revision': this.revision
                }
            });
            if (response.status === 202) {
                console.log(`✅ Event "${eventName}" tracked for ${email}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Error tracking event:', error.response?.data || error.message);
            return false;
        }
    }
}
const __TURBOPACK__default__export__ = new KlaviyoService();
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/models/Lead.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// models/Lead.js
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$klaviyoService$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/klaviyoService.js [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$klaviyoService$2e$js__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$klaviyoService$2e$js__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const leadSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    // Personal Information
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    // Date of Birth
    dobMonth: {
        type: Number,
        required: true
    },
    dobDay: {
        type: Number,
        required: true
    },
    dobYear: {
        type: Number,
        required: true
    },
    // Address
    address1: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    monthsAtAddress: {
        type: Number,
        required: true
    },
    residenceType: {
        type: String,
        required: true
    },
    // Financial
    requestedAmount: {
        type: Number,
        required: true
    },
    ssn: {
        type: String,
        required: true
    },
    monthlyIncome: {
        type: Number,
        required: true
    },
    incomeType: {
        type: String,
        required: true
    },
    // Employment
    employerName: String,
    monthsEmployed: Number,
    payFrequency: String,
    nextPayDate: Date,
    directDeposit: Boolean,
    // Banking
    bankName: String,
    bankABA: String,
    bankAccountNumber: String,
    bankAccountType: String,
    debitCard: Boolean,
    monthsAtBank: Number,
    // Drivers License
    driversLicense: String,
    driversLicenseState: String,
    // Additional
    bestTimeToCall: String,
    loanPurpose: String,
    creditRating: String,
    ownHome: Boolean,
    ownCar: Boolean,
    activeMilitary: Boolean,
    // Tracking
    clientIP: String,
    clientUserAgent: String,
    trackingId: String,
    note: String,
    // Klaviyo Integration
    klaviyoProfileId: String,
    klaviyoSyncStatus: {
        type: String,
        enum: [
            'pending',
            'synced',
            'failed'
        ],
        default: 'pending'
    },
    klaviyoSyncedAt: Date,
    klaviyoSyncError: String,
    // Metadata
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
// Middleware: Update the updatedAt field on save
leadSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});
// Middleware: Sync to Klaviyo after saving
leadSchema.post('save', async function(doc) {
    try {
        console.log('🔄 Post-save hook triggered for lead:', doc.email);
        // Only sync if not already synced or if data has changed
        if (doc.klaviyoSyncStatus !== 'synced' || doc.isModified()) {
            console.log('📤 Syncing lead to Klaviyo...');
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$klaviyoService$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"].syncLeadToKlaviyo({
                email: doc.email,
                phone: doc.phone,
                firstName: doc.firstName,
                lastName: doc.lastName,
                address1: doc.address1,
                city: doc.city,
                state: doc.state,
                zipCode: doc.zipCode,
                residenceType: doc.residenceType,
                monthsAtAddress: doc.monthsAtAddress,
                requestedAmount: doc.requestedAmount,
                monthlyIncome: doc.monthlyIncome,
                incomeType: doc.incomeType,
                employerName: doc.employerName,
                monthsEmployed: doc.monthsEmployed,
                payFrequency: doc.payFrequency,
                bankName: doc.bankName,
                bankAccountType: doc.bankAccountType,
                monthsAtBank: doc.monthsAtBank,
                loanPurpose: doc.loanPurpose,
                creditRating: doc.creditRating,
                bestTimeToCall: doc.bestTimeToCall,
                dobMonth: doc.dobMonth,
                dobDay: doc.dobDay,
                dobYear: doc.dobYear,
                trackingId: doc.trackingId,
                clientIP: doc.clientIP,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt
            });
            if (result.success) {
                // Update the document with Klaviyo sync status
                await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Lead').updateOne({
                    _id: doc._id
                }, {
                    $set: {
                        klaviyoProfileId: result.profileId,
                        klaviyoSyncStatus: 'synced',
                        klaviyoSyncedAt: new Date(),
                        klaviyoSyncError: null
                    }
                });
                console.log('✅ Lead synced to Klaviyo successfully');
            } else {
                // Update with error status
                await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Lead').updateOne({
                    _id: doc._id
                }, {
                    $set: {
                        klaviyoSyncStatus: 'failed',
                        klaviyoSyncError: result.error
                    }
                });
                console.error('❌ Failed to sync lead to Klaviyo:', result.error);
            }
        }
    } catch (error) {
        console.error('❌ Error in Klaviyo sync hook:', error.message);
    // Don't throw error to prevent lead save from failing
    }
});
// Middleware: Sync to Klaviyo after update
leadSchema.post('findOneAndUpdate', async function(doc) {
    if (doc) {
        try {
            console.log('🔄 Post-update hook triggered for lead:', doc.email);
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$klaviyoService$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"].syncLeadToKlaviyo({
                email: doc.email,
                phone: doc.phone,
                firstName: doc.firstName,
                lastName: doc.lastName,
                address1: doc.address1,
                city: doc.city,
                state: doc.state,
                zipCode: doc.zipCode,
                residenceType: doc.residenceType,
                monthsAtAddress: doc.monthsAtAddress,
                requestedAmount: doc.requestedAmount,
                monthlyIncome: doc.monthlyIncome,
                incomeType: doc.incomeType,
                employerName: doc.employerName,
                monthsEmployed: doc.monthsEmployed,
                payFrequency: doc.payFrequency,
                bankName: doc.bankName,
                bankAccountType: doc.bankAccountType,
                monthsAtBank: doc.monthsAtBank,
                loanPurpose: doc.loanPurpose,
                creditRating: doc.creditRating,
                bestTimeToCall: doc.bestTimeToCall,
                dobMonth: doc.dobMonth,
                dobDay: doc.dobDay,
                dobYear: doc.dobYear,
                trackingId: doc.trackingId,
                clientIP: doc.clientIP,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt
            });
            if (result.success) {
                await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Lead').updateOne({
                    _id: doc._id
                }, {
                    $set: {
                        klaviyoProfileId: result.profileId,
                        klaviyoSyncStatus: 'synced',
                        klaviyoSyncedAt: new Date(),
                        klaviyoSyncError: null
                    }
                });
                console.log('✅ Lead update synced to Klaviyo successfully');
            } else {
                await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Lead').updateOne({
                    _id: doc._id
                }, {
                    $set: {
                        klaviyoSyncStatus: 'failed',
                        klaviyoSyncError: result.error
                    }
                });
                console.error('❌ Failed to sync lead update to Klaviyo:', result.error);
            }
        } catch (error) {
            console.error('❌ Error in Klaviyo update sync hook:', error.message);
        }
    }
});
// Static method: Manual sync for existing leads
leadSchema.statics.syncToKlaviyo = async function(leadId) {
    try {
        const lead = await this.findById(leadId);
        if (!lead) {
            throw new Error('Lead not found');
        }
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$klaviyoService$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"].syncLeadToKlaviyo({
            email: lead.email,
            phone: lead.phone,
            firstName: lead.firstName,
            lastName: lead.lastName,
            address1: lead.address1,
            city: lead.city,
            state: lead.state,
            zipCode: lead.zipCode,
            residenceType: lead.residenceType,
            monthsAtAddress: lead.monthsAtAddress,
            requestedAmount: lead.requestedAmount,
            monthlyIncome: lead.monthlyIncome,
            incomeType: lead.incomeType,
            employerName: lead.employerName,
            monthsEmployed: lead.monthsEmployed,
            payFrequency: lead.payFrequency,
            bankName: lead.bankName,
            bankAccountType: lead.bankAccountType,
            monthsAtBank: lead.monthsAtBank,
            loanPurpose: lead.loanPurpose,
            creditRating: lead.creditRating,
            bestTimeToCall: lead.bestTimeToCall,
            dobMonth: lead.dobMonth,
            dobDay: lead.dobDay,
            dobYear: lead.dobYear,
            trackingId: lead.trackingId,
            clientIP: lead.clientIP,
            createdAt: lead.createdAt,
            updatedAt: lead.updatedAt
        });
        if (result.success) {
            lead.klaviyoProfileId = result.profileId;
            lead.klaviyoSyncStatus = 'synced';
            lead.klaviyoSyncedAt = new Date();
            lead.klaviyoSyncError = null;
            await lead.save();
        }
        return result;
    } catch (error) {
        console.error('Error in manual Klaviyo sync:', error);
        throw error;
    }
};
// Static method: Bulk sync all unsynced leads
leadSchema.statics.syncAllToKlaviyo = async function() {
    try {
        const unsyncedLeads = await this.find({
            $or: [
                {
                    klaviyoSyncStatus: 'pending'
                },
                {
                    klaviyoSyncStatus: 'failed'
                },
                {
                    klaviyoSyncStatus: {
                        $exists: false
                    }
                }
            ]
        });
        console.log(`Found ${unsyncedLeads.length} leads to sync`);
        const leadsData = unsyncedLeads.map((lead)=>({
                _id: lead._id,
                email: lead.email,
                phone: lead.phone,
                firstName: lead.firstName,
                lastName: lead.lastName,
                address1: lead.address1,
                city: lead.city,
                state: lead.state,
                zipCode: lead.zipCode,
                residenceType: lead.residenceType,
                monthsAtAddress: lead.monthsAtAddress,
                requestedAmount: lead.requestedAmount,
                monthlyIncome: lead.monthlyIncome,
                incomeType: lead.incomeType,
                employerName: lead.employerName,
                monthsEmployed: lead.monthsEmployed,
                payFrequency: lead.payFrequency,
                bankName: lead.bankName,
                bankAccountType: lead.bankAccountType,
                monthsAtBank: lead.monthsAtBank,
                loanPurpose: lead.loanPurpose,
                creditRating: lead.creditRating,
                bestTimeToCall: lead.bestTimeToCall,
                dobMonth: lead.dobMonth,
                dobDay: lead.dobDay,
                dobYear: lead.dobYear,
                trackingId: lead.trackingId,
                clientIP: lead.clientIP,
                createdAt: lead.createdAt,
                updatedAt: lead.updatedAt
            }));
        const results = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$klaviyoService$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"].bulkSyncLeads(leadsData);
        // Update sync status for all leads
        for (const leadData of leadsData){
            await this.updateOne({
                _id: leadData._id
            }, {
                $set: {
                    klaviyoSyncStatus: 'synced',
                    klaviyoSyncedAt: new Date()
                }
            });
        }
        return results;
    } catch (error) {
        console.error('Error in bulk Klaviyo sync:', error);
        throw error;
    }
};
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Lead || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Lead', leadSchema);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/models/SoldLead.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// models/SoldLead.js
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const soldLeadSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    leadId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: 'Lead',
        required: true
    },
    result: {
        type: String,
        required: true
    },
    campaignId: String,
    leadsMarketLeadId: String,
    price: Number,
    redirectUrl: String,
    // FIXED: renamed from "errors"
    lmErrors: [
        {
            field: String,
            value: String,
            description: String
        }
    ],
    messages: [
        String
    ],
    rawResponse: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.Mixed,
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.SoldLead || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('SoldLead', soldLeadSchema);
}),
"[externals]/nodemailer [external] (nodemailer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("nodemailer", () => require("nodemailer"));

module.exports = mod;
}),
"[project]/services/emailService.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// services/emailService.js
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$nodemailer__$5b$external$5d$__$28$nodemailer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/nodemailer [external] (nodemailer, cjs)");
;
class EmailService {
    constructor(){
        this.transporter = __TURBOPACK__imported__module__$5b$externals$5d2f$nodemailer__$5b$external$5d$__$28$nodemailer$2c$__cjs$29$__["default"].createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER || 'connect@radcred.com',
                pass: process.env.SMTP_PASS || 'Connect@0205'
            }
        });
        this.fromEmail = process.env.EMAIL_FROM || 'connect@radcred.com';
    }
    /**
   * Send email to user when lead is SOLD (Result 1)
   */ async sendSoldEmail(leadData) {
        try {
            const mailOptions = {
                from: `"RadCred" <${this.fromEmail}>`,
                to: leadData.email,
                subject: 'Congratulations - You Found a Match!',
                html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .email-box { background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .logo-section { background: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 3px solid #2563eb; }
              .content { padding: 40px 30px; }
              .congrats { color: #059669; font-size: 24px; font-weight: bold; margin: 0 0 20px 0; }
              .footer { background: #1f2937; color: #9ca3af; padding: 25px; text-align: center; font-size: 12px; }
              .footer a { color: #60a5fa; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="email-box">
                <!-- Logo Section -->
                <div class="logo-section">
                  <a href="https://radcred.com/" target="_blank">
                    <img src="https://radcred.com/media/2022/11/RadCred-Logo-Small-Size.png" alt="RadCred Logo" width="300" style="max-width: 100%; height: auto;" />
                  </a>
                </div>
                
                <!-- Main Content -->
                <div class="content">
                  <p style="font-size: 18px; margin: 0 0 25px 0;">Hi <strong>${leadData.firstName} ${leadData.lastName}</strong>,</p>
                  
                  <p class="congrats">🎉 Congratulations!</p>
                  
                  <p>Your application has been successfully matched with a lender. You're all set to move forward with your loan.</p>
                  
                  <p>If you need additional funds down the road, visit <a href="https://radcred.com/" style="color: #2563eb; text-decoration: none; font-weight: 600;">RadCred</a> for fast, fair loans.</p>
                  
                  <p style="margin-top: 30px;">
                    Best of luck,<br>
                    <strong>RadCred Team</strong>
                  </p>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                  <p style="margin: 0 0 10px 0;">
                    <a href="https://radcred.com/">RadCred.com</a> | 
                    <a href="https://radcred.com/privacy-policy/">Privacy Policy</a> | 
                    <a href="https://radcred.com/terms-of-use/">Terms of Use</a>
                  </p>
                  <p style="margin: 0;">© ${new Date().getFullYear()} RadCred. All rights reserved.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
            };
            const result = await this.transporter.sendMail(mailOptions);
            console.log('✅ Sold confirmation email sent to:', leadData.email);
            return {
                success: true,
                messageId: result.messageId
            };
        } catch (error) {
            console.error('❌ Error sending sold email:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }
    /**
   * Send email to user when lead is REJECTED (Result 2)
   */ async sendRejectedEmail(leadData, offerUrl) {
        try {
            const mailOptions = {
                from: `"RadCred" <${this.fromEmail}>`,
                to: leadData.email,
                subject: 'We Found a Match! Your Top Loan Option is Ready',
                html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .email-box { background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .logo-section { background: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 3px solid #2563eb; }
              .content { padding: 40px 30px; }
              .highlight { color: #2563eb; font-size: 20px; font-weight: bold; margin: 20px 0; }
              .btn { display: inline-block; background: #2563eb; color: #ffffff !important; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 25px 0; }
              .btn:hover { background: #1d4ed8; }
              .cta-section { text-align: center; margin: 30px 0; }
              .footer { background: #1f2937; color: #9ca3af; padding: 25px; text-align: center; font-size: 12px; }
              .footer a { color: #60a5fa; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="email-box">
                <!-- Logo Section -->
                <div class="logo-section">
                  <a href="https://radcred.com/" target="_blank">
                    <img src="https://radcred.com/media/2022/11/RadCred-Logo-Small-Size.png" alt="RadCred Logo" width="300" style="max-width: 100%; height: auto;" />
                  </a>
                </div>
                
                <!-- Main Content -->
                <div class="content">
                  <p style="font-size: 18px; margin: 0 0 25px 0;">Hi <strong>${leadData.firstName} ${leadData.lastName}</strong>,</p>
                  
                  <p class="highlight">Great news! We've found a perfect match.</p>
                  
                  <p>Based on your application, we identified the lender offering the best terms for you. Your personalized loan offer is ready for review.</p>
                  
                  <p>Click below to see your top match and complete your application:</p>
                  
                  <div class="cta-section">
                    <a href="${offerUrl}" class="btn" target="_blank">View Your Loan Offer →</a>
                  </div>
                  
                  <p><strong>This lender is ready to move fast and get you the cash you need.</strong></p>
                  
                  <p style="color: #6b7280; font-size: 14px;">Need help? Reply to this email or contact us.</p>
                  
                  <p style="margin-top: 30px;">
                    Cheers,<br>
                    <strong>RadCred Team</strong>
                  </p>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                  <p style="margin: 0 0 10px 0;">
                    <a href="https://radcred.com/">RadCred.com</a> | 
                    <a href="https://radcred.com/privacy-policy/">Privacy Policy</a> | 
                    <a href="https://radcred.com/terms-of-use/">Terms of Use</a>
                  </p>
                  <p style="margin: 0;">© ${new Date().getFullYear()} RadCred. All rights reserved.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
            };
            const result = await this.transporter.sendMail(mailOptions);
            console.log('✅ Rejected offer email sent to:', leadData.email);
            return {
                success: true,
                messageId: result.messageId
            };
        } catch (error) {
            console.error('❌ Error sending rejected email:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }
    /**
   * Send email for SOLD lead (Result 1)
   */ async sendSoldLeadEmails(leadData) {
        console.log('📧 Sending SOLD lead email...');
        return await this.sendSoldEmail(leadData);
    }
    /**
   * Send email for REJECTED lead (Result 2)
   */ async sendRejectedLeadEmail(leadData, offerUrl) {
        console.log('📧 Sending REJECTED lead email...');
        return await this.sendRejectedEmail(leadData, offerUrl);
    }
}
const __TURBOPACK__default__export__ = new EmailService();
}),
"[project]/pages/api/lead.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// pages/api/lead.js - FIXED VERSION
// Only saves to MongoDB on successful results (1, 2), NOT on errors (3, 4)
__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$config$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/config/db.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Lead$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Lead.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$SoldLead$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/SoldLead.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$klaviyoService$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/klaviyoService.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$emailService$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/emailService.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Lead$2e$js__$5b$api$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$klaviyoService$2e$js__$5b$api$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Lead$2e$js__$5b$api$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$klaviyoService$2e$js__$5b$api$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$config$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"])();
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
            ...formData.testResult && {
                TestResult: formData.testResult
            }
        };
        console.log('📤 Submitting to LeadsMarket...');
        console.log('Payload:', JSON.stringify(leadsMarketPayload, null, 2));
        // 2. Submit to LeadsMarket API FIRST
        const response = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].post('https://api.leadsmarket.com/post/data.aspx', leadsMarketPayload, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 120000
        });
        const apiResponse = response.data;
        console.log('✅ LeadsMarket Response:', apiResponse);
        // 3. Parse errors if they exist
        let parsedErrors = [];
        if (apiResponse.Errors) {
            if (Array.isArray(apiResponse.Errors)) {
                parsedErrors = apiResponse.Errors.map((err)=>({
                        field: err.Field || '',
                        value: err.Value || '',
                        description: err.Description || ''
                    }));
            } else if (apiResponse.Errors.Error) {
                const errors = Array.isArray(apiResponse.Errors.Error) ? apiResponse.Errors.Error : [
                    apiResponse.Errors.Error
                ];
                parsedErrors = errors.map((err)=>({
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
                parsedMessages = Array.isArray(apiResponse.Messages.Message) ? apiResponse.Messages.Message : [
                    apiResponse.Messages.Message
                ];
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
        const lead = new __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Lead$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"]({
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
        const soldLead = new __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$SoldLead$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"]({
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
                const klaviyoResult = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$klaviyoService$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"].syncLeadToKlaviyo(klaviyoLeadData, 'sold');
                console.log('✅ Synced to Klaviyo SOLD list:', klaviyoResult);
            } catch (klaviyoError) {
                console.error('❌ Klaviyo sync error (sold):', klaviyoError.message);
            }
            // Send SOLD email to user
            try {
                const emailData = {
                    firstName: formData.fName,
                    lastName: formData.lName,
                    email: formData.email
                };
                await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$emailService$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"].sendSoldLeadEmails(emailData);
                console.log('✅ Sold lead email sent');
            } catch (emailError) {
                console.error('❌ Email send error:', emailError.message);
            }
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
                const klaviyoResult = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$klaviyoService$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"].syncLeadToKlaviyo(klaviyoLeadData, 'rejected');
                console.log('✅ Synced to Klaviyo REJECTED list:', klaviyoResult);
            } catch (klaviyoError) {
                console.error('❌ Klaviyo sync error (rejected):', klaviyoError.message);
            // Don't block the response if Klaviyo sync fails
            }
            // Send REJECTED email with offer URL
            try {
                const emailData = {
                    firstName: formData.fName,
                    lastName: formData.lName,
                    email: formData.email
                };
                const offerUrl = 'https://afflat3d3.com/trk/lnk/786BE43A-66BF-4957-B2D1-CEF4DF250208/?o=15451&c=918273&a=516670&k=340953338760B4DF749BD4BFBB0C1B83&l=17035&s1=radcredapplynow';
                await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$emailService$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"].sendRejectedLeadEmail(emailData, offerUrl);
                console.log('✅ Rejected lead email sent');
            } catch (emailError) {
                console.error('❌ Email send error:', emailError.message);
            }
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
        driversLicenseState: String(f.driversLicenseState || "").trim().toUpperCase().slice(0, 2)
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c45d882b._.js.map