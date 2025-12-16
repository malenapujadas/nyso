// buscar texto
export function matchesSearch(vino, query) {
  if (!query) return true;
  const texto = `${vino.nombre || ""} ${vino.bodega || ""} ${
    vino.descripcion || ""
  }`.toLowerCase();
  return texto.includes(query);
}

// filtros de tipo, uva, región, dulzor, cuerpo y año
export function matchesFilters(vino, filters) {
  const { tipo, uva, region, dulzor, cuerpo, año } = filters;
  if (tipo && vino.tipo !== tipo) return false;
  if (uva && vino.uva !== uva) return false;
  if (region && vino.region !== region) return false;
  if (dulzor && vino.dulzor !== dulzor) return false;
  if (cuerpo && vino.cuerpo !== cuerpo) return false;
  if (año && String(vino["año"]) !== String(año)) return false;
  return true;
}

// filtro x precio
export function matchesPrice(vino, min, max) {
  const precio = Number(vino.precio_aproximado || 0);
  if (min != null && precio < Number(min)) return false;
  if (max != null && precio > Number(max)) return false;
  return true;
}
