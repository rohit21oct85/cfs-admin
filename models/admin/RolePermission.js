const mongoose = require('mongoose');

const RolePermissionSchema = new mongoose.Schema({
      email: {
            type: String
      },
      role: {
            type: Number
      },
      role_name:{
            type: String
      },
      role_id:{
            type: String,
      },
      module_id: {
            type: String,
      },
      module_name: {
            type: String,
      },
      module_slug: {
            type: String,
      },
      module_icon: {
            type: String,
      },
      method_name: {
            type: String,
      },
      status:{
            type: Boolean,
            required: true,
            default: true
      },
      create_at: {
            type: Date,
            default: Date.now
      }
});

module.exports = mongoose.model('RolePermission', RolePermissionSchema);