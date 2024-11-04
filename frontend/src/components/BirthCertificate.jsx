import React from 'react'

const CertificateDetails = ({ certificate }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg">
      {/* Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
            <img
              src="/placeholder.svg"
              alt="Municipality Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>
        <h1 className="text-xl font-bold uppercase">Dowladda Hoose Ee Muqdisho</h1>
        <h2 className="text-lg">Municipality of Mogadishu</h2>
        <h3 className="text-xl font-semibold mt-4">WARQADDA SUGNAANTA</h3>
        <p className="text-sm text-gray-600">Certificate of Identity Confirmation</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Left Column */}
          <div className="space-y-1">
            <p className="text-sm text-gray-600">MAGACA / Full Name</p>
            <p className="font-semibold">{certificate.fullName}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600">TAARIIKHDA DHALASHADA / Date of Birth</p>
            <p className="font-semibold">{certificate.dateOfBirth}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600">GOORTA DHALASHADA / Place of Birth</p>
            <p className="font-semibold">{certificate.placeOfBirth}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600">NUMBERKA KAARKA / ID Number</p>
            <p className="font-semibold">{certificate.idNumber}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600">JINSI / Gender</p>
            <p className="font-semibold">{certificate.gender}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Right Column */}
          <div className="space-y-1">
            <p className="text-sm text-gray-600">XAALADDA GUURKA / Marital Status</p>
            <p className="font-semibold">{certificate.maritalStatus}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600">DEGGAN / Address</p>
            <p className="font-semibold">{certificate.address}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600">MAGACA HOOYADA / Mother's Name</p>
            <p className="font-semibold">{certificate.motherName}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600">TAARIIKHDA LA BIXIYAY / Date of Issue</p>
            <p className="font-semibold">{certificate.dateOfIssue}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600">SHAQADA / Occupation</p>
            <p className="font-semibold">{certificate.occupation}</p>
          </div>
        </div>
      </div>

      {/* Photo Section */}
      <div className="mt-8 flex justify-end">
        <div className="w-32 h-40 border-2 border-gray-300 rounded-lg overflow-hidden">
          <img
            src={certificate.photo}
            alt="ID Photo"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center space-y-4">
        <p className="font-semibold">Duqa Magaalada ee Muqdisho</p>
        <p>Mayor of Mogadishu</p>
        <p className="font-semibold">{certificate.mayorName}</p>
        <div className="flex justify-center gap-8 mt-4">
          <div className="w-24 h-24 rounded-full bg-blue-50"></div>
          <div className="w-24 h-24 rounded-full bg-blue-50"></div>
        </div>
      </div>
    </div>
  )
}

// Example usage:
export default function CertificateView() {
  const sampleCertificate = {
    fullName: "RAMADAN ABUUKAR CABDI",
    dateOfBirth: "07-Aug-2000",
    placeOfBirth: "MOGADISHU",
    idNumber: "303389",
    gender: "Male",
    maritalStatus: "Single",
    address: "Howlwadaag",
    motherName: "MANO XASAN IBRAHIM",
    dateOfIssue: "24-Aug-2022",
    occupation: "ARDAY",
    photo: "/placeholder.svg",
    mayorName: "Cumar Maxamuud Maxamed"
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <CertificateDetails certificate={sampleCertificate} />
    </div>
  )
}