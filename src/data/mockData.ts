import { Patient, InventoryBatch, ColdChainRefrigerator, FieldFeedback, AuditLog, NotificationLog } from "../types";

export const initialPatients: Patient[] = [
  {
    id: "VAX-2026-0043",
    childName: "Zainab Ali",
    fatherName: "Ali Muhammad",
    motherName: "Sana Ali",
    guardianContact: "+92 321 4567891",
    dateOfBirth: "2025-11-20",
    gender: "Female",
    address: "Block 4, Gulshan-e-Iqbal",
    district: "Karachi East",
    unionCouncil: "UC-12",
    registrationDate: "2025-12-01",
    avatarSeed: 32,
    vaccinations: [
      {
        id: "V-9901",
        disease: "Tuberculosis (BCG)",
        vaccineName: "BCG",
        doseNumber: 1,
        administeredDate: "2025-12-01",
        administeredBy: "Nurse Miriam",
        batchNumber: "BCG-202508",
        status: "Completed",
        facility: "Gulshan Town Health Center"
      },
      {
        id: "V-9902",
        disease: "Polio",
        vaccineName: "OPV",
        doseNumber: 1,
        administeredDate: "2025-12-01",
        administeredBy: "Nurse Miriam",
        batchNumber: "OPV-10293",
        status: "Completed",
        facility: "Gulshan Town Health Center"
      },
      {
        id: "V-9903",
        disease: "Hepatitis B",
        vaccineName: "Pentavalent",
        doseNumber: 1,
        administeredDate: "2026-01-15",
        administeredBy: "Worker Bashir",
        batchNumber: "PENT-5592",
        status: "Completed",
        nextDueDate: "2026-02-28",
        facility: "Gulshan Town Health Center"
      },
      {
        id: "V-9904",
        disease: "Rotavirus Diarrhea",
        vaccineName: "Rotavirus",
        doseNumber: 1,
        administeredDate: "2026-01-15",
        administeredBy: "Worker Bashir",
        batchNumber: "ROTA-389",
        status: "Completed",
        nextDueDate: "2026-02-28",
        facility: "Gulshan Town Health Center"
      },
      {
        id: "V-9905",
        disease: "Measles",
        vaccineName: "Measles-Rubella (MR)",
        doseNumber: 1,
        administeredDate: "",
        administeredBy: "",
        batchNumber: "",
        status: "Pending",
        nextDueDate: "2026-08-20",
        facility: ""
      }
    ]
  },
  {
    id: "VAX-2026-0105",
    childName: "Arsalan Khan",
    fatherName: "Jahangir Khan",
    motherName: "Salma Bibi",
    guardianContact: "+92 333 9876543",
    dateOfBirth: "2024-04-10",
    gender: "Male",
    address: "Street No. 3, Sector G-9/2",
    district: "Islamabad Center",
    unionCouncil: "UC-41",
    registrationDate: "2024-05-15",
    avatarSeed: 45,
    vaccinations: [
      {
        id: "V-8801",
        disease: "Tuberculosis (BCG)",
        vaccineName: "BCG",
        doseNumber: 1,
        administeredDate: "2024-05-15",
        administeredBy: "Nurse Miriam",
        batchNumber: "BCG-202508",
        status: "Completed",
        facility: "Capital G-9 Clinic"
      },
      {
        id: "V-8802",
        disease: "Polio",
        vaccineName: "OPV",
        doseNumber: 1,
        administeredDate: "2024-05-15",
        administeredBy: "Nurse Miriam",
        batchNumber: "OPV-10293",
        status: "Completed",
        facility: "Capital G-9 Clinic"
      },
      {
        id: "V-8803",
        disease: "Polio",
        vaccineName: "OPV",
        doseNumber: 2,
        administeredDate: "2024-07-01",
        administeredBy: "Nurse Miriam",
        batchNumber: "OPV-10293",
        status: "Completed",
        facility: "Capital G-9 Clinic"
      },
      {
        id: "V-8804",
        disease: "Typhoid",
        vaccineName: "TCV Typhoid",
        doseNumber: 1,
        administeredDate: "2026-03-12",
        administeredBy: "Nurse Miriam",
        batchNumber: "TCV-8812",
        status: "Completed",
        facility: "Capital G-9 Clinic"
      },
      {
        id: "V-8805",
        disease: "Measles",
        vaccineName: "Measles-Rubella (MR)",
        doseNumber: 1,
        administeredDate: "2025-01-15",
        administeredBy: "Worker Bashir",
        batchNumber: "MR-332",
        status: "Completed",
        nextDueDate: "2025-10-15",
        facility: "Capital G-9 Clinic"
      },
      {
        id: "V-8806",
        disease: "Rubella",
        vaccineName: "Measles-Rubella (MR)",
        doseNumber: 2,
        administeredDate: "",
        administeredBy: "",
        batchNumber: "",
        status: "Pending",
        nextDueDate: "2026-06-15",
        facility: ""
      }
    ]
  },
  {
    id: "VAX-2026-0211",
    childName: "Maryam Fatima",
    fatherName: "Imran Ahmed",
    motherName: "Sadia Imran",
    guardianContact: "+92 315 2211445",
    dateOfBirth: "2026-01-05",
    gender: "Female",
    address: "Model Town, H-Block",
    district: "Lahore Cantt",
    unionCouncil: "UC-88",
    registrationDate: "2026-01-20",
    avatarSeed: 12,
    vaccinations: [
      {
        id: "V-7701",
        disease: "Tuberculosis (BCG)",
        vaccineName: "BCG",
        doseNumber: 1,
        administeredDate: "2026-01-20",
        administeredBy: "Worker Fatima",
        batchNumber: "BCG-202508",
        status: "Completed",
        facility: "Model Town Primary Health"
      },
      {
        id: "V-7702",
        disease: "Polio",
        vaccineName: "OPV",
        doseNumber: 1,
        administeredDate: "2026-01-20",
        administeredBy: "Worker Fatima",
        batchNumber: "OPV-10293",
        status: "Completed",
        facility: "Model Town Primary Health"
      },
      {
        id: "V-7703",
        disease: "Hepatitis B",
        vaccineName: "Pentavalent",
        doseNumber: 1,
        administeredDate: "2026-03-10",
        administeredBy: "Nurse Fatima",
        batchNumber: "PENT-5592",
        status: "Completed",
        nextDueDate: "2026-04-25",
        facility: "Model Town Primary Health"
      },
      {
        id: "V-7704",
        disease: "Rotavirus Diarrhea",
        vaccineName: "Rotavirus",
        doseNumber: 1,
        administeredDate: "2026-03-10",
        administeredBy: "Nurse Fatima",
        batchNumber: "ROTA-389",
        status: "Completed",
        nextDueDate: "2026-04-25",
        facility: "Model Town Primary Health"
      },
      {
        id: "V-7705",
        disease: "Pneumococcal Pneumonia",
        vaccineName: "PCV Pneumo",
        doseNumber: 1,
        administeredDate: "",
        administeredBy: "",
        batchNumber: "",
        status: "Pending",
        nextDueDate: "2026-06-01",
        facility: ""
      }
    ]
  },
  {
    id: "VAX-2026-0342",
    childName: "Muhammad Bilal",
    fatherName: "Yasir Bilal",
    motherName: "Kiran Yasir",
    guardianContact: "+92 345 7766551",
    dateOfBirth: "2026-04-12",
    gender: "Male",
    address: "Main Shara-e-Faisal",
    district: "Karachi South",
    unionCouncil: "UC-03",
    registrationDate: "2026-04-12",
    avatarSeed: 44,
    vaccinations: [
      {
        id: "V-6601",
        disease: "Tuberculosis (BCG)",
        vaccineName: "BCG",
        doseNumber: 1,
        administeredDate: "2026-04-12",
        administeredBy: "Dr. Adnan (Civil)",
        batchNumber: "BCG-202508",
        status: "Completed",
        facility: "Civil Hospital Karachi"
      },
      {
        id: "V-6602",
        disease: "Polio",
        vaccineName: "OPV",
        doseNumber: 1,
        administeredDate: "2026-04-12",
        administeredBy: "Dr. Adnan (Civil)",
        batchNumber: "OPV-10293",
        status: "Completed",
        facility: "Civil Hospital Karachi"
      },
      {
        id: "V-6603",
        disease: "Hepatitis B",
        vaccineName: "Pentavalent",
        doseNumber: 1,
        administeredDate: "",
        administeredBy: "",
        batchNumber: "",
        status: "Pending",
        nextDueDate: "2026-05-24",
        facility: ""
      },
      {
        id: "V-6604",
        disease: "Rotavirus Diarrhea",
        vaccineName: "Rotavirus",
        doseNumber: 1,
        administeredDate: "",
        administeredBy: "",
        batchNumber: "",
        status: "Pending",
        nextDueDate: "2026-05-24",
        facility: ""
      }
    ]
  },
  {
    id: "VAX-2026-0489",
    childName: "Eshal Fatima",
    fatherName: "Rehman Shah",
    motherName: "Hina Rehman",
    guardianContact: "+92 300 1234567",
    dateOfBirth: "2025-05-18",
    gender: "Female",
    address: "Saddar Bazar, Lane 2",
    district: "Peshawar Cantt",
    unionCouncil: "UC-18",
    registrationDate: "2025-06-01",
    avatarSeed: 91,
    vaccinations: [
      {
        id: "V-5501",
        disease: "Tuberculosis (BCG)",
        vaccineName: "BCG",
        doseNumber: 1,
        administeredDate: "2025-06-01",
        administeredBy: "Nurse Zarina",
        batchNumber: "BCG-202508",
        status: "Completed",
        facility: "Peshawar Cantt Clinic"
      },
      {
        id: "V-5502",
        disease: "Polio",
        vaccineName: "OPV",
        doseNumber: 1,
        administeredDate: "2025-06-01",
        administeredBy: "Nurse Zarina",
        batchNumber: "OPV-10293",
        status: "Completed",
        facility: "Peshawar Cantt Clinic"
      },
      {
        id: "V-5503",
        disease: "Polio",
        vaccineName: "OPV",
        doseNumber: 2,
        administeredDate: "2025-07-15",
        administeredBy: "Nurse Zarina",
        batchNumber: "OPV-10293",
        status: "Completed",
        facility: "Peshawar Cantt Clinic"
      },
      {
        id: "V-5504",
        disease: "Hepatitis B",
        vaccineName: "Pentavalent",
        doseNumber: 1,
        administeredDate: "2025-07-15",
        administeredBy: "Nurse Zarina",
        batchNumber: "PENT-5592",
        status: "Completed",
        facility: "Peshawar Cantt Clinic"
      },
      {
        id: "V-5505",
        disease: "Hepatitis B",
        vaccineName: "Pentavalent",
        doseNumber: 2,
        administeredDate: "2025-09-01",
        administeredBy: "Nurse Zarina",
        batchNumber: "PENT-5592",
        status: "Completed",
        facility: "Peshawar Cantt Clinic"
      },
      {
        id: "V-5506",
        disease: "Measles",
        vaccineName: "Measles-Rubella (MR)",
        doseNumber: 1,
        administeredDate: "2026-03-05",
        administeredBy: "Nurse Zarina",
        batchNumber: "MR-332",
        status: "Completed",
        nextDueDate: "2026-11-05",
        facility: "Peshawar Cantt Clinic"
      },
      {
        id: "V-5507",
        disease: "Typhoid",
        vaccineName: "TCV Typhoid",
        doseNumber: 1,
        administeredDate: "",
        administeredBy: "",
        batchNumber: "",
        status: "Pending",
        nextDueDate: "2026-06-18",
        facility: ""
      }
    ]
  }
];

