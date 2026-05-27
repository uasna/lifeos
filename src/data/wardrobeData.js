// Wardrobe static data extracted from LifeOS.jsx.

export const WARDROBE_TYPES = Object.freeze([
  { id: "top", label: "Camisa" },
  { id: "bottom", label: "Pantalón" },
  { id: "shoes", label: "Tenis" },
]);

export const WARDROBE_COLOR_GUIDE = Object.freeze([
  "negro", "terracota", "blanco cálido", "gris carbón", "verde oliva", "azul marino", "crema", "borgoña", "camel", "gris claro"
]);

export const WARDROBE_FALLBACK_ITEMS = Object.freeze([
  { id:"fb-top-black", type:"top", name:"Camisa negra", color:"negro", style:"casual limpio" },
  { id:"fb-top-terra", type:"top", name:"Camisa terracota", color:"terracota", style:"casual cálido" },
  { id:"fb-top-white", type:"top", name:"Camisa blanca", color:"blanco cálido", style:"casual limpio" },
  { id:"fb-top-gray", type:"top", name:"Camisa gris", color:"gris", style:"casual neutro" },
  { id:"fb-top-navy", type:"top", name:"Camisa azul marino", color:"azul marino", style:"casual profundo" },
  { id:"fb-top-olive", type:"top", name:"Camisa verde oliva", color:"verde oliva", style:"casual tierra" },
  { id:"fb-bottom-bone", type:"bottom", name:"Pantalón blanco hueso", color:"blanco hueso", style:"casual limpio" },
  { id:"fb-bottom-beige", type:"bottom", name:"Pantalón beige", color:"beige", style:"casual cálido" },
  { id:"fb-bottom-sky", type:"bottom", name:"Pantalón azul cielo desgastado", color:"azul cielo desgastado", style:"casual claro" },
  { id:"fb-bottom-darkdenim", type:"bottom", name:"Pantalón denim oscuro", color:"denim oscuro", style:"casual base" },
  { id:"fb-bottom-charcoal", type:"bottom", name:"Pantalón gris carbón", color:"gris carbón", style:"casual profundo" },
  { id:"fb-shoes-black", type:"shoes", name:"Tenis negros", color:"negros", style:"base" },
  { id:"fb-shoes-gray", type:"shoes", name:"Tenis grises", color:"grises", style:"neutro" },
  { id:"fb-shoes-white", type:"shoes", name:"Tenis blancos", color:"blancos", style:"limpio" },
]);

