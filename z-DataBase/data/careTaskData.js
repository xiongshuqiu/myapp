const caretasks = [
  {
      careTaskId: 'CT00001',
      taskName: 'Daily Blood Pressure Monitoring',
      description: 'Monitor blood pressure daily for hypertension patients.',
      dueDate: '2025-02-12T08:00:00Z',
      carePlanId: 'PL1',
      status: 'Pending',
      elderlyId: 'E001',
      employeeId: null,
      createdAt: '2025-02-11T18:46:00Z',
  },
  {
      careTaskId: 'CT00002',
      taskName: 'Diabetes Medication Administration',
      description: 'Administer diabetes medication and monitor blood sugar levels.',
      dueDate: '2025-02-12T08:00:00Z',
      carePlanId: 'PL3',
      status: 'Pending',
      elderlyId: 'E001',
      employeeId: null,
      createdAt: '2025-02-11T18:46:00Z',
  },
  {
      careTaskId: 'CT00003',
      taskName: 'Cardiac Health Monitoring',
      description: 'Monitor heart health and provide cardiac care.',
      dueDate: '2025-02-12T08:00:00Z',
      carePlanId: 'PL6',
      status: 'Pending',
      elderlyId: 'E002',
      employeeId: null,
      createdAt: '2025-02-11T18:46:00Z',
  },
  {
      careTaskId: 'CT00004',
      taskName: 'Asthma Inhaler Administration',
      description: 'Administer asthma inhaler and monitor respiratory health.',
      dueDate: '2025-02-12T08:00:00Z',
      carePlanId: 'PL2',
      status: 'Pending',
      elderlyId: 'E002',
      employeeId: null,
      createdAt: '2025-02-11T18:46:00Z',
  },
  {
      careTaskId: 'CT00005',
      taskName: 'Rheumatology Medication Administration',
      description: 'Administer medication for rheumatoid arthritis.',
      dueDate: '2025-02-12T08:00:00Z',
      carePlanId: 'PL3',
      status: 'Pending',
      elderlyId: 'E003',
      employeeId: null,
      createdAt: '2025-02-11T18:46:00Z',
  },
  {
      careTaskId: 'CT00006',
      taskName: 'Hypertension Medication Administration',
      description: 'Administer medication for hypertension.',
      dueDate: '2025-02-12T08:00:00Z',
      carePlanId: 'PL5',
      status: 'Pending',
      elderlyId: 'E004',
      employeeId: null,
      createdAt: '2025-02-11T18:46:00Z',
  },
  {
      careTaskId: 'CT00007',
      taskName: 'Diabetes Blood Sugar Monitoring',
      description: 'Monitor blood sugar levels for diabetes patients.',
      dueDate: '2025-02-12T08:00:00Z',
      carePlanId: 'PL1',
      status: 'Pending',
      elderlyId: 'E005',
      employeeId: null,
      createdAt: '2025-02-11T18:46:00Z',
  },
  {
      careTaskId: 'CT00008',
      taskName: 'Asthma Management',
      description: 'Monitor and manage asthma symptoms.',
      dueDate: '2025-02-12T08:00:00Z',
      carePlanId: 'PL4',
      status: 'Pending',
      elderlyId: 'E006',
      employeeId: null,
      createdAt: '2025-02-11T18:46:00Z',
  },
  {
      careTaskId: 'CT00009',
      taskName: 'Alzheimer Care and Support',
      description: 'Provide care and support for Alzheimer patients.',
      dueDate: '2025-02-12T08:00:00Z',
      carePlanId: 'PL6',
      status: 'Pending',
      elderlyId: 'E007',
      employeeId: null,
      createdAt: '2025-02-11T18:46:00Z',
  },
  {
      careTaskId: 'CT00010',
      taskName: 'Cardiac and Hypertension Monitoring',
      description: 'Monitor heart health and blood pressure.',
      dueDate: '2025-02-12T08:00:00Z',
      carePlanId: 'PL2',
      status: 'Pending',
      elderlyId: 'E008',
      employeeId: null,
      createdAt: '2025-02-11T18:46:00Z',
  },
];

// 用于记录每个 carePlanId 对应的 employeeId
const carePlanToEmployeeIdMap = {};
let currentEmployeeId = 2;

caretasks.forEach((task) => {
  const carePlanId = task.carePlanId;
  if (!carePlanToEmployeeIdMap[carePlanId]) {
      // 如果该 carePlanId 还没有对应的 employeeId，生成一个新的
      carePlanToEmployeeIdMap[carePlanId] = `S${String(currentEmployeeId).padStart(3, '0')}`;
      currentEmployeeId++;
  }
  // 为当前任务分配对应的 employeeId
  task.employeeId = carePlanToEmployeeIdMap[carePlanId];
});

module.exports = caretasks;