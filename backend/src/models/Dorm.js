// backend/src/models/Dorm.js
import mongoose from "mongoose";

const DormSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // NEW: Detailed address breakdown - this replaces location eventually
    address: {
      addressLine1: {
        type: String,
        required: true, // Set to true once you remove old location field
      },
      // Thailand-specific address fields
      subDistrict: {
        type: String,
        default: null,
      },
      district: {
        type: String,
        required: false,
      },
      province: {
        type: String,
        default: null,
      },
      zipCode: {
        type: String,
        default: null,
      },
      country: {
        type: String,
        default: "Thailand",
      },
    },
    // NEW: Geographic coordinates for map functionality
    latitude: {
      type: Number,
      min: -90,
      max: 90,
      default: null,
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
      default: null,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    image_url: {
      type: String,
      default: null,
    },
    // NEW: Support for multiple images
    images: [{
      type: String,
    }],
    description: {
      type: String,
      default: null,
    },
    availibility: {
      type: Boolean,
      default: true,
    },
    // Facilities as an array of strings
    facilities: [{
      type: String,
    }],
    price: {
      type: Number,
      default: null,
    },
    insurance_policy: {
      type: Number,
      default: null,
    },
    contract_duration: {
      type: Number,
      default: 12,
      comment: 'Default contract duration in months',
    },
    // Contact information
    contact_gmail: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
    },
    contact_line: {
      type: String,
      default: null,
      trim: true,
    },
    contact_facebook: {
      type: String,
      default: null,
      trim: true,
    },
    contact_phone: {
      type: String,
      default: null,
      trim: true,
    },
    Water_fee: {
      type: Number,
      default: null,
    },
    Electricity_fee: {
      type: Number,
      default: null,
    },
    waterBillingType: {
      type: String,
      enum: ['per-month', 'per-unit'],
      default: 'per-month',
    },
    electricityBillingType: {
      type: String,
      enum: ['per-month', 'per-unit'],
      default: 'per-unit',
    },
    admin_id: {
      type: Number,
      required: true,
    },
    // NEW: Soft delete flag
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "dorms",
  }
);

// Indexes for performance
DormSchema.index({ latitude: 1, longitude: 1 });
DormSchema.index({ admin_id: 1 });
DormSchema.index({ availibility: 1, isActive: 1 });

// Virtual property to get address as a single string
DormSchema.virtual('fullAddress').get(function() {
  // If new address object exists, use it
  if (this.address?.addressLine1) {
    const parts = [
      this.address.addressLine1,
      this.address.subDistrict,
      this.address.district,
      this.address.province,
      this.address.zipCode,
      this.address.country,
    ].filter(Boolean);
    return parts.join(', ');
  }
  
  // Fallback to old location field
  return this.location || 'Address not set';
});

// Method: Calculate distance from coordinates (in kilometers)
DormSchema.methods.getDistanceFrom = function(lat, lng) {
  if (!this.latitude || !this.longitude) {
    return null;
  }
  
  const R = 6371; // Earth's radius in km
  const dLat = (lat - this.latitude) * Math.PI / 180;
  const dLon = (lng - this.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.latitude * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Method: Check if dorm has map coordinates
DormSchema.methods.hasCoordinates = function() {
  return this.latitude !== null && this.longitude !== null;
};

// Static method: Find dorms near a location
DormSchema.statics.findNearby = async function(latitude, longitude, radiusInKm = 5) {
  const dorms = await this.find({ 
    isActive: true,
    availibility: true,
    latitude: { $ne: null },
    longitude: { $ne: null }
  });

  const dormsWithDistance = dorms
    .map(dorm => ({
      ...dorm.toObject(),
      distance: dorm.getDistanceFrom(latitude, longitude)
    }))
    .filter(dorm => dorm.distance <= radiusInKm)
    .sort((a, b) => a.distance - b.distance);

  return dormsWithDistance;
};

// Pre-save middleware: Sync old location field with new address
DormSchema.pre('save', function(next) {
  // If address exists, update the old location field for backwards compatibility
  if (this.address?.addressLine1) {
    this.location = this.fullAddress;
  }
  next();
});

// Include virtuals in JSON/Object output
DormSchema.set('toJSON', { virtuals: true });
DormSchema.set('toObject', { virtuals: true });

export const Dorm = mongoose.model("Dorm", DormSchema);