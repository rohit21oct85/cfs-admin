const AdminAuthRoutes = require('./AdminAuthRoutes.js');
const roleRoutes = require('./roleRoutes.js');
const permissionRoutes = require('./permissionRoutes.js');
const permissionGroupRoutes = require('./permissionGroupRoutes.js');
const adminRoutes = require('./adminRoutes.js');
const subjectRoutes = require('./subjectRoutes.js');
const SubSubjectRoutes = require('./SubSubjectRoutes.js');

const removeDataRoutes = require('./RemoveDataRoutes.js');


module.exports = {
   AdminAuthRoutes,
   roleRoutes,
   permissionRoutes,
   permissionGroupRoutes,
   adminRoutes,
   subjectRoutes,
   SubSubjectRoutes,
   removeDataRoutes
}