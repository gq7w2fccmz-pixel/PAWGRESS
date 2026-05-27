function r(t){return t>=1e3?`${(t/1e3).toFixed(1)} t`:`${t} kg`}function e(t){const n=Math.floor(t/60),o=Math.floor(n/60);return o>0?`${o}h ${n%60}min`:`${n} Min`}export{r as a,e as f};
