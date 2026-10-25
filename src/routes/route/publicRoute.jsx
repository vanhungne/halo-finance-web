import ROUTES from "..";
import HomePage from "../../pages/HomePage";
import PrivacyPolicyPage from "../../pages/public/PrivacyPolicyPage";
import TermsOfServicePage from "../../pages/public/TermsOfServicePage";
import DeleteAccountRequestPage from "../../pages/public/DeleteAccountRequestPage";

const publicRoute = [
    {
        path: ROUTES.HOME_PAGE,
        element: <HomePage />,
    },
    {
        path: ROUTES.PRIVACY_PAGE,
        element: <PrivacyPolicyPage />,
    },
    {
        path: ROUTES.TERMS_PAGE,
        element: <TermsOfServicePage />,
    },
    {
        path: ROUTES.DELETE_ACCOUNT_PAGE,
        element: <DeleteAccountRequestPage />,
    },
]

export default publicRoute;