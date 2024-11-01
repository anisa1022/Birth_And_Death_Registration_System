import React from 'react'
import DashboardLayout from '../components/layout'
import { Users, DollarSign, FileText, Globe, FolderPlus, Folders } from 'lucide-react'

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* New Clients Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">236</h3>
              <p className="text-sm text-gray-500">New Clients</p>
            </div>
            <div className="text-gray-200">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
            <span>+8.33%</span>
          </div>
        </div>

        {/* Earnings Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">$18,306</h3>
              <p className="text-sm text-gray-500">Earnings of Month</p>
            </div>
            <div className="text-gray-200">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* New Projects Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">1538</h3>
              <p className="text-sm text-gray-500">New Projects</p>
            </div>
            <div className="text-gray-200">
              <FileText className="h-6 w-6" />
            </div>
          </div>
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
            <span>-9.33%</span>
          </div>
        </div>

        {/* Projects Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">864</h3>
              <p className="text-sm text-gray-500">Projects</p>
            </div>
            <div className="text-gray-200">
              <Globe className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}