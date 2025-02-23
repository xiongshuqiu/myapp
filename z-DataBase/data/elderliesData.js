// elderliesData.js

const commonPrefixes = [
  '130',
  '131',
  '132',
  '133',
  '134',
  '135',
  '136',
  '137',
  '138',
  '139',
  '145',
  '147',
  '149',
  '150',
  '151',
  '152',
  '153',
  '155',
  '156',
  '157',
  '158',
  '159',
  '166',
  '170',
  '171',
  '172',
  '173',
  '175',
  '176',
  '177',
  '178',
  '180',
  '181',
  '182',
  '183',
  '184',
  '185',
  '186',
  '187',
  '188',
  '189',
  '198',
  '199',
];

const elderlies = [
  {
      elderlyId: 'E001',
      elderlyName: 'Elderly 1',
      elderlyPhone: '5551234567',
      dateOfBirth: new Date('1940-01-01'),
      gender: 'Male',
      address: '123 Elderly St, City, Country',
      photo:
          'https://github.com/xiongshuqiu/images/blob/main/elderlyPhotos/man01.jpg?raw=true',
      emergencyContactName: 'Family Member 1',
      emergencyContactPhone: '5551111111',
      userId: null,
      employeeId: null,
  },
  {
      elderlyId: 'E002',
      elderlyName: 'Elderly 2',
      elderlyPhone: '5557654321',
      dateOfBirth: new Date('1942-02-02'),
      gender: 'Female',
      address: '124 Elderly St, City, Country',
      photo:
          'https://github.com/xiongshuqiu/images/blob/main/elderlyPhotos/woman03.jpg?raw=true',
      emergencyContactName: 'Family Member 2',
      emergencyContactPhone: '5552222222',
      userId: null,
      employeeId: null,
  },
  {
      elderlyId: 'E003',
      elderlyName: 'Elderly 3',
      elderlyPhone: '5558765432',
      dateOfBirth: new Date('1935-03-03'),
      gender: 'Male',
      address: '125 Elderly St, City, Country',
      photo:
          'https://github.com/xiongshuqiu/images/blob/main/elderlyPhotos/man02.jpg?raw=true',
      emergencyContactName: 'Family Member 3',
      emergencyContactPhone: '5553333333',
      userId: null,
      employeeId: null,
  },
  {
      elderlyId: 'E004',
      elderlyName: 'Elderly 4',
      elderlyPhone: '5552345678',
      dateOfBirth: new Date('1938-04-04'),
      gender: 'Female',
      address: '126 Elderly St, City, Country',
      photo:
          'https://github.com/xiongshuqiu/images/blob/main/elderlyPhotos/woman02.jpg?raw=true',
      emergencyContactName: 'Family Member 4',
      emergencyContactPhone: '5554444444',
      userId: null,
      employeeId: null,
  },
  {
      elderlyId: 'E005',
      elderlyName: 'Elderly 5',
      elderlyPhone: '5553456789',
      dateOfBirth: new Date('1945-05-05'),
      gender: 'Male',
      address: '127 Elderly St, City, Country',
      photo:
          'https://github.com/xiongshuqiu/images/blob/main/elderlyPhotos/man03.jpg?raw=true',
      emergencyContactName: 'Family Member 5',
      emergencyContactPhone: '5555555555',
      userId: null,
      employeeId: null,
  },
  {
      elderlyId: 'E006',
      elderlyName: 'Elderly 6',
      elderlyPhone: '5554567890',
      dateOfBirth: new Date('1948-06-06'),
      gender: 'Male',
      address: '128 Elderly St, City, Country',
      photo:
          'https://github.com/xiongshuqiu/images/blob/main/elderlyPhotos/man04.jpg?raw=true',
      emergencyContactName: 'Family Member 6',
      emergencyContactPhone: '5556666666',
      userId: null,
      employeeId: null,
  },
  {
      elderlyId: 'E007',
      elderlyName: 'Elderly 7',
      elderlyPhone: '5554567890',
      dateOfBirth: new Date('1948-06-06'),
      gender: 'Female',
      address: '128 Elderly St, City, Country',
      photo:
          'https://github.com/xiongshuqiu/images/blob/main/elderlyPhotos/woman03.jpg?raw=true',
      emergencyContactName: 'Family Member 6',
      emergencyContactPhone: '5556666666',
      userId: null,
      employeeId: null,
  },
  {
      elderlyId: 'E008',
      elderlyName: 'Elderly 8',
      elderlyPhone: '5554567890',
      dateOfBirth: new Date('1948-06-06'),
      gender: 'Male',
      address: '128 Elderly St, City, Country',
      photo:
          'https://github.com/xiongshuqiu/images/blob/main/elderlyPhotos/man05.jpg?raw=true',
      emergencyContactName: 'Family Member 6',
      emergencyContactPhone: '5556666666',
      userId: null,
      employeeId: null,
  },
  {
      elderlyId: 'E009',
      elderlyName: 'Elderly 9',
      elderlyPhone: '5554567890',
      dateOfBirth: new Date('1948-06-06'),
      gender: 'Male',
      address: '128 Elderly St, City, Country',
      photo:
          'https://github.com/xiongshuqiu/images/blob/main/elderlyPhotos/man06.jpg?raw=true',
      emergencyContactName: 'Family Member 6',
      emergencyContactPhone: '5556666666',
      userId: null,
      employeeId: null,
  },
  {
      elderlyId: 'E010',
      elderlyName: 'Elderly 10',
      elderlyPhone: '5554567890',
      dateOfBirth: new Date('1948-06-06'),
      gender: 'Male',
      address: '128 Elderly St, City, Country',
      photo:
          'https://github.com/xiongshuqiu/images/blob/main/elderlyPhotos/man07.jpg?raw=true',
      emergencyContactName: 'Family Member 6',
      emergencyContactPhone: '5556666666',
      userId: null,
      employeeId: null,
  },
  {
      elderlyId: 'E011',
      elderlyName: 'Elderly 11',
      elderlyPhone: '5554567890',
      dateOfBirth: new Date('1948-06-06'),
      gender: 'Female',
      address: '128 Elderly St, City, Country',
      photo:
          'https://github.com/xiongshuqiu/images/blob/main/elderlyPhotos/woman01.jpg?raw=true',
      emergencyContactName: 'Family Member 6',
      emergencyContactPhone: '5556666666',
      userId: null,
      employeeId: null,
  },
  {
      elderlyId: 'E012',
      elderlyName: 'Elderly 12',
      elderlyPhone: '5554567890',
      dateOfBirth: new Date('1948-06-06'),
      gender: 'Female',
      address: '128 Elderly St, City, Country',
      photo:
          'https://github.com/xiongshuqiu/images/blob/main/elderlyPhotos/woman05.jpg?raw=true',
      emergencyContactName: 'Family Member 6',
      emergencyContactPhone: '5556666666',
      userId: null,
      employeeId: null,
  },
];

