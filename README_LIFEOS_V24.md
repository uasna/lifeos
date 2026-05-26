# LifeOS v24 · Cálculo I video filter

Cambios:
- Las recomendaciones de videos de Cálculo quedan filtradas explícitamente para Cálculo I / MM201 II-PAC 2026.
- Los títulos y búsquedas agregan “Cálculo I”.
- Las búsquedas evitan Cálculo II/III, multivariable, vectorial, series, ecuaciones diferenciales, Laplace, Fourier e integrales múltiples.
- El backend de generación de práctica de Claude también recibe la regla de no adelantar temas ni recomendar recursos avanzados.

Reemplazar/extraer sobre el proyecto y ejecutar:

npm run build
git add .
git commit -m "Restrict calculus videos to Calculus I"
git push