export const initialInventory: InventoryBatch[] = [
  {
    id: "BCG-202508",
    disease: "Tuberculosis (BCG)",
    vaccineName: "BCG Vaccine (Lyophilized)",
    barcode: "8493012932",
    quantityInHand: 420,
    reservedQty: 30,
    expiredQty: 0,
    mfgDate: "2025-08-10",
    expiryDate: "2027-08-10",
    temperatureRequired: "+2°C to +8°C",
    status: "Safe",
    binLocation: "Cold Box-1A"
  },
  {
    id: "OPV-10293",
    disease: "Polio",
    vaccineName: "Oral Polio Vaccine (Sabin/OPV)",
    barcode: "8493012102",
    quantityInHand: 1250,
    reservedQty: 120,
    expiredQty: 0,
    mfgDate: "2025-10-15",
    expiryDate: "2027-10-15",
    temperatureRequired: "-20°C to -10°C",
    status: "Safe",
    binLocation: "Deep Freezer Box-C"
  },
  {
    id: "IPV-44129",
    disease: "Polio",
    vaccineName: "Salk Inactivated Polio (IPV)",
    barcode: "8493021980",
    quantityInHand: 15,
    reservedQty: 5,
    expiredQty: 0,
    mfgDate: "2025-01-10",
    expiryDate: "2026-07-01",
    temperatureRequired: "+2°C to +8°C",
    status: "Low Stock",
    binLocation: "Cold Box-2B"
  },
  {
    id: "PENT-5592",
    disease: "Hepatitis B",
    vaccineName: "Pentavalent Co-injection (DTP-HepB-Hib)",
    barcode: "8493011324",
    quantityInHand: 850,
    reservedQty: 50,
    expiredQty: 0,
    mfgDate: "2025-11-01",
    expiryDate: "2027-11-01",
    temperatureRequired: "+2°C to +8°C",
    status: "Safe",
    binLocation: "Cold Box-2A"
  },
  {
    id: "ROTA-389",
    disease: "Rotavirus Diarrhea",
    vaccineName: "Rotavirus Oral Suspension (Rotarix)",
    barcode: "8493099231",
    quantityInHand: 640,
    reservedQty: 20,
    expiredQty: 0,
    mfgDate: "2025-09-12",
    expiryDate: "2026-09-12",
    temperatureRequired: "+2°C to +8°C",
    status: "Near Expiry",
    binLocation: "Cold Box-3B"
  },
  {
    id: "MR-332",
    disease: "Measles",
    vaccineName: "Measles-Rubella Attenuated MR",
    barcode: "8493033109",
    quantityInHand: 920,
    reservedQty: 80,
    expiredQty: 0,
    mfgDate: "2025-06-18",
    expiryDate: "2027-06-18",
    temperatureRequired: "+2°C to +8°C",
    status: "Safe",
    binLocation: "Cold Box-1C"
  },
  {
    id: "TCV-8812",
    disease: "Typhoid",
    vaccineName: "Typhoid Conjugate Vaccine TCV",
    barcode: "8493012900",
    quantityInHand: 310,
    reservedQty: 10,
    expiredQty: 0,
    mfgDate: "2025-03-20",
    expiryDate: "2026-03-20",
    status: "Expired",
    temperatureRequired: "+2°C to +8°C",
    binLocation: "Quarantine Bin D"
  },
  {
    id: "PCV-9921",
    disease: "Pneumococcal Pneumonia",
    vaccineName: "PCV13 Synflorix",
    barcode: "8493099210",
    quantityInHand: 550,
    reservedQty: 40,
    expiredQty: 0,
    mfgDate: "2025-07-15",
    expiryDate: "2027-07-15",
    temperatureRequired: "+2°C to +8°C",
    status: "Safe",
    binLocation: "Cold Box-3A"
  }
];

