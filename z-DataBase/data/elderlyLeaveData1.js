const elderlyLeaves = [
  {
    leaveId: 'L001',
    elderlyId: 'E001',
    type: 'Leave',
    startDate: new Date('2024-12-25'),
    endDate: new Date('2025-01-10'),
    reason: 'Medical Checkup',
    status: 'Approved',
    appliedDate: new Date('2024-12-20')
  },
  {
    leaveId: 'L002',
    elderlyId: 'E002',
    type: 'Leave',
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-01-20'),
    reason: 'Family Event',
    status: 'Pending',
    appliedDate: new Date('2025-01-10')
  },
  {
    leaveId: 'L003',
    elderlyId: 'E003',
    type: 'CancelLeave',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-05'),
    reason: 'Recovered from Illness',
    status: 'Rejected',
    appliedDate: new Date('2024-12-25')
  },
  {
    leaveId: 'L004',
    elderlyId: 'E004',
    type: 'Leave',
    startDate: new Date('2024-11-15'),
    endDate: new Date('2024-11-20'),
    reason: 'Travel',
    status: 'Approved',
    appliedDate: new Date('2024-11-10')
  },
  {
    leaveId: 'L005',
    elderlyId: 'E005',
    type: 'CancelLeave',
    startDate: new Date('2025-01-25'),
    endDate: new Date('2025-01-30'),
    reason: 'Back to Residence',
    status: 'Pending',
    appliedDate: new Date('2025-01-20')
  },
  {
    leaveId: 'L006',
    elderlyId: 'E006',
    type: 'Leave',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-10'),
    reason: 'Medical Procedure',
    status: 'Approved',
    appliedDate: new Date('2024-11-15')
  },
  {
    leaveId: 'L007',
    elderlyId: 'E007',
    type: 'Leave',
    startDate: new Date('2025-01-05'),
    endDate: new Date('2025-01-10'),
    reason: 'Family Visit',
    status: 'Pending',
    appliedDate: new Date('2024-12-30')
  },
  {
    leaveId: 'L008',
    elderlyId: 'E008',
    type: 'CancelLeave',
    startDate: new Date('2024-10-15'),
    endDate: new Date('2024-10-20'),
    reason: 'No Longer Needed',
    status: 'Rejected',
    appliedDate: new Date('2024-10-10')
  },
  {
    leaveId: 'L009',
    elderlyId: 'E009',
    type: 'Leave',
    startDate: new Date('2024-12-25'),
    endDate: new Date('2025-01-01'),
    reason: 'Vacation',
    status: 'Approved',
    appliedDate: new Date('2024-12-15')
  },
  {
    leaveId: 'L010',
    elderlyId: 'E010',
    type: 'CancelLeave',
    startDate: new Date('2024-11-10'),
    endDate: new Date('2024-11-15'),
    reason: 'Returned Early',
    status: 'Pending',
    appliedDate: new Date('2024-11-05')
  }
];

module.exports = elderlyLeaves;
