export interface MockUser {
  userId: string;
  displayName: string;
  // Opcional: añadir más detalles si son necesarios para la UI de mocks
  // profileImageUrl?: string;
}

export const mockUsers: MockUser[] = [
  { userId: 'user001', displayName: 'Elena Pérez' },
  { userId: 'user002', displayName: 'Carlos Gómez' },
  { userId: 'user003', displayName: 'Sofía Rodríguez' },
  { userId: 'user004', displayName: 'Anónimo' }, // Representa un usuario que elige ser anónimo para un reporte específico
  { userId: 'user005', displayName: 'Andrés Silva' },
  { userId: 'user006', displayName: 'Lucía Méndez' },
];
