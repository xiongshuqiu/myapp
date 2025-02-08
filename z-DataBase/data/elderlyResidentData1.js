const elderlyResidents = [
  {
    residentId: 'R001',
    elderlyId: 'E001',
    checkInTime: new Date('2021-01-01'),
    checkOutTime: null,
    status: 'Active',
  },
  {
    residentId: 'R002',
    elderlyId: 'E002',
    checkInTime: new Date('2021-02-01'),
    checkOutTime: null,
    status: 'Active',
  },
  {
    residentId: 'R003',
    elderlyId: 'E003',
    checkInTime: new Date('2021-03-01'),
    checkOutTime: new Date('2022-03-01'),
    status: 'Inactive',
  },
];

module.exports = elderlyResidents;
