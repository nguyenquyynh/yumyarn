
export const HistoryPack = (day) => {
    if (day <= 10) { return { color: '#FFF8DC', title: "pack.xs" } }
    else if (day <= 20) { return { color: '#FFE5B4', title: "pack.sm" } }
    else if (day <= 30) { return { color: '#FFC300', title: "pack.lg" } }
    else if (day <= 40) { return { color: '#FFA500', title: "pack.xl" } }
    else if (day <= 80) { return { color: '#FF8C00', title: "pack.big" } }
    else { return { color: '#FF7F50', title: "pack.limited" } }
}