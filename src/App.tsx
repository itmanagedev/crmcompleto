/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "./components/layout/app-layout"
import { ProtectedRoute } from "./components/layout/protected-route"
import { Dashboard } from "./pages/dashboard"
import { Pipeline } from "./pages/pipeline"
import { ContactsList } from "./pages/contacts/index"
import { ContactProfile } from "./pages/contacts/[id]"
import { CompaniesList } from "./pages/companies/index"
import { CompanyProfile } from "./pages/companies/[id]"
import { ProposalsList } from "./pages/proposals/index"
import { NewProposal } from "./pages/proposals/new"
import { Activities } from "./pages/activities"
import { Reports } from "./pages/reports"
import { Support } from "./pages/support"

// Auth Pages
import { Login } from "./pages/auth/login"
import { ForgotPassword } from "./pages/auth/forgot-password"
import { ResetPassword } from "./pages/auth/reset-password"

// Settings Pages
import { SettingsLayout } from "./pages/settings"
import { ProfileSettings } from "./pages/settings/profile"
import { CompanySettings } from "./pages/settings/company"
import { PipelineSettings } from "./pages/settings/pipeline"
import { CustomFieldsSettings } from "./pages/settings/custom-fields"
import { UsersSettings } from "./pages/settings/users"
import { IntegrationsSettings } from "./pages/settings/integrations"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="contacts" element={<ContactsList />} />
            <Route path="contacts/:id" element={<ContactProfile />} />
            <Route path="companies" element={<CompaniesList />} />
            <Route path="companies/:id" element={<CompanyProfile />} />
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="proposals" element={<ProposalsList />} />
            <Route path="proposals/new" element={<NewProposal />} />
            <Route path="activities" element={<Activities />} />
            <Route path="reports" element={<Reports />} />
            
            {/* Settings */}
            <Route path="settings" element={<SettingsLayout />}>
              <Route index element={<Navigate to="/settings/profile" replace />} />
              <Route path="profile" element={<ProfileSettings />} />
              <Route path="company" element={<CompanySettings />} />
              <Route path="pipeline" element={<PipelineSettings />} />
              <Route path="custom-fields" element={<CustomFieldsSettings />} />
              <Route path="users" element={<UsersSettings />} />
              <Route path="integrations" element={<IntegrationsSettings />} />
            </Route>

            <Route path="support" element={<Support />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
