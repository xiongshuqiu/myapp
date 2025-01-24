const users = [
  {
    userId: 'U002',
    account: 'user2',
    userName: 'John Doe',
    passWord: 'password1',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'family',
  },
  {
    userId: 'U003',
    account: 'user3',
    userName: 'Jane Doe',
    passWord: 'password2',
    phoneNumber: '0987654321',
    email: 'jane.doe@example.com',
    role: 'family',
  },
];

const elderlies = [
  {
    elderlyName: 'Elderly 1',
    elderlyId: 'E001',
    elderlyPhophe: '5551234567',
    emergencyContactName: 'Family Member 1',
    userId: 'U002', // 用户U002的字符串形式
  },
  {
    elderlyName: 'Elderly 2',
    elderlyId: 'E002',
    elderlyPhophe: '5557654321',
    emergencyContactName: 'Family Member 2',
    userId: 'U003', // 用户U003的字符串形式
  },
];

const bedStatuses = [
  {
    bedId: '3-701-B01',
    building: '3#',
    floor: '7',
    room: '701',
    status: 'occupied',
  },
  {
    bedId: '3-701-B02',
    building: '3#',
    floor: '7',
    room: '701',
    status: 'occupied',
  },
];

const bedAssignments = [
  {
    assignmentId: 'A001',
    bedId: '3-701-b01', // 床位3-701-b01的字符串形式
    elderly: 'E001', // 老人E001的字符串形式
    assignedDate: new Date('2023-03-01'),
  },
  {
    assignmentId: 'A002',
    bedId: '3-701-b02', // 床位3-701-b02的字符串形式
    elderly: 'E002', // 老人E002的字符串形式
    assignedDate: new Date('2023-03-01'),
  },
];