// 修改 address 字段
elderlies.forEach((elderly) => {
  const randomBuilding = Math.floor(Math.random() * 100) + 1;
  const randomUnit = Math.floor(Math.random() * 3) + 1;
  const randomFloor = Math.floor(Math.random() * 9) + 1;
  const randomRoomNumber = Math.floor(Math.random() * 6) + 1;
  const room = `${randomFloor}0${randomRoomNumber}`;
  elderly.address = `${randomBuilding} Building - Unit ${randomUnit} - Floor ${randomFloor} - Room ${room}`;
});

// 修改电话号码
elderlies.forEach((elderly) => {
  const randomPrefix = commonPrefixes[Math.floor(Math.random() * commonPrefixes.length)];
  elderly.elderlyPhone = '+86 ' + randomPrefix + elderly.elderlyPhone.slice(-8);
  elderly.emergencyContactPhone = '+86 ' + randomPrefix + elderly.emergencyContactPhone.slice(-8);
});

// 分配 userId 和 employeeId
for (let i = 0; i < elderlies.length; i++) {
  // 每个 userId 关联一个老人，从 F001 开始递增
  elderlies[i].userId = `F${String(i + 1).padStart(3, '0')}`;
  // 每个 employeeId 关联 3 个老人，从 S002 开始递增
  elderlies[i].employeeId = `S${String(Math.floor(i / 3) + 2).padStart(3, '0')}`;
}

module.exports = elderlies;