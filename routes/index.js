const AdminAuthRoutes = require('./AdminAuthRoutes.js');
const roleRoutes = require('./roleRoutes.js');
const moduleRoutes = require('./moduleRoutes.js');
const roleModuleRoutes = require('./roleModuleRoutes.js');

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
const VendorRoutes = require('./vendorRoutes.js');

module.exports = {
    AdminAuthRoutes,
    roleRoutes,
    moduleRoutes,
    subjectRoutes,
    SubSubjectRoutes,
    ChieldSubjectRoutes,
    QuestionRoutes,
    removeDataRoutes,
    roleModuleRoutes,
    adminRoutes,
    BookRoutes,
    ChapterRoutes,
    StudentRoutes,
    TutorRoutes,
    FaqRoutes,
    VendorRoutes
}