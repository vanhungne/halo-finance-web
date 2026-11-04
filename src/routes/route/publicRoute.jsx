import ROUTES from "..";
import HomePage from "../../pages/HomePage";
import PrivacyPolicyPage from "../../pages/public/PrivacyPolicyPage";
import TermsOfServicePage from "../../pages/public/TermsOfServicePage";
import DeleteAccountRequestPage from "../../pages/public/DeleteAccountRequestPage";
import { lazy, Suspense } from 'react';

const ToolsPage = lazy(() => import('../../pages/tools/ToolsPage'));
const GroupSplitPage = lazy(() => import('../../pages/groupSplit/GroupSplitPage'));

const publicRoute = [
    { path: '/tools/*', element: <Suspense fallback={<p>Đang mở công cụ…</p>}><ToolsPage /></Suspense> },
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
    {
        path: ROUTES.GROUP_SPLIT_PAGE,
        element: (
            <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-sm text-slate-500">Đang tải Split Bills...</div>}>
                <GroupSplitPage />
            </Suspense>
        ),
    },
    {
        path: ROUTES.GROUP_SPLIT_DETAIL_PAGE,
        element: (
            <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-sm text-slate-500">Đang tải Split Bills...</div>}>
                <GroupSplitPage />
            </Suspense>
        ),
    },
    {
        path: '/chia-tien-nhom',
        element: (
            <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-sm text-slate-500">Đang tải Split Bills...</div>}>
                <GroupSplitPage />
            </Suspense>
        ),
    },
]

export default publicRoute;
