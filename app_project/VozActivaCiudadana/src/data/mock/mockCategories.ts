export interface MockCategory {
  id: string;
  nombre: string;
  // Opcional: añadir un icono o color si se desea para UI
  // icon?: string;
  // color?: string;
}

export const mockCategories: MockCategory[] = [
  { id: 'infraestructura', nombre: 'Problemas de Infraestructura' },
  { id: 'servicios_publicos', nombre: 'Servicios Públicos Deficientes' },
  { id: 'medio_ambiente', nombre: 'Medio Ambiente y Contaminación' },
  { id: 'seguridad_ciudadana', nombre: 'Seguridad Ciudadana' },
  { id: 'propuesta_social', nombre: 'Propuesta Social o Mejora Comunitaria' },
  { id: 'corrupcion', nombre: 'Actos de Corrupción' },
  { id: 'transporte_movilidad', nombre: 'Transporte y Movilidad' },
  { id: 'otros', nombre: 'Otros Asuntos' },
];
