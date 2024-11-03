import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout'

// Mock function to simulate fetching approved death certificates
const fetchApprovedDeathCertificates = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 201, image: "/placeholder.svg", fullName: "Mohamed Ahmed", dateOfDeath: "5/15/2023", gender: "Male", address: "Wartanabada", paymentStatus: "Approved" },
        { id: 202, image: "/placeholder.svg", fullName: "Fatima Hassan", dateOfDeath: "6/22/2023", gender: "Female", address: "Yaqshid", paymentStatus: "Approved" },
        { id: 203, image: "/placeholder.svg", fullName: "Ahmed Ali Hassan", dateOfDeath: "7/12/2023", gender: "Male", address: "Wartanabada", paymentStatus: "Approved" },
      ])
    }, 500)
  })
}

export default function ApprovedDeathCertificates() {
  const [certificates, setCertificates] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchApprovedDeathCertificates().then((data) => {
      setCertificates(data)
      setIsLoading(false)
    })
  }, [])

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Approved Death Certificates</h2>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {isLoading ? (
            <p>Loading certificates...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Image</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Full Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Date of Death</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Gender</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Address</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((certificate) => (
                    <tr key={certificate.id} className="border-b last:border-b-0">
                      <td className="py-3 px-4">{certificate.id}</td>
                      <td className="py-3 px-4">
                        <img src={certificate.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                      </td>
                      <td className="py-3 px-4">{certificate.fullName}</td>
                      <td className="py-3 px-4">{certificate.dateOfDeath}</td>
                      <td className="py-3 px-4">{certificate.gender}</td>
                      <td className="py-3 px-4">{certificate.address}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {certificate.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}