export const initialColdChain: ColdChainRefrigerator[] = [
  {
    id: "REF-01",
    name: "Main Inventory Cold Cabinet A",
    currentTemp: 4.2,
    targetTempRange: { min: 2.0, max: 8.0 },
    humidity: 48,
    complianceRate: 98.4,
    powerStatus: "Grid",
    status: "Safe",
    refrigerationGas: "R134a Eco",
    lastMaintained: "2026-04-10"
  },
  {
    id: "REF-02",
    name: "Deep Freeze Sub-Zero Box C",
    currentTemp: -16.5,
    targetTempRange: { min: -25.0, max: -10.0 },
    humidity: 12,
    complianceRate: 99.1,
    powerStatus: "Grid",
    status: "Safe",
    refrigerationGas: "R404a Eco",
    lastMaintained: "2026-05-01"
  },
  {
    id: "REF-03",
    name: "Portable Dispatch Cooler Bag 4",
    currentTemp: 7.9,
    targetTempRange: { min: 2.0, max: 10.0 },
    humidity: 55,
    complianceRate: 91.5,
    powerStatus: "Battery",
    status: "Warning",
    refrigerationGas: "Dry Ice Core",
    lastMaintained: "2026-05-29"
  }
];

export const mockFeedback: FieldFeedback[] = [
  {
    id: "F-1",
    name: "Dr. Amara Saeed",
    role: "Supervisor",
    rating: 5,
    comment: "VaccineShield Pro POS makes rural vaccination campaigns 10x faster. We registered over 200 children and logged OPV doses beautifully while in semi-offline conditions in the mountains.",
    date: "2026-05-28",
    facility: "Khyber Agency Mobile Camp",
    successStory: true
  },
  {
    id: "F-2",
    name: "Nurse Fatima Zahra",
    role: "Nurse",
    rating: 5,
    comment: "The fast POS barcode scan is exceptional. There is absolute trust in batch verification, which is critical to avoid expired MR shots.",
    date: "2026-05-29",
    facility: "Mayo Hospital Immunization Unit",
    successStory: false
  },
  {
    id: "F-3",
    name: "Health Worker Bashir",
    role: "Worker",
    rating: 4,
    comment: "The EOD shift reconciliation system prevents any vaccines from going unaccounted. Visualizing opening vs remaining stock and variance prevents supply theft.",
    date: "2026-05-27",
    facility: "Tharparkar Desert Outreach",
    successStory: true
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: "AUD-0012",
    timestamp: "2026-05-30T07:12:00Z",
    user: "Supervisor Amara",
    role: "Supervisor",
    action: "Approved EOD Reconciliation",
    details: "Authorized shift closure for Peshawar Outpost with 0 variance.",
    ipAddress: "192.168.1.144"
  },
  {
    id: "AUD-0011",
    timestamp: "2026-05-30T06:55:00Z",
    user: "Nurse Miriam",
    role: "Nurse",
    action: "Administered Rotavirus Dose",
    details: "Patient VAX-2026-0043 (Zainab Ali) dose #1. Batch ROTA-389.",
    ipAddress: "192.168.1.189"
  },
  {
    id: "AUD-0010",
    timestamp: "2026-05-30T06:40:00Z",
    user: "Administrator Rashid",
    role: "Administrator",
    action: "Stock Replenished",
    details: "Added 200 vials to Oral Polio (OPV-10293). Expiry set 2027-10-15.",
    ipAddress: "192.168.1.10"
  }
];

