import { mockUsers, MockUser } from './mockUsers';
import { mockReports, MockReport } from './mockReports';

export interface MockComment {
  id: string;
  reportID: string; // ID from mockReports
  userID: string; // ID from mockUsers
  userDisplayName?: string; // Denormalized for convenience
  commentText: string;
  timestampCreated: string; // ISO 8601 Date string
  // Opcional: para respuestas a otros comentarios
  // parentCommentID?: string | null;
}

// Helper function to get a user display name
const getUserDisplayName = (userId: string): string => {
  const user = mockUsers.find(usr => usr.userId === userId);
  return user ? user.displayName : 'Usuario Desconocido';
};

const now = new Date();

export const mockComments: MockComment[] = [
  {
    id: 'comment001',
    reportID: mockReports[0].id, // Comment for "Bache peligroso en Calle Luna"
    userID: mockUsers[1].userId, // Carlos Gómez
    commentText: '¡Totalmente de acuerdo! Ayer casi se daña la suspensión de mi coche ahí.',
    timestampCreated: new Date(now.setDate(now.getDate() - 4)).toISOString(),
  },
  {
    id: 'comment002',
    reportID: mockReports[0].id, // Another comment for "Bache peligroso en Calle Luna"
    userID: mockUsers[2].userId, // Sofía Rodríguez
    commentText: 'Espero que lo arreglen pronto. Gracias por reportarlo, Elena.',
    timestampCreated: new Date(now.setDate(now.getDate() - 3)).toISOString(),
  },
  {
    id: 'comment003',
    reportID: mockReports[1].id, // Comment for "Contenedor de basura desbordado"
    userID: mockUsers[0].userId, // Elena Pérez
    commentText: 'Los vecinos ya hemos llamado varias veces y no hacen caso. A ver si por este medio nos escuchan.',
    timestampCreated: new Date(now.setDate(now.getDate() - 5)).toISOString(),
  },
  {
    id: 'comment004',
    reportID: mockReports[2].id, // Comment for "Propuesta: Jardín comunitario"
    userID: mockUsers[2].userId, // Sofía Rodríguez
    commentText: '¡Me encanta la idea! Cuenten conmigo para la limpieza y siembra.',
    timestampCreated: new Date(now.setDate(now.getDate() - 8)).toISOString(),
  },
  {
    id: 'comment005',
    reportID: mockReports[2].id, // Another for "Propuesta: Jardín comunitario"
    userID: mockUsers[5].userId, // Lucía Méndez
    commentText: '¿Ya hay alguna fecha tentativa para empezar?',
    timestampCreated: new Date(now.setDate(now.getDate() - 7)).toISOString(),
  },
  {
    id: 'comment006',
    reportID: mockReports[2].id, // Yet another for "Propuesta: Jardín comunitario"
    userID: mockUsers[0].userId, // Elena Pérez
    commentText: 'Podríamos organizar una reunión el próximo sábado para discutirlo.',
    timestampCreated: new Date(now.setDate(now.getDate() - 6)).toISOString(),
  }
];

// Optionally, inject userDisplayName into each comment for easier display in mocks
mockComments.forEach(comment => {
  comment.userDisplayName = getUserDisplayName(comment.userID);
});
