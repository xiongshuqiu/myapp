const users = [
  {
    userId: 'U001',
    status: 'Occupied',
    userName: 'xiongshuqiu1',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'admin',
  },
  {
    userId: 'U002',
    status: 'Occupied',
    userName: 'xiongshuqiu2',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'medical',
  },
  {
    userId: 'U003',
    status: 'Occupied',
    userName: 'xiongshuqiu33',
    passWord: '1234565',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'medical',
  },
  {
    userId: 'U004',
    status: 'Occupied',
    userName: 'xiongshuqiu4',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'medical',
  },
  {
    userId: 'U005',
    status: 'Occupied',
    userName: 'xiongshuqiu5',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'medical',
  },
  {
    userId: 'U006',
    status: 'Occupied',
    userName: 'xiongshuqiu6',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'medical',
  },
  {
    userId: 'U007',
    status: 'Occupied',
    userName: 'xiongshuqiu7',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'medical',
  },
  {
    userId: 'U008',
    status: 'Occupied',
    userName: 'xiongshuqiu8',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'medical',
  },
  {
    userId: 'U009',
    status: 'Occupied',
    userName: 'xiongshuqiu9',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'medical',
  },
  {
    userId: 'U010',
    status: 'Occupied',
    userName: 'xiongshuqiu10',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'medical',
  },
  {
    userId: 'U011',
    status: 'Available',
    userName: 'xiongshuqiu11',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'medical',
  },
  {
    userId: 'U012',
    status: 'Available',
    userName: 'xiongshuqiu12',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'medical',
  },
  {
    userId: 'U013',
    status: 'Available',
    userName: 'xiongshuqiu13',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'medical',
  },
  {
    userId: 'U014',
    status: 'Available',
    userName: 'xiongshuqiu14',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'medical',
  },
  {
    userId: 'U015',
    status: 'Available',
    userName: 'xiongshuqiu15',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'medical',
  },
  {
    userId: 'U016',
    status: 'Available',
    userName: 'xiongshuqiu16',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'medical',
  },
  {
    userId: 'U017',
    status: 'Available',
    userName: 'xiongshuqiu17',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'medical',
  },
  {
    userId: 'U018',
    status: 'Available',
    userName: 'xiongshuqiu18',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'medical',
  },
  {
    userId: 'U019',
    status: 'Available',
    userName: 'xiongshuqiu19',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'medical',
  },
  {
    userId: 'U020',
    status: 'Available',
    userName: 'xiongshuqiu20',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'medical',
  },
  {
    userId: 'F001',
    status: 'Occupied',
    userName: 'xiongshuqiu3',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'family',
  },
  {
    userId: 'F002',
    status: 'Occupied',
    userName: 'John Doe',
    passWord: '123456',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    role: 'family',
  },
  {
    userId: 'F003',
    status: 'Occupied',
    userName: 'xiongshuqiu32',
    passWord: '12345677',
    phoneNumber: '0987654321',
    email: 'jane.doe@example.com',
    role: 'family',
  },
  {
    userId: 'F004',
    status: 'Occupied',
    userName: 'Jane Doe',
    passWord: '123456',
    phoneNumber: '0987654321',
    email: 'jane.doe@example.com',
    role: 'family',
  },
  {
    userId: 'F005',
    status: 'Occupied',
    userName: 'Jane Doe',
    passWord: '123456',
    phoneNumber: '0987654321',
    email: 'jane.doe@example.com',
    role: 'family',
  },
  {
    userId: 'F006',
    status: 'Available',
    userName: 'Jane Doe',
    passWord: '123456',
    phoneNumber: '0987654321',
    email: 'jane.doe@example.com',
    role: 'family',
  },
  {
    userId: 'F007',
    status: 'Available',
    userName: 'Jane Doe',
    passWord: '123456',
    phoneNumber: '0987654321',
    email: 'jane.doe@example.com',
    role: 'family',
  },
  {
    userId: 'F008',
    status: 'Available',
    userName: 'Jane Doe',
    passWord: '123456',
    phoneNumber: '0987654321',
    email: 'jane.doe@example.com',
    role: 'family',
  },
  {
    userId: 'F009',
    status: 'Available',
    userName: 'Jane Doe',
    passWord: '123456',
    phoneNumber: '0987654321',
    email: 'jane.doe@example.com',
    role: 'family',
  },
  {
    userId: 'F010',
    status: 'Occupied',
    userName: 'Jane Doe',
    passWord: '123456',
    phoneNumber: '0987654321',
    email: 'jane.doe@example.com',
    role: 'family',
  },
  {
    userId: 'F011',
    status: 'Available',
    userName: 'Jane Doe',
    passWord: '123456',
    phoneNumber: '0987654321',
    email: 'jane.doe@example.com',
    role: 'family',
  },
  {
    userId: 'F012',
    status: 'Available',
    userName: 'Jane Doe',
    passWord: '123456',
    phoneNumber: '0987654321',
    email: 'jane.doe@example.com',
    role: 'family',
  },
  {
    userId: 'F014',
    status: 'Available',
    userName: 'Jane Doe',
    passWord: '123456',
    phoneNumber: '0987654321',
    email: 'jane.doe@example.com',
    role: 'family',
  },
  {
    userId: 'F015',
    status: 'Available',
    userName: 'Jane Doe',
    passWord: '123456',
    phoneNumber: '0987654321',
    email: 'jane.doe@example.com',
    role: 'family',
  },
];

module.exports = users;
