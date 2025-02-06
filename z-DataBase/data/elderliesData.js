// elderliesData.js

const elderlies = [
  {
    elderlyId: 'E001',
    elderlyName: 'Elderly 1',
    elderlyPhone: '5551234567',
    dateOfBirth: new Date('1940-01-01'),
    gender: 'Male',
    address: '123 Elderly St, City, Country',
    medicalHistory: 'None',
    allergies: 'None',
    emergencyContactName: 'Family Member 1',
    emergencyContactPhone: '5551111111',
    userId: 'F001',
    employeeId: 'S002',
  },
  {
    elderlyId: 'E002',
    elderlyName: 'Elderly 2',
    elderlyPhone: '5557654321',
    dateOfBirth: new Date('1942-02-02'),
    gender: 'Female',
    address: '124 Elderly St, City, Country',
    medicalHistory: 'Hypertension',
    allergies: 'Penicillin',
    emergencyContactName: 'Family Member 2',
    emergencyContactPhone: '5552222222',
    userId: 'F001',
    employeeId: 'S002',
  },
  {
    elderlyId: 'E003',
    elderlyName: 'Elderly 3',
    elderlyPhone: '5558765432',
    dateOfBirth: new Date('1935-03-03'),
    gender: 'Male',
    address: '125 Elderly St, City, Country',
    medicalHistory: 'Diabetes',
    allergies: 'None',
    emergencyContactName: 'Family Member 3',
    emergencyContactPhone: '5553333333',
    userId: 'F002',
    employeeId: 'S002',
  },
  {
    elderlyId: 'E004',
    elderlyName: 'Elderly 4',
    elderlyPhone: '5552345678',
    dateOfBirth: new Date('1938-04-04'),
    gender: 'Female',
    address: '126 Elderly St, City, Country',
    medicalHistory: 'Arthritis',
    allergies: 'None',
    emergencyContactName: 'Family Member 4',
    emergencyContactPhone: '5554444444',
    userId: 'F002',
    employeeId: 'S002',
  },
  {
    elderlyId: 'E005',
    elderlyName: 'Elderly 5',
    elderlyPhone: '5553456789',
    dateOfBirth: new Date('1945-05-05'),
    gender: 'Male',
    address: '127 Elderly St, City, Country',
    medicalHistory: 'Heart Disease',
    allergies: 'Aspirin',
    emergencyContactName: 'Family Member 5',
    emergencyContactPhone: '5555555555',
    userId: 'F003',
    employeeId: 'S002',
  },
  {
    elderlyId: 'E006',
    elderlyName: 'Elderly 6',
    elderlyPhone: '5554567890',
    dateOfBirth: new Date('1948-06-06'),
    gender: 'Female',
    address: '128 Elderly St, City, Country',
    medicalHistory: 'Asthma',
    allergies: 'None',
    emergencyContactName: 'Family Member 6',
    emergencyContactPhone: '5556666666',
    userId: 'F003',
    employeeId: 'S003',
  },
  {
    elderlyId: 'E007',
    elderlyName: 'Elderly 7',
    elderlyPhone: '5554567890',
    dateOfBirth: new Date('1948-06-06'),
    gender: 'Female',
    address: '128 Elderly St, City, Country',
    medicalHistory: 'Asthma',
    allergies: 'None',
    emergencyContactName: 'Family Member 6',
    emergencyContactPhone: '5556666666',
    userId: 'F004',
    employeeId: 'S003',
  },
  {
    elderlyId: 'E008',
    elderlyName: 'Elderly 8',
    elderlyPhone: '5554567890',
    dateOfBirth: new Date('1948-06-06'),
    gender: 'Female',
    address: '128 Elderly St, City, Country',
    medicalHistory: 'Asthma',
    allergies: 'None',
    emergencyContactName: 'Family Member 6',
    emergencyContactPhone: '5556666666',
    userId: 'F004',
    employeeId: 'S003',
  },
  {
    elderlyId: 'E009',
    elderlyName: 'Elderly 9',
    elderlyPhone: '5554567890',
    dateOfBirth: new Date('1948-06-06'),
    gender: 'Female',
    address: '128 Elderly St, City, Country',
    medicalHistory: 'Asthma',
    allergies: 'None',
    emergencyContactName: 'Family Member 6',
    emergencyContactPhone: '5556666666',
    userId: 'F005',
    employeeId: 'S003',
  },
  {
    elderlyId: 'E010',
    elderlyName: 'Elderly 10',
    elderlyPhone: '5554567890',
    dateOfBirth: new Date('1948-06-06'),
    gender: 'Female',
    address: '128 Elderly St, City, Country',
    medicalHistory: 'Asthma',
    allergies: 'None',
    emergencyContactName: 'Family Member 6',
    emergencyContactPhone: '5556666666',
    userId: 'F005',
    employeeId: 'S003',
  },
  {
    elderlyId: 'E011',
    elderlyName: 'Elderly 11',
    elderlyPhone: '5554567890',
    dateOfBirth: new Date('1948-06-06'),
    gender: 'Male',
    address: '128 Elderly St, City, Country',
    medicalHistory: 'Asthma',
    allergies: 'None',
    emergencyContactName: 'Family Member 6',
    emergencyContactPhone: '5556666666',
    userId: 'F006',
    employeeId: 'S004',
  },
  {
    elderlyId: 'E012',
    elderlyName: 'Elderly 12',
    elderlyPhone: '5554567890',
    dateOfBirth: new Date('1948-06-06'),
    gender: 'Female',
    address: '128 Elderly St, City, Country',
    medicalHistory: 'Asthma',
    allergies: 'None',
    emergencyContactName: 'Family Member 6',
    emergencyContactPhone: '5556666666',
    userId: 'F006',
    employeeId: 'S004',
  },
  {
    elderlyId: 'E013',
    elderlyName: 'Elderly 13',
    elderlyPhone: '5554567890',
    dateOfBirth: new Date('1948-06-06'),
    gender: 'Male',
    address: '128 Elderly St, City, Country',
    medicalHistory: 'Asthma',
    allergies: 'None',
    emergencyContactName: 'Family Member 6',
    emergencyContactPhone: '5556666666',
    userId: 'F007',
    employeeId: 'S004',
  },
  {
    elderlyId: 'E014',
    elderlyName: 'Elderly 14',
    elderlyPhone: '5554567890',
    dateOfBirth: new Date('1948-06-06'),
    gender: 'Male',
    address: '128 Elderly St, City, Country',
    medicalHistory: 'Asthma',
    allergies: 'None',
    emergencyContactName: 'Family Member 6',
    emergencyContactPhone: '5556666666',
    userId: 'F007',
    employeeId: 'S004',
  },
  {
    elderlyId: 'E015',
    elderlyName: 'Elderly 15',
    elderlyPhone: '5554567890',
    dateOfBirth: new Date('1948-06-06'),
    gender: 'Female',
    address: '128 Elderly St, City, Country',
    medicalHistory: 'Asthma',
    allergies: 'None',
    emergencyContactName: 'Family Member 6',
    emergencyContactPhone: '5556666666',
    userId: 'F008',
    employeeId: 'S004',
  },
  {
    elderlyId: 'E016',
    elderlyName: 'Elderly 16',
    elderlyPhone: '5554567890',
    dateOfBirth: new Date('1948-06-06'),
    gender: 'Male',
    address: '128 Elderly St, City, Country',
    medicalHistory: 'Asthma',
    allergies: 'None',
    emergencyContactName: 'Family Member 6',
    emergencyContactPhone: '5556666666',
    userId: 'F008',
    employeeId: 'S005',
  },
  {
    elderlyId: 'E017',
    elderlyName: 'Elderly 17',
    elderlyPhone: '5554567890',
    dateOfBirth: new Date('1948-06-06'),
    gender: 'Male',
    address: '128 Elderly St, City, Country',
    medicalHistory: 'Asthma',
    allergies: 'None',
    emergencyContactName: 'Family Member 6',
    emergencyContactPhone: '5556666666',
    userId: 'F009',
    employeeId: 'S005',
  },
  {
    elderlyId: 'E018',
    elderlyName: 'Elderly 18',
    elderlyPhone: '5554567890',
    dateOfBirth: new Date('1948-06-06'),
    gender: 'Male',
    address: '128 Elderly St, City, Country',
    medicalHistory: 'Asthma',
    allergies: 'None',
    emergencyContactName: 'Family Member 6',
    emergencyContactPhone: '5556666666',
    userId: 'F009',
    employeeId: 'S005',
  },
  {
    elderlyId: 'E019',
    elderlyName: 'Elderly 19',
    elderlyPhone: '5554567890',
    dateOfBirth: new Date('1948-06-06'),
    gender: 'Male',
    address: '128 Elderly St, City, Country',
    medicalHistory: 'Asthma',
    allergies: 'None',
    emergencyContactName: 'Family Member 6',
    emergencyContactPhone: '5556666666',
    userId: 'F010',
    employeeId: 'S005',
  },
  {
    elderlyId: 'E020',
    elderlyName: 'Elderly 20',
    elderlyPhone: '5554567890',
    dateOfBirth: new Date('1948-06-06'),
    gender: 'Female',
    address: '128 Elderly St, City, Country',
    medicalHistory: 'Asthma',
    allergies: 'None',
    emergencyContactName: 'Family Member 6',
    emergencyContactPhone: '5556666666',
    userId: 'F010',
    employeeId: 'S005',
  },
];

module.exports = elderlies;
