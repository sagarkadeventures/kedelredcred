// models/SoldLead.js
import mongoose from 'mongoose';

const soldLeadSchema = new mongoose.Schema({
  leadId: { 
    type: mongoose.Schema.Types.ObjectId, 
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
  lmErrors: [{
    field: String,
    value: String,
    description: String
  }],

  messages: [String],

  rawResponse: mongoose.Schema.Types.Mixed,

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.SoldLead || mongoose.model('SoldLead', soldLeadSchema);
