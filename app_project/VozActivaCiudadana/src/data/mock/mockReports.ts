import { mockCategories, MockCategory } from "./mockCategories";
import { mockUsers, MockUser } from "./mockUsers";

export interface MockMediaObject {
  public_id: string;
  url: string;
  type: "image" | "video";
  thumbnailUrl?: string;
}

export interface MockReport {
  id: string;
  title: string;
  description: string;
  categoryID: string; // ID from mockCategories
  categoryNombre?: string; // Denormalized for convenience in mock display
  location: {
    latitude: number;
    longitude: number;
    addressText?: string;
  };
  cloudinaryMedia?: MockMediaObject[];
  isAnonymous: boolean;
  creatorUserID: string | null; // ID from mockUsers, null if anonymous
  creatorDisplayName: string; // Denormalized for convenience
  status: "nuevo" | "verificado" | "en_progreso" | "resuelto" | "rechazado";
  timestampCreated: string; // ISO 8601 Date string
  timestampUpdated: string; // ISO 8601 Date string
  supportCount: number;
  commentCount?: number; // Denormalized
  urgency?: "baja" | "media" | "alta";
}

// Helper function to get a category name
const getCategoryNombre = (categoryId: string): string => {
  const category = mockCategories.find((cat) => cat.id === categoryId);
  return category ? category.nombre : "Categoría Desconocida";
};

// Helper function to get a user display name
const getUserDisplayName = (
  userId: string | null,
  isAnonymous: boolean
): string => {
  if (isAnonymous || !userId) return "Anónimo";
  const user = mockUsers.find((usr) => usr.userId === userId);
  return user ? user.displayName : "Usuario Desconocido";
};

const now = new Date();

export const mockReports: MockReport[] = [
  {
    id: "report001",
    title: "Bache peligroso en Calle Luna",
    description:
      "Hay un bache muy grande en la Calle Luna, cerca de la esquina con Sol. Ya varios autos han tenido problemas. Necesita reparación urgente.",
    categoryID: mockCategories[0].id, // Problemas de Infraestructura
    location: {
      latitude: 10.9639, // Barranquilla, Colombia
      longitude: -74.7964,
      addressText: "Calle Luna esq. Sol, Barranquilla",
    },
    cloudinaryMedia: [
      {
        public_id: "sample1",
        url: "https://via.placeholder.com/300x200.png?text=Bache+Foto+1",
        type: "image",
      },
      {
        public_id: "sample2",
        url: "https://via.placeholder.com/300x200.png?text=Bache+Foto+2",
        type: "image",
      },
    ],
    isAnonymous: false,
    creatorUserID: mockUsers[0].userId, // Elena Pérez
    creatorDisplayName: getUserDisplayName(mockUsers[0].userId, false),
    status: "nuevo",
    timestampCreated: new Date(now.setDate(now.getDate() - 5)).toISOString(),
    timestampUpdated: new Date(now.setDate(now.getDate() - 4)).toISOString(),
    supportCount: 15,
    commentCount: 2,
    urgency: "alta",
  },
  {
    id: "report002",
    title: "Contenedor de basura desbordado",
    description:
      "El contenedor de basura en el parque Los Alamos lleva más de una semana sin recogerse. Atrae plagas y mal olor.",
    categoryID: mockCategories[1].id, // Servicios Públicos Deficientes
    location: {
      latitude: 10.965,
      longitude: -74.792,
      addressText: "Parque Los Alamos, Barranquilla",
    },
    cloudinaryMedia: [
      {
        public_id: "sample3",
        url: "https://via.placeholder.com/300x200.png?text=Basura+Foto",
        type: "image",
      },
    ],
    isAnonymous: true,
    creatorUserID: null,
    creatorDisplayName: getUserDisplayName(null, true),
    status: "verificado",
    timestampCreated: new Date(now.setDate(now.getDate() - 7)).toISOString(),
    timestampUpdated: new Date(now.setDate(now.getDate() - 6)).toISOString(),
    supportCount: 8,
    commentCount: 1,
    urgency: "media",
  },
  {
    id: "report003",
    title: "Propuesta: Jardín comunitario en lote baldío",
    description:
      "El lote baldío en la Av. Principal podría convertirse en un hermoso jardín comunitario. Propongo que nos organicemos para limpiarlo y sembrar.",
    categoryID: mockCategories[4].id, // Propuesta Social
    location: {
      latitude: 10.9615,
      longitude: -74.8,
      addressText: "Av. Principal #123, Barranquilla",
    },
    isAnonymous: false,
    creatorUserID: mockUsers[1].userId, // Carlos Gómez
    creatorDisplayName: getUserDisplayName(mockUsers[1].userId, false),
    status: "en_progreso",
    timestampCreated: new Date(now.setDate(now.getDate() - 10)).toISOString(),
    timestampUpdated: new Date(now.setDate(now.getDate() - 2)).toISOString(),
    supportCount: 32,
    commentCount: 5,
    urgency: "baja",
  },
  {
    id: "report004",
    title: "Falta de alumbrado público en Pasaje Estrellita",
    description:
      "Todo el Pasaje Estrellita está a oscuras por la noche, lo que lo hace inseguro. Se necesitan nuevas luminarias o reparar las existentes.",
    categoryID: mockCategories[0].id, // Problemas de Infraestructura
    location: {
      latitude: 10.968,
      longitude: -74.79,
      addressText: "Pasaje Estrellita, Barranquilla",
    },
    cloudinaryMedia: [],
    isAnonymous: false,
    creatorUserID: mockUsers[4].userId, // Andrés Silva
    creatorDisplayName: getUserDisplayName(mockUsers[4].userId, false),
    status: "nuevo",
    timestampCreated: new Date(now.setDate(now.getDate() - 2)).toISOString(),
    timestampUpdated: new Date(now.setDate(now.getDate() - 2)).toISOString(),
    supportCount: 5,
    commentCount: 0,
  },
  {
    id: "report005",
    title: "Posible caso de soborno a funcionario",
    description:
      "Fui testigo de una situación que parecía un soborno a un inspector en las oficinas municipales de tránsito el día de ayer. Prefiero no dar más detalles públicamente por seguridad.",
    categoryID: mockCategories[5].id, // Actos de Corrupción
    location: {
      latitude: 10.9645,
      longitude: -74.799,
      addressText: "Oficinas Municipales de Tránsito, Barranquilla",
    },
    isAnonymous: true,
    creatorUserID: null,
    creatorDisplayName: getUserDisplayName(null, true),
    status: "verificado",
    timestampCreated: new Date(now.setDate(now.getDate() - 1)).toISOString(),
    timestampUpdated: new Date(now.setDate(now.getDate() - 1)).toISOString(),
    supportCount: 2,
    commentCount: 0,
    urgency: "alta",
  },
];

// Optionally, inject categoryNombre into each report for easier display in mocks
mockReports.forEach((report) => {
  report.categoryNombre = getCategoryNombre(report.categoryID);
});