export const initialNotifications: NotificationLog[] = [
  {
    id: "N-101",
    patientId: "VAX-2026-0043",
    patientName: "Zainab Ali",
    contactNumber: "+92 321 4567891",
    disease: "Hepatitis B",
    channel: "SMS",
    message: "Reminder: Zainab Ali is scheduled for Pentavalent (HepB) Dose 2 at Gulshan Town Health Center on 2026-05-31. Please bring immunization card.",
    scheduledTime: "2026-05-30T08:00:00Z",
    status: "Sent"
  },
  {
    id: "N-102",
    patientId: "VAX-2026-0211",
    patientName: "Maryam Fatima",
    contactNumber: "+92 315 2211445",
    disease: "Pneumococcal Pneumonia",
    channel: "WhatsApp",
    message: "🛡️ VaccineShield Pro Alert: Urgent upcoming PCV Pneumo Vaccine Dose 1 schedule for Maryam Fatima on 2026-06-01.",
    scheduledTime: "2026-05-31T09:30:00Z",
    status: "Queued"
  },
  {
    id: "N-103",
    patientId: "VAX-2026-0489",
    patientName: "Eshal Fatima",
    contactNumber: "+92 300 1234567",
    disease: "Typhoid",
    channel: "Email",
    message: "Subject: Vaccination Campaign Invitation - Typhoid Conjugate Dose 1. Eshal Fatima is eligible for Typhoid protection at Peshawar Cantt Clinic starting next week.",
    scheduledTime: "2026-06-02T10:00:00Z",
    status: "Queued"
  }
];

export const smsTemplates = [
  {
    type: "Upcoming Vaccination Reminder",
    template: "Reminder: {childName} is scheduled for {vaccineName} Dose {doseNumber} at {facility} on {date}. Please bring the vaccination card."
  },
  {
    type: "Missed Dose Alert",
    template: "⚠️ ALERT: {childName} missed their {vaccineName} dose scheduled on {date}. Protect them from {disease} today by visiting your local clinic."
  },
  {
    type: "Follow-Up Campaign",
    template: "🛡️ VaccineShield Pro Campaign: A massive immunization round for {disease} is launching in {district}. Visit with {childName} for a safety booster!"
  }
];
