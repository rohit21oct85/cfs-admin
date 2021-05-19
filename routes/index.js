const AdminAuthRoutes = require('./AdminAuthRoutes.js');
const roleRoutes = require('./roleRoutes.js');
const moduleRoutes = require('./moduleRoutes.js');
const rolePermissionRoutes = require('./rolePermissionRoutes.js');
const userPermissionRoutes = require('./userPermissionRoutes.js');
const permissionGroupRoutes = require('./permissionGroupRoutes.js');
const adminRoutes = require('./adminRoutes.js');
const subjectRoutes = require('./subjectRoutes.js');
const SubSubjectRoutes = require('./SubSubjectRoutes.js');
const ChieldSubjectRoutes = require('./ChieldSubjectRoutes.js');
const QuestionRoutes = require('./QuestionRoutes.js');
const removeDataRoutes = require('./RemoveDataRoutes.js');
const BookRoutes = require('./BookRoutes.js');
const ChapterRoutes = require('./ChapterRoutes.js');
const StudentRoutes = require('./StudentRoutes.js');
const TutorRoutes = require('./TutorRoutes.js');
const FaqRoutes = require('./FaqRoutes.js');

module.exports = {
    AdminAuthRoutes,
    roleRoutes,
    moduleRoutes,
    permissionGroupRoutes,
    subjectRoutes,
    SubSubjectRoutes,
    ChieldSubjectRoutes,
    QuestionRoutes,
    removeDataRoutes,
    rolePermissionRoutes,
    userPermissionRoutes,
    permissionGroupRoutes,
    adminRoutes,
    BookRoutes,
    ChapterRoutes,
    StudentRoutes,
    TutorRoutes,
    FaqRoutes
}