/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AppLayout } from "./components/layout/app-layout"
import { Dashboard } from "./pages/dashboard"
import { Pipeline } from "./pages/pipeline"
import { Contacts } from "./pages/contacts"
import { Companies } from "./pages/companies"
import { ProposalsList } from "./pages/proposals/index"
import { NewProposal } from "./pages/proposals/new"
import { Activities } from "./pages/activities"
import { Reports } from "./pages/reports"
import { Settings } from "./pages/settings"
import { Support } from "./pages/support"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="companies" element={<Companies />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="proposals" element={<ProposalsList />} />
          <Route path="proposals/new" element={<NewProposal />} />
          <Route path="activities" element={<Activities />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="support" element={<Support />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
