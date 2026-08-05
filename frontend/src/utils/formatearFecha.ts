export const formatearFecha = (fecha: string) => {
    if (!fecha) return "-";
  
    return new Date(fecha).toLocaleDateString("es-AR");
  };