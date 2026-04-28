import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Loading from '@/components/Common/Loading'

const StarMapPage = lazy(() => import('@/pages/StarMap'))
const LearnPage = lazy(() => import('@/pages/Learn'))
const CertificatePage = lazy(() => import('@/pages/Certificate'))
const ProfilePage = lazy(() => import('@/pages/Profile'))
const EnterprisePage = lazy(() => import('@/pages/Enterprise'))
const StartupPage = lazy(() => import('@/pages/Startup'))
const AuthPage = lazy(() => import('@/pages/Auth'))

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/star-map" replace />} />
        <Route path="/star-map" element={<StarMapPage />} />
        <Route path="/learn/:nodeId?" element={<LearnPage />} />
        <Route path="/certificate" element={<CertificatePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/enterprise" element={<EnterprisePage />} />
        <Route path="/startup" element={<StartupPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRouter
