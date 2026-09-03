import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Pages/MainLayout/MainLayout";
import App from "../App";
import DeliveryDetails from "../Pages/DeliveryDetails/DeliveryDetails";
import Transaction from "../Pages/Transaction/Transaction";
import UserManagement from "../Pages/UserManagement/UserMangment";
import Profile from "../Pages/Profile/Profile";
import TremsCondition from "../Pages/TremsCondition/TremsCondition";
import PrivacyPolicy from "../Pages/PrivacyPolicy/PrivacyPolicy";
import Drivers from "../Pages/Drivers/Drivers";
import FAQ from "../Pages/FAQ/FAQ";
import ProfileUpdatePage from "../Pages/ProfileUpdatePage/ProfileUpdatePage";
import Login from "../Pages/Login/Login";
import ForgetPassword from "../Pages/ForgetPassword/ForgetPassword";
import Otp from "../Pages/Otp/Otp";
import UpdatePassword from "../Pages/UpdatePassword/UpdatePassword";
import Notification from "../Pages/Notification/Notification";
import AuctionManagement from "../Pages/AuctionManagement/AuctionManagement";
import AuctionDetails from "../Pages/AuctionDetails/AuctionDetails";
import PartnerManagement from "../Pages/PartnerManagement/PartnerManagement";
import CategoryManagement from "../Pages/CategoryManagement/CategoryManagement";
import VariableManagement from "../Pages/VariableManagement/VariableManagement";
import ReviewConversation from "../Pages/ReviewConversation/ReviewConversation";
import BankTransfer from "../Pages/BankTransfer/BankTransfer";
import MakeAdmin from "../Pages/MakeAdmin/MakeAdmin";
import PartnerDetails from "../Pages/PartnerDetails/PartnerDetails";
import TransactionDetails from "../Pages/TransactionDetails/TransactionDetails";
import FileClaim from "../Pages/FileClaim/FileClaim";
import Ticket from "../Pages/Ticket/Ticket";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import SupervisionDashboard from "../Pages/SupervisionDashboard/SupervisionDashboard";
import CompletedTask from "../Pages/CompletedTask/CompletedTask";
import ActiveAdminsPage from "../Pages/ActiveAdminsPage/ActiveAdminsPage";
import ActivityLog from "../Pages/ActivityLog/ActivityLog";
import AuditDashboard from "../Pages/AuditDashboard/AuditDashboard";
import MostEventCreateUser from "../Pages/MostEventCreateUser/MostEventCreateUser";
import MostTaskCompleteAdmins from "../Pages/MostTaskCompleteAdmins/MostTaskCompleteAdmins";
import ContactUs from "../Pages/ContactUs/ContactUs";

export const router = createBrowserRouter([
    {
        path: '/',
        element: 
        <PrivateRoutes>
            <MainLayout />
         </PrivateRoutes>,
        children: [
            {
                path: '/',
                element: <App />
            },
            {
                path: '/delivery-details',
                element: <DeliveryDetails />
            },
            {
                path: '/auction-management',
                element: <AuctionManagement />
            },
            {
                path: '/auction-management/auction-details/:id',
                element: <AuctionDetails />
            },
            {
                path: '/transaction',
                element: <Transaction />
            },
            {
                path: '/transaction/:id',
                element: <TransactionDetails />
            },
            {
                path: '/user-management',
                element: <UserManagement />
            },
            {
                path: '/partner-management',
                element: <PartnerManagement />
            },
            {
                path: '/partner-management/:id',
                element: <PartnerDetails />
            },
            {
                path: '/category-management',
                element: <CategoryManagement />
            },
            {
                path: '/variable-management',
                element: <VariableManagement />
            },
            {
                path: '/super-vision-dashboard',
                element: <SupervisionDashboard/>
            },
            {
                path: '/task-completed',
                element: <CompletedTask/>
            },
            {
                path: '/active-admins',
                element: <ActiveAdminsPage/>
            },
            {
                path: '/most-event-create-users',
                element: <MostEventCreateUser/>
            },
            {
                path: '/audit-dashboard',
                element: <AuditDashboard/>
            },
            {
                path: '/most-task-complete-admins',
                element: <MostTaskCompleteAdmins/>
            },

            {
                path: '/review-conversation',
                element: <ReviewConversation />
            },
            {
                path: '/activity-log',
                element: <ActivityLog/>
            },
            {
                path: '/bank-transfer',
                element: <BankTransfer />
            },
            {
                path: '/make-admin',
                element: <MakeAdmin />
            },
           
            {
                path: '/drivers',
                element: <Drivers />
            },
            {
                path: '/profile',
                element: <Profile />
            },
            {
                path: '/terms-condition',
                element: <TremsCondition />
            },
            {
                path: '/faq',
                element: <FAQ />
            },
            {
                path: '/profile-update-request',
                element: <ProfileUpdatePage />
            },
            {
                path: '/privacy-policy',
                element: <PrivacyPolicy />
            },
            {
                path : "/notification",
                element : <Notification/>
            },
            {
                path : "/file-claim",
                element : <FileClaim/>
            },
            {
                path : "/contact-us",
                element : <ContactUs/>
            },
            {
                path : "/ticket",
                element : <Ticket/>
            },


        ],


    },
    {
        path: '/auth/login',
        element: <PublicRoutes><Login /></PublicRoutes>
    },
    {
        path: '/auth/forgot-password',
        element: <PublicRoutes><ForgetPassword /></PublicRoutes>
    },
    {
        path: '/auth/otp',
        element: <PublicRoutes><Otp /></PublicRoutes>
    },
    {
        path: '/auth/update-password',
        element: <PublicRoutes><UpdatePassword /></PublicRoutes>
    },
    
